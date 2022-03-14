const bcrypt = require("bcryptjs");

const Event = require("../../models/event");
const User = require("../../models/user");
const Booking = require("../../models/booking");

//get the list of event what matches eventId
const events = async(eventIds) => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } });
        events.map((event) => {
            return {
                ...event._doc,
                _id: event.id,
                //refactor date to readable form
                date: new Date(event._doc.date).toISOString(),
                //call user with creator objectId
                creator: user.bind(this, event.creator),
            };
        });
        return events;
    } catch (err) {
        throw err;
    }
};

const singleEvent = async(eventId) => {
    try {
        const event = await Event.findById(eventId);
        return {
            ...event._doc,
            _id: event.id,
            creator: user.bind(this, event.creator),
        };
    } catch (err) {
        throw err;
    }
};

//get user data
const user = async(userId) => {
    try {
        const user = await User.findById(userId);
        return {
            ...user._doc,
            _id: user.id,
            createdEvents: events.bind(this, user._doc.createdEvents),
        };
    } catch (err) {
        throw err;
    }
};

module.exports = {
    events: async() => {
        try {
            const events = await Event.find();
            return events.map((event) => {
                //geting creator id
                return {
                    ...event._doc,
                    _id: event.id,
                    //refactor date to readable form
                    date: new Date(event._doc.date).toISOString(),
                    //call user error function with passing userid
                    //event._doc.creator return objectId of user from event table
                    creator: user.bind(this, event._doc.creator),
                }; //spread operator and convert object type _id to string
            });
        } catch (err) {
            throw err;
        }
    },

    bookings: async() => {
        try {
            const bookings = await Booking.find();
            return bookings.map((booking) => {
                return {
                    ...booking._doc,
                    _id: booking.id,
                    user: user.bind(this, booking._doc.user), //bind user function
                    event: singleEvent.bind(this, booking._doc.event), //bind singleEvent function
                    createdAt: new Date(booking._doc.createdAt).toISOString(),
                    updatedAt: new Date(booking._doc.updatedAt).toISOString(),
                };
            });
        } catch (err) {
            throw err;
        }
    },

    createEvent: async(args) => {
        //when creating event, firstly put user id in creator and then update createdEvents in user
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: "622d9dd96fc98cf268864a0e",
        });
        let createdEvent;
        try {
            const result = await event.save();
            createdEvent = {
                ...result._doc,
                _id: result._doc._id.toString(),
                //refactor date to readable form
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, result._doc.creator),
            }; //spread operator
            const creator = await User.findById("622d9dd96fc98cf268864a0e");

            if (!creator) {
                throw new Error("User not found.");
            }
            creator.createdEvents.push(event);
            await creator.save();
            return createdEvent;
        } catch (err) {
            throw err;
        }
    },

    createUser: async(args) => {
        try {
            const existingUser = await User.findOne({ email: args.userInput.email });
            if (existingUser) {
                throw new Error("User Exists already.");
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

            const user = new User({
                email: args.userInput.email,
                password: hashedPassword,
            });
            const result = await user.save();
            return {...result._doc, _id: result.id, password: null };
        } catch (err) {
            throw err;
        }
    },
    bookEvent: async(args) => {
        const fetchedEvent = await Event.findOne({ _id: args.eventId });
        const booking = new Booking({
            user: "622d9dd96fc98cf268864a0e",
            event: fetchedEvent,
        });
        const result = await booking.save();
        return {
            ...result._doc,
            _id: result.id,
            user: user.bind(this, result._doc.user), //bind user function
            event: singleEvent.bind(this, result._doc.event), //bind singleEvent function
            createdAt: new Date(result._doc.createdAt).toISOString(),
            updatedAt: new Date(result._doc.updatedAt).toISOString(),
        };
    },
    cancelBooking: async(args) => {
        try {
            const booking = await Booking.findById(args.bookingId).populate("event");
            const event = {
                ...booking.event._doc,
                _id: booking.event.id,
                creator: user.bind(this, booking.event._doc.creator),
            };
            await Booking.deleteOne({ _id: args.bookingId });
            return event;
        } catch (err) {
            throw err;
        }
    },
};
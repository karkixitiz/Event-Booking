const bcrypt = require("bcryptjs");

const Event = require("../../models/event");
const User = require("../../models/user");

//get the list of event what matches eventId
const events = (eventIds) => {
    return Event.find({ _id: { $in: eventIds } })
        .then((events) => {
            return events.map((event) => {
                return {
                    ...event._doc,
                    _id: event.id,
                    //refactor date to readable form
                    date: new Date(event._doc.date).toISOString(),
                    //call user with creator objectId
                    creator: user.bind(this, event.creator),
                };
            });
        })
        .catch((err) => {
            throw err;
        });
};

//get user data
const user = (userId) => {
    return User.findById(userId)
        .then((user) => {
            return {
                ...user._doc,
                _id: user.id,
                createdEvents: events.bind(this, user._doc.createdEvents),
            };
        })
        .catch((err) => {
            throw err;
        });
};

module.exports = {
    events: () => {
        return Event.find()
            .then((events) => {
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
            })
            .catch((err) => {
                throw err;
            });
    },
    createEvent: (args) => {
        //when creating event, firstly put user id in creator and then update createdEvents in user
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: "622d9dd96fc98cf268864a0e",
        });
        let createdEvent;
        return event
            .save()
            .then((result) => {
                createdEvent = {
                    ...result._doc,
                    _id: result._doc._id.toString(),
                    //refactor date to readable form
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this, result._doc.creator),
                }; //spread operator
                return User.findById("622d9dd96fc98cf268864a0e");
            })
            .then((user) => {
                if (!user) {
                    throw new Error("User not found.");
                }
                user.createdEvents.push(event);
                return user.save();
            })
            .then((result) => {
                return createdEvent;
            })
            .catch((err) => {
                throw err;
            });
    },
    createUser: (args) => {
        //return promise
        return User.findOne({
                email: args.userInput.email,
            })
            .then((user) => {
                if (user) {
                    throw new Error("User Exists already.");
                }
                return bcrypt.hash(args.userInput.password, 12);
            })
            .then((hashedPassword) => {
                const user = new User({
                    email: args.userInput.email,
                    password: hashedPassword,
                });
                return user.save();
            })
            .then((result) => {
                return {...result._doc, _id: result.id, password: null };
            })
            .catch((err) => {
                throw err;
            });
    },
};
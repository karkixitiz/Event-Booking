const User = require("../../models/user");
const Event = require("../../models/event");
const { dateToString } = require("../../helpers/date");

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

//get the list of event what matches eventId
const events = async(eventIds) => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } });
        events.map((event) => {
            return transformEvent(event);
        });
        return events;
    } catch (err) {
        throw err;
    }
};

const singleEvent = async(eventId) => {
    try {
        const event = await Event.findById(eventId);
        return transformEvent(event);
    } catch (err) {
        throw err;
    }
};
const transformEvent = (event) => {
    return {
        ...event._doc,
        _id: event.id,
        date: dateToString(event._doc.date),
        creator: user.bind(this, event.creator),
    };
};
const transformBooking = (booking) => {
    return {
        ...booking._doc,
        _id: booking.id,
        user: user.bind(this, booking._doc.user), //bind user function
        event: singleEvent.bind(this, booking._doc.event), //bind singleEvent function
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt),
    };
};
exports.transformBooking = transformBooking;
exports.transformEvent = transformEvent;
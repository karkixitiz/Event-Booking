const Event = require("../../models/event");
const { transformEvent } = require("./merge");

module.exports = {
    events: async() => {
        try {
            const events = await Event.find();
            return events.map((event) => {
                //geting creator id
                return transformEvent(event);
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
            date: dateToString(args.eventInput.date),
            creator: "622d9dd96fc98cf268864a0e",
        });
        let createdEvent;
        try {
            const result = await event.save();
            createdEvent = transformEvent(result);
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
};
const userResolver = require("./auth");
const eventsResolver = require("./events");
const bookingResolver = require("./booking");

const rootResolver = {
    ...userResolver,
    ...eventsResolver,
    ...bookingResolver,
};

module.exports = rootResolver;
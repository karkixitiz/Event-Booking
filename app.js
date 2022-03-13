const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql").graphqlHTTP;
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Event = require("./models/event");
const User = require("./models/user");

const app = express();

const port = 3000;

app.use(bodyParser.json());

/* app.get("/", (req, res, next) => {
    res.send("Hello world");
}); */

app.use(
    "/graphql",
    graphqlHttp({
        schema: buildSchema(`
			type Event{
				_id:ID!
				title:String! 
				description:String! 
				price:Float! 
				date:String! 
			}
			 
			type User{
				_id:ID!
				email:String! 
				password:String 
			}

			input EventInput{
				title:String! 
				description:String! 
				price:Float! 
				date:String! 
			}

			input UserInput{
				email:String! 
				password:String
			}

			type RootQuery{
				events:[Event!]!
			}
			type RootMutation{
				createEvent(eventInput:EventInput):Event
				createUser(userInput:UserInput):User
			}
			schema{
				query:RootQuery
				mutation:RootMutation
			}
	`),
        rootValue: {
            events: () => {
                return Event.find()
                    .then((events) => {
                        return events.map((event) => {
                            return {...event._doc, _id: event.id }; //spread operator and convert object type _id to string
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
                        createdEvent = {...result._doc, _id: result._doc._id.toString() }; //spread operator
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
        }, //bundle of all resolvers
        graphiql: true,
    })
);

mongoose
    .connect(
        `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.epmo5.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
    )
    .then(() => {
        app.listen(port);
        console.log(`Express server is running on ${port}`);
    })
    .catch((err) => {
        console.log(err);
    });
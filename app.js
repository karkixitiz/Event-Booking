const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql").graphqlHTTP;
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");

const Event = require("./models/event");

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

			input EventInput{
				title:String! 
				description:String! 
				price:Float! 
				date:String! 
			}

			type RootQuery{
				events:[Event!]!
			}
			type RootMutation{
				createEvent(eventInput:EventInput):Event
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
                /* const event = {
				_id: Math.random().toString(),
				title: args.eventInput.title,
				description: args.eventInput.description,
				price: +args.eventInput.price,
				date: new Date().toISOString(),
				}; */

                const event = new Event({
                    title: args.eventInput.title,
                    description: args.eventInput.description,
                    price: +args.eventInput.price,
                    date: new Date(args.eventInput.date),
                });
                return event
                    .save()
                    .then((result) => {
                        console.log(result);
                        return {...result._doc, _id: result._doc._id.toString() }; //spread operator
                    })
                    .catch((err) => {
                        console.lgo(err);
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
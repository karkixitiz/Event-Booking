const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql").graphqlHTTP;
const { buildSchema } = require("graphql");

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
			type RootQuery{
				events:[String!]!
			}
			type RootMutation{
				createEvent(name:String):String
			}
			schema{
				query:RootQuery
				mutation:RootMutation
			}
	`),
        rootValue: {
            events: () => {
                return ["Romantic Cooking", "all night coding"];
            },
            createEvent: (args) => {
                const eventName = args.name;
                return eventName;
            },
        }, //bundle of all resolvers
        graphiql: true,
    })
);

app.listen(port);
console.log(`Express server is running on ${port}`);
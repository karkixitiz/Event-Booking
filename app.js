const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql").graphqlHTTP;
const mongoose = require("mongoose");
const isAuth = require("./middleware/is-auth");

const graphQlSchema = require("./graphql/schema/index");
const graphQlResolvers = require("./graphql/resolvers/index");

const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use(isAuth);

app.use(
    "/graphql",
    graphqlHttp({
        schema: graphQlSchema,
        rootValue: graphQlResolvers, //bundle of all resolvers
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
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.get("/", (req, res, next) => {
    res.send("Hello world");
});
app.listen(port);
console.log(`Express server is running on ${port}`);
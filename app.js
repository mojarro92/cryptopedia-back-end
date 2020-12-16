const express = require("express");
require('dotenv').config()
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
// IMPORTING THE USERS MODEL
const User = require('./models/User')

app.use(cors());
app.options('*', cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(logger("dev"));
// app.use(cookieParser());

let protectedRoute = (req, res, next) => {
    if (!req.headers.authorization)
        return res.status(403).send("Unauthenticated");
    let token = req.headers.authorization.split(" ")[1];

    if (!token) return res.status(403).send("Unauthenticated");
    try {
        var decoded = jwt.verify(token, "shhhhh");
    } catch (err) {
        return res.status(403).send("Unauthenticated");
    }

    if (!decoded) res.status(403).send("Unauthenticated");

    User.findById(decoded.id).then((user) => {
        if (!user) res.status(403).send("Unauthenticated");
        else {
            next();
        }
    });
}

mongoose
    .connect(process.env.MONGO_DB, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
    .catch(err => console.log('error connecting to mongo', err));



app.get("/users", (req, res) => {
    User.find()
        .then((users) => {
            res.json(users)
        })
        .catch(err => console.log(err))
});

app.get("/users/:userId", (req, res) => {
    User.findById(req.params.userId)
        .then((user) => {
            res.json(user)
        })
        .catch(err => {
            console.log(err)
        })
})


app.use("/auth", require("./routes/users"))

app.listen(process.env.PORT, () => {
    console.log('Listening!');
})
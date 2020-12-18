const express = require('express');
const app = express();
const User = require("../models/User");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

app.post("/signup", (req, res) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) console.log("HASHING ERROR", err);
        else {
            User.create({
                username: req.body.username,
                password: hash,
            })
                .then(user => {
                    res.status(200).send("user created")
                })
                .catch(err => {
                    res.status(500).send("failed to create")
                });
        }
    });
});

app.post("/login", (req, res) => {
    User.findOne({ username: req.body.username }).then((user) => {
        if (!user) res.status(403).send("Invalid Credentials");
        else if (user) {
            bcrypt.compare(req.body.password, user.password, function (err, match) {
                if (err) res.status(500).send("Wrong Password.")
                if (match) {
                    var token = jwt.sign({ id: user._id }, "12345")
                    res.json({ token: token })
                } else res.status(403).send("Invalid credentials")
            })
        }
    })
})

module.exports = app;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    password: String,
    dollars: Number,
    name: String
});

module.exports = mongoose.model('User', userSchema, "users");

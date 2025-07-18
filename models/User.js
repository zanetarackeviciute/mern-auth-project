const {model, Schema} = require("mongoose");

const User = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    refreshToken: {type: String, required: true, unique: true}
});

module.exports = model("User", User);
const mongoose = require('mongoose')

const Schema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique:true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    roles: [
        {
        type: mongoose.Schema.Types.ObjectID,
        ref: "Role"
        }
    ],
    signIn_date: {
        type: Date,
        default:Date.now()
    }
})

module.exports = mongoose.model('SignUp', Schema)
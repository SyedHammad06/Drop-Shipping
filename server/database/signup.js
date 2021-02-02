const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

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
    year: {
        type: Number
    },
    month: {
        type: String
    },
    day: {
        type: Number
    },
    gender: {
        type: String,
        required: true
    },
    signIn_date: {
        type: Date,
        default:Date.now()
    }
})

module.exports = mongoose.model('SignUp', Schema)
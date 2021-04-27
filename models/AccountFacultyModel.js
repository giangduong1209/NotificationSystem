const mongoose = require('mongoose')
const Schema = mongoose.Schema


const AccountFacultySchema = new Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    permission: String,
})

module.exports = mongoose.model('AccountFaculty', AccountFacultySchema)
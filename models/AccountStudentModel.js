const mongoose = require('mongoose')
const Schema = mongoose.Schema


const AccountStudentSchema = new Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    picture: String
})

module.exports = mongoose.model('AccountStudent', AccountStudentSchema)
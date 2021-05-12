const mongoose = require('mongoose')
const Schema = mongoose.Schema


const AccountStudentSchema = new Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    class: String,
    faculty: String,
    picture: String
})

module.exports = mongoose.model('AccountStudent', AccountStudentSchema)
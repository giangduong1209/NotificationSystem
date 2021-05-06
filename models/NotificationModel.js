const mongoose = require('mongoose')
const Schema = mongoose.Schema


const Notification = new Schema({
    title: String,
    context: {
        type: String,
    },
    permission: String,
})

module.exports = mongoose.model('Notification', Notification)
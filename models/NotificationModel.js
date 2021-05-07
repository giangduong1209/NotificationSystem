const mongoose = require('mongoose')
const Schema = mongoose.Schema
const NotificationSchema = new Schema({
    title: String,
    context: String,
    permission: String,
    faculity:String
})

module.exports = mongoose.model('Notification', NotificationSchema)

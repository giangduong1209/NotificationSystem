const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ContentPostSchema = new Schema({
    email: String,
    name:String,
    titlePost: String,
    contextPost: String,
    datePost:Date,
    image:String,
})

module.exports = mongoose.model('ContentPost', ContentPostSchema)
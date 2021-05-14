const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ContentPostSchema = new Schema({
    email: String,
    titlePost: String,
    contextPost: String,
})

module.exports = mongoose.model('ContentPost', ContentPostSchema)
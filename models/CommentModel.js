const mongoose = require('mongoose')
const Schema = mongoose.Schema
const CommentSchema = new Schema({
    email: String,
    name:String,
    contextPost: String,
    datePost:Date,
    idPost:String
})

module.exports = mongoose.model('Comment', CommentSchema)
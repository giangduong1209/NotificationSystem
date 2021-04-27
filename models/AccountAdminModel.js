const mongoose = require('mongoose')
const Schema = mongoose.Schema


const AccountAdminSchema = new Schema({
    email: String,
    password: String
})

module.exports = mongoose.model('AccountAdmin', AccountAdminSchema)
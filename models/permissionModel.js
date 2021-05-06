const mongoose = require('mongoose')
const Schema = mongoose.Schema


const Permission = new Schema({
    name: String,
    fullname: {
        type: String,
    }
})

module.exports = mongoose.model('Permission', Permission)
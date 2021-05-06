const mongoose = require('mongoose')
const Schema = mongoose.Schema
const NotificationSchema = new Schema({
    title: String,
<<<<<<< Updated upstream
    context: {
        type: String,
    },
    password: String,
    permission: String,
})

module.exports = mongoose.model('AccountFaculty', AccountFacultySchema)
=======
    context: String,
    permission: String,
})

module.exports = mongoose.model('Notification', NotificationSchema)
>>>>>>> Stashed changes

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    isMember: {type: Boolean, default: false},
    isAdmin: {type: Boolean, default: false},
})

UserSchema
    .virtual('url')
    .get(() => {
        return '/user/' + this._id
    })

module.exports = mongoose.model('User', UserSchema)
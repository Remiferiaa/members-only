const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { DateTime } = require("luxon");

const MessageSchema = new Schema({
    postedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    postedAt: { type: Date, default: Date.now },
    msgTitle: { type: String, required: true },
    msgBody: { type: String, required: true }
})

MessageSchema
    .virtual('posted')
    .get(function() {    
        return this.postedAt.toLocaleDateString()
    })

module.exports = mongoose.model('Message', MessageSchema)
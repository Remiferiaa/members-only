require('dotenv').config()
const Message = require('../models/message')
const { body, validationResult } = require('express-validator')

exports.message_list = async (req, res, next) => {
    try {
        const messages = await Message.find().populate('postedBy').exec()
        res.render('index', { title: 'Posts', messages: messages })
    } catch (err) {
        return next(err)
    }
}

exports.message_create_get = (req, res, next) => {
    res.render('message', { title: 'New Message' })
}

exports.message_create_post = [
    body('title').trim().isLength({ min: 1 }).withMessage("Title can't be empty"),
    body('content').trim().isLength({ min: 1 }).withMessage("Body can't be empty"),

    (req, res, next) => {
        const error = validationResult(req)
        const message = new Message ({
            msgTitle: req.body.title,
            msgBody: req.body.content
        })
        if(!error.isEmpty()) {
            res.render('message', { title: 'New Message', title: message.msgTitle, content: message.msgBody, errors: error.mapped() })
            return
        } else {
            message.save((err) => {
                if (err) {
                    return next(err)
                }
                res.redirect('/')
            })
        }
    }
]

exports.message_delete_post = (req, res, next) => {
    Message.findByIdAndDelete(req.body.msgid, function (err, result) {
        if (err) {
            return next(err)
        } else {
            res.redirect('/')
        }
    })
}
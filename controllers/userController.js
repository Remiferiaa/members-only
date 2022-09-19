require('dotenv').config()
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const { body, validationResult } = require('express-validator')

exports.user_create_get = (req, res, next) => {
    res.render('form', { title: 'New User' })
}

exports.user_create_post = [
    body('username').trim().isLength({ min: 4 }).withMessage("Username can't be shorter than 4 characters"),
    body('password').trim().isLength({ min: 4 }).withMessage("Password can't be shorter than 4 characters"),

    (req, res, next) => {
        const errors = validationResult(req)
        const user = new User({
            username: req.body.username,
            password: req.body.password
        })
        if (!errors.isEmpty()) {
            res.render('form', { title: 'New User' , user, error: errors.array() })
            return
        } else {
            bcrypt.hash(user.password, 10, (err, hashedPassword) => {
                if (err) {
                    return next(err)
                } else {
                    user.password = hashedPassword
                    user.save((err) => {
                        if (err) {
                            return next(err)
                        }
                        res.redirect('/')
                    })
                }
            })
        }
    }
]

exports.user_login_get = (req, res, next) => {
    res.render('login', { title: 'Login' })
}
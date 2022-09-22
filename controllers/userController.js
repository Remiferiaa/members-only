require('dotenv').config()
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const { body, validationResult } = require('express-validator')

exports.user_create_get = (req, res, next) => {
    res.render('form', { title: 'New User', state: 'base', message: req.flash('error') })
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
            res.render('form', { title: 'New User', state: 'base', user, error: errors.mapped() })
            return
        } else {
            User.findOne({ username: req.body.username }, function (err, result) {
                if (err) {
                    return next(err)
                } if (result) {
                    res.render('form', { title: 'New User', state: 'base', user, message: 'Username taken' })
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
                                req.login(user, function (err) {
                                    if (err) { return next(err); }
                                    return res.redirect('/');
                                })
                            })
                        }
                    })
                }
            })
        }
    }
]

exports.user_login_get = (req, res, next) => {
    res.render('login', { title: 'Login', message: req.flash('error') })
}

exports.user_member_get = (req, res, next) => {
    res.render('form', { title: 'Become a member', state: 'member', user: req.user, message: req.flash('error') })
}

exports.user_member_post = [
    body('password').trim().isLength({ min: 4 }).withMessage("Password can't be shorter than 4 characters").equals(process.env.MEMPW).withMessage('Wrong Password'),

    (req, res, next) => {
        const errors = validationResult(req)
        const user = new User({
            username: req.user.username,
            password: req.user.password,
            isMember: true,
            _id: req.user.id
        })
        if (!errors.isEmpty()) {
            res.render('form', { title: 'Become a member', state: 'member', user: req.user, errors: errors.mapped() })
            return
        } else {
            User.findByIdAndUpdate(req.user.id, user, {}, function (err, result) {
                if (err) {
                    return next(err)
                } else {
                    res.redirect('/')
                }
            })
        }
    }
]

exports.user_admin_get = (req, res, next) => {
    res.render('form', { title: 'Become an admin', user: req.user, state: 'admin', message: req.flash('error') })
}

exports.user_admin_post = [
    body('password').trim().isLength({ min: 4 }).withMessage("Password can't be shorter than 4 characters").equals(process.env.ADMINPW).withMessage('Wrong Password'),

    (req, res, next) => {
        const errors = validationResult(req)
        const user = new User({
            username: req.user.username,
            password: req.user.password,
            isAdmin: true,
            _id: req.user.id
        })
        if (!errors.isEmpty()) {
            res.render('form', { title: 'Become an admin', state: 'admin', user: req.user, errors: errors.mapped() })
            return
        } else {
            User.findByIdAndUpdate(req.user.id, user, {}, function (err, result) {
                if (err) {
                    return next(err)
                } else {
                    res.redirect('/')
                }
            })
        }
    }
]
require('dotenv').config()
const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/userController')
const User = require('../models/user')
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require('bcryptjs')

function authCheck(req, res, next) {
    if (req.user) {
      return next()
    } else {
      res.redirect('/users/login')
      return
    }
  }

passport.use(
    new LocalStrategy((username, password, done) => {
        User.findOne({ username: username }, (err, user) => {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, { message: "Incorrect username" });
            }
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                  // passwords match! log user in
                  return done(null, user)
                } else {
                  // passwords do not match!
                  return done(null, false, { message: "Incorrect password" })
                }
              })
        });
    })
);

passport.serializeUser(function (user, done) {
    process.nextTick(function () {
        done(null, user.id);
    })
});


passport.deserializeUser(function (id, done) {
    process.nextTick(function () {
        return User.findById(id, function (err, user) {
            done(err, user);
        });
    })
});

router.get('/create', user_controller.user_create_get)

router.post('/create', user_controller.user_create_post)

router.get('/login', user_controller.user_login_get)

router.post("/login", passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/"
    })
);

router.get("/logout", (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
});

router.get('/member', authCheck, user_controller.user_member_get)

router.post('/member', user_controller.user_member_post)

router.get('/admin', authCheck, user_controller.user_admin_get)

router.post('/admin', user_controller.user_admin_post)

module.exports = router;

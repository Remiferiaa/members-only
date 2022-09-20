const express = require('express');
const router = express.Router();
const message_controller = require('../controllers/messageController')

function authCheck(req, res, next) {
  if (req.user) {
    return next()
  } else {
    res.redirect('/users/login')
    return
  }
}

router.get('/', message_controller.message_list)

router.get('/message', authCheck, message_controller.message_create_get)

router.post('/message', message_controller.message_create_post)

router.post('/delete', message_controller.message_delete_post)

module.exports = router;

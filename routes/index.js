const express = require('express');
const router = express.Router();
const messageDB = require('../tools/message-db');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const PHONE_NUMBER = process.env.PHONE_NUMBER;

// Receive text messages
router.post('/receive', function(req, res) {
  if (req.body.AccountSid == process.env.ACCOUNT_SID) {
    messageDB.createMessage(req.body.Body, req.body.From, PHONE_NUMBER, false);
    let twiml = new MessagingResponse();
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
  } else {
    res.sendStatus(400);
    res.end("Invalid SID");
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.redirect('/messages');
});

module.exports = router;

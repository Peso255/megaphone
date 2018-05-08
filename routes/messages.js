const express = require('express');
const router = express.Router();
const sendMessage = require('../public/javascripts/send-message');
const validator = require('../public/javascripts/validate');
const messageDB = require('../public/javascripts/message-db');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const PHONE_NUMBER = process.env.PHONE_NUMBER;

router.get('/receive', function(req, res) {
  res.redirect('/messages');
});

/* Index route. Shows all conversations */
router.get('/', function(req, res) {
  // res.render('index', { title: 'Messages' });
  messageDB.getAllConversations( allConvos => {
    res.render('messages/index', {allConvos: allConvos, title: "All Conversations"})
  });
});

router.get('/new', function(req, res) {
  res.render('messages/new', { title: 'Create New Message' });
});

router.get('/new/error', function(req, res) {
  res.render('messages/new', { title: 'Create New Message', error: 'Invalid number or no message. Try again.' });
});

router.get('/deleted', function(req, res) {
  messageDB.getAllConversations( allConvos => {
    res.render('messages/index', {allConvos: allConvos, title: "All Conversations", error: 'Conversation deleted.'})
  });
});

router.get('/error', function(req, res) {
  messageDB.getAllConversations( allConvos => {
    res.render('messages/index', {allConvos: allConvos, title: "All Conversations", error: 'Input error occurred.'})
  });
});

router.get('/delete/:id', function(req, res) {
  messageDB.getConversationById(req.params.id, convo => {
    if (convo) {
      res.render('messages/delete', { title: 'Confirm Delete' , convo:convo});
    } else {
      // nothing found with :id?
      res.redirect('/messages');
    }
  });
});

/* Show route. Shows one conversations with id */
router.get('/:id', function(req, res) {
  messageDB.getConversationById(req.params.id, convo => {
    if (convo) {
      res.render('messages/show', {title: 'Conversation with '+convo.number, convo: convo});
    } else {
      // nothing found with :id?
      res.redirect('/messages');
    }
  });
});

router.post('/send', function(req, res) {
  const message = req.body.message;
  const number = req.body.number.split(", ");
  if (!validator.validateBatch(number) || !validator.validateBody(message)) {
    res.redirect('/messages/new/error');
  } else {
    for (let i = 0; i < number.length; i++) {
      sendMessage.sendMessage(message, PHONE_NUMBER, number[i], true);
      messageDB.createMessage(message, PHONE_NUMBER, number[i], true);
    }
    res.redirect('/messages');
  }
});

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

/* Delete convo */
router.post('/delete/:id', function(req, res) {
  messageDB.deleteMessage(req.body.id);
  res.redirect('/messages/deleted');
});

/* Process replies */
router.post('/send/:id', function(req, res) {
  const message = req.body.message;
  messageDB.getNumberById(req.params.id, number => {
    if (!number || !validator.validateBody(message)) {
      res.redirect('/messages/error');
    } else {
      sendMessage.sendMessage(message, PHONE_NUMBER, number, true);
      messageDB.createMessage(message, PHONE_NUMBER, number, true);
      res.redirect('/messages/' + req.params.id);
    }
  });
});

module.exports = router;

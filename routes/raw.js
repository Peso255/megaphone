const express = require('express');
const router = express.Router();
const messageDB = require('../public/javascripts/message-db');
const ipCheck = require('../public/javascripts/ipcheck.js');
const UIDminlength = 12;

/* GET conversation history by UID */
router.get('/conversations/id/:id', function(req, res) {
  if (req.params.id.length < UIDminlength) {
    res.sendStatus(404);
  } else {
    messageDB.getConversationById(req.params.id, convo => {
      if (convo) {
        res.send(convo);
      } else {
        res.sendStatus(404);
      }
    });
  }
});

/* GET conversation history by phone number */
router.get('/conversations/number/:number', function(req, res) {
  if (!ipCheck.checkIP(req.headers["X-Forwarded-For"])) {
    res.sendStatus(401);
  } else {
    messageDB.getConversationByNumber(req.params.number, convo => {
      if (convo) {
        res.send(convo);
      } else {
        res.sendStatus(404);
      }
    });
  }
});

/* GET phone number from UID */
router.get('/numbers/id/:id', function(req, res) {
  if (req.params.id.length < UIDminlength) {
    res.sendStatus(404);
  } else {
    messageDB.getNumberById(req.params.id, number => {
      if (number) {
        res.send(number);
      } else {
        res.sendStatus(404);
      }
    });
  }
});

module.exports = router;
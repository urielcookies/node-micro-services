var express = require('express');
var router = express.Router();

// /
router.get('/', function(req, res, next) {
  res.send('Barber Scheduler Routes');
});

// /barber-scheduler/test
router.get('/test', function(req, res, next) {
  res.json({"message": "Hello"});
});

module.exports = router;

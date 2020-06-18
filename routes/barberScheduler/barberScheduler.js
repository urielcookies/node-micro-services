const express = require('express');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');

const mysqlConnection = require('./utils/handleDisconnect');

const router = express.Router();

// Create connection 
mysqlConnection();

// root
router.get(`/`, (req, res, next) => {
  res.send('Barber Scheduler Routes');
});

// /barber-scheduler/secret
router.get('/test', verifyToken, (req, res, next) => {
  jwt.verify(req.token, 'secretKey???', (err, authData) => {
    if (err) res.sendStatus(403);
     else {
      res.json({
        authData
      })
    }
  })
});

// /barber-scheduler/login
router.post('/login', (req, res, next) => {
  // Mock User 

  jwt.sign({email:'urielcookies@outlook.com'}, "secretKey???", {
    expiresIn: '365d' // expires in 365 days
  }, (err, token) => res.json({token}));
});

function verifyToken (req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (bearerHeader !== undefined) {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

module.exports = router;
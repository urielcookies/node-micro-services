const express = require('express');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');

// const mysqlConnection = require('./utils/handleDisconnect');

const router = express.Router();

// Create connection 
// mysqlConnection();
// const mysql = require('mysql');

const db_config = {
  host     : '173.254.39.157',
  user     : 'hzmnrnmy_uriel',
  password : 'mercerst.13',
  database : 'hzmnrnmy_barber-scheduler'
};

let db;
const mysqlConnection = () => {
  db = mysql.createConnection(db_config);               // Recreate the connection, since
                                                        // the old one cannot be reused.

  db.connect(function(err) {                            // The server is either down
    if(err) {                                           // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(mysqlConnection, 2000);               // We introduce a delay before attempting to reconnect,
    }                                                   // to avoid a hot loop, and to allow our node script to
  });                                                   // process asynchronous requests in the meantime.
                                                        // If you're also serving http, display a 503 error.
  db.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') {       // Connection to the MySQL server is usually
      mysqlConnection();                               // lost due to either server restart, or a
    } else {                                            // connnection idle timeout (the wait_timeout
      throw err;                                        // server variable configures this)
    }
  });
};
mysqlConnection();


// root
router.get(`/`, (req, res, next) => {
  res.send('Barber Scheduler Routes');
});


// /barber-scheduler/getboss
router.get('/getboss', verifyToken, (req, res, next) => {
  jwt.verify(req.token, 'secretKey???', (err, authData) => {
    if (err) res.sendStatus(403);
     else {
       const sql = 'SELECT * FROM `hzmnrnmy_barber-scheduler`.users WHERE id = 1;';
       db.query(sql, (err, result) => {
          if (err) throw err;
          res.json({
            result
          })
       })

    }
  })
});


// /barber-scheduler/secret
router.get('/secret', verifyToken, (req, res, next) => {
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
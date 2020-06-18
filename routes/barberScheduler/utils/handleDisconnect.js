const mysql = require('mysql');

const db_config = {
  host     : '173.254.39.157',
  user     : 'hzmnrnmy_uriel',
  password : 'mercerst.13',
  database : 'hzmnrnmy_barber-scheduler'
};

const mysqlConnection = () => {
  const connection = mysql.createConnection(db_config); // Recreate the connection, since
                                                        // the old one cannot be reused.

  connection.connect(function(err) {                    // The server is either down
    if(err) {                                           // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(mysqlConnection, 2000);               // We introduce a delay before attempting to reconnect,
    }                                                   // to avoid a hot loop, and to allow our node script to
  });                                                   // process asynchronous requests in the meantime.
                                                        // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') {       // Connection to the MySQL server is usually
      mysqlConnection();                               // lost due to either server restart, or a
    } else {                                            // connnection idle timeout (the wait_timeout
      throw err;                                        // server variable configures this)
    }
  });
};

module.exports = mysqlConnection;

const express = require('express')

const barberSchedulerRouter = require('./routes/barberScheduler/barberScheduler');

const app = express()
const port = process.env.PORT || 1337;

app.get('/', (req, res) => res.send('Hello World!'))
app.use('/barber-scheduler', barberSchedulerRouter);

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port,
  () => console.log(`Example app listening at http://localhost:${port}`)
);

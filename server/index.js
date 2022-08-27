const path = require('path');
const express = require('express');
const morgan = require('morgan');
const compression = require('compression');

const PORT = process.env.DATABASE_URL || 8080;
const app = express();
const socketio = require('socket.io');

module.exports = app;

// logging middleware
app.use(morgan('dev'));

// body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// compression middleware
app.use(compression());
// static file-serving middleware
app.use(express.static(path.join(__dirname, '..', 'public')));
// auth and api routes

// any remaining requests with an extension (.js, .css, etc.) send 404
app.use((req, res, next) => {
  if (path.extname(req.path).length) {
    const err = new Error('Not found');
    err.status = 404;
    next(err);
  } else {
    next();
  }
});
// tell our server where our home base is (index.html)
// sends index.html
app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public/index.html'));
});

// error handling endware
app.use((err, req, res, next) => {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error.');
});

// start listening and create a server object
const startListening = () => {
  const server = app.listen(PORT, () =>
    console.log(`mixing it up on port ${PORT}`)
  ); // require socket into our server
  const io = socketio(server);
  // include our secketio variable and require our socket folder
  require('./socket')(io);
};
startListening();

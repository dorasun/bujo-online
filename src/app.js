// app.js
const express = require('express');
const app = express();

require('./db.js');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Year = mongoose.model('Year');
const Month = mongoose.model('Month');
const Week = mongoose.model('Week');
const Day = mongoose.model('Day');
const Item = mongoose.model('Item');
const Task = mongoose.model('Task');
const Event = mongoose.model('Event');
const Note = mongoose.model('Note');

const bodyParser = require('body-parser');
const session = require('express-session');

const sessionOptions = {
    secret: 'secret cookie thang (store this elsewhere!)',
    resave: true,
      saveUninitialized: true
};
app.use(session(sessionOptions));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
	res.render('index');
});

app.listen(3000);

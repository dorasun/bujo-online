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

app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
});

app.listen(3000);

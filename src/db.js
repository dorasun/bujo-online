// second draft data model
const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');

/*
	User
	my site will require authentication, so users will have a username and password
	users will have Year, Month, Week, and Day objects but those will be embedded
	only years, months, weeks, and days with added data will be stored, and not empty years
	users will also have pages, which represent additional notes outside date related ones
 */
const User = new mongoose.Schema({
	// username provided by authentication plugin
	// password hash provided by authentication plugin
	pages: [{type: mongoose.Schema.Types.ObjectId, ref: 'Page'}],
	years: [{type: mongoose.Schema.Types.ObjectId, ref: 'Year'}]
});

/*
	Task
	represents an actionable item
 */
const Task = new mongoose.Schema({
	content: String,
	completed: Boolean,
	migrated: Boolean,
	scheduled: Boolean
});

/*
	Event
	represents a date-related entries
 */
const Event = new mongoose.Schema({
	content: String
});

/*
	Notes
	represents a note: can be facts, ideas, thoughts, observations
 */
const Note = new mongoose.Schema({
	content: String
});

/*
	Item
	represents a list of items in a user's notes
 */
const Item = new mongoose.Schema({
	tasks: [Task],
  	events: [Event], 
  	notes: [Note]
});

/*
	Page
	represents a page in a user's bujo that isn't time related
 */
const Page = new mongoose.Schema({
	title: {type: String, required: true},
	items: [Item]
});
Page.plugin(URLSlugs('title'));

/*
	Year
	represents a user's notes for the year
 */
const Year = new mongoose.Schema({
	user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
	year: {type: Number, required: true},
	items: {type: [Item], required: true},
	months: [{type: mongoose.Schema.Types.ObjectId, ref: 'Month'}]
});

/*
	Month
	represents a user's notes for the month
 */
const Month = new mongoose.Schema({
	user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
	month: {type: Number, required: true},
	items: {type: [Item], required: true},
	weeks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Week'}]
});

/*
	Week
	represents a user's notes for the week
 */
const Week = new mongoose.Schema({
	user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
	week: {type: Number, required: true},
	items: {type: [Item], required: true},
	days: [{type: mongoose.Schema.Types.ObjectId, ref: 'Day'}]
});

/*
	Day
	represents a user's notes for the day
 */
const Day = new mongoose.Schema({
	user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
	day: {type: Number, required: true},
	items: {type: [Item], required: true}
});


Year.plugin(URLSlugs('year'));
Month.plugin(URLSlugs('month'));
Week.plugin(URLSlugs('week'));
Day.plugin(URLSlugs('day'));

mongoose.model('User', User);
mongoose.model('Page', Page);
mongoose.model('Year', Year);
mongoose.model('Month', Month);
mongoose.model('Week', Week);
mongoose.model('Day', Day);
mongoose.model('Item', Item);
mongoose.model('Task', Task);
mongoose.model('Event', Event);
mongoose.model('Note', Note);

// is the environment variable, NODE_ENV, set to PRODUCTION? 
let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
	// if we're in PRODUCTION mode, then read the configration from a file
	// use blocking file io to do this...
	const fs = require('fs');
	const path = require('path');
	const fn = path.join(__dirname, 'config.json');
	const data = fs.readFileSync(fn);

	// our configuration file will be in json, so parse it and set the
	// conenction string appropriately!
	const conf = JSON.parse(data);
	dbconf = conf.dbconf;
} else {
	// if we're not in PRODUCTION mode, then use
	dbconf = 'mongodb://localhost/final-temp';
}
mongoose.connect(dbconf);

//mongoose.connect('mongodb://localhost/final-temp');
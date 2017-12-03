// second draft data model
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const URLSlugs = require('mongoose-url-slugs');
const bcrypt = require('bcrypt-nodejs');

/*
	Task
	represents an actionable item
 */
const Task = new mongoose.Schema({
	content: String,
	incomplete: Boolean,
	inprog: Boolean,
	completed: Boolean
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
	tasks: [Task],
	events: [Event], 
	notes: [Note]
});
Page.plugin(URLSlugs('title'));

/*
	User
	my site will require authentication, so users will have a username and password
	users will have Year, Month, Week, and Day objects but those will be embedded
	only years, months, weeks, and days with added data will be stored, and not empty years
	users will also have pages, which represent additional notes outside date related ones
 */
const User = new mongoose.Schema({
	email: String,		
	passwordHash: String,
	pages: [Page]//,
	//years: [Year]
});

User.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
User.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.passwordHash);
};

User.plugin(passportLocalMongoose);

mongoose.model('User', User);
mongoose.model('Page', Page);
mongoose.model('Task', Task);
mongoose.model('Event', Event);
mongoose.model('Note', Note);

// is the environment variable, NODE_ENV, set to PRODUCTION? 
let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
	// if we're in PRODUCTION mode, then read the configuration from a file
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
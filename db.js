// first draft data model
const mongoose = require('mongoose');

/*
	User
	my site will require authentication, so users will have a username and password
	users will have Year, Month, Week, and Day objects but those will be embedded
	only years, months, weeks, and days with added data will be stored, and not empty years
 */
const User = new mongoose.Schema({
	// username provided by authentication plugin
	// password hash provided by authentication plugin
	years: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Year' }],
});

/*
	Year
	represents a user's notes for the year
 */
const Year = new mongoose.Schema({
	user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
	year: {type: Number, required: true},
	items: {type: [Items], required: true},
	months: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Month' }]
});

/*
	Month
	represents a user's notes for the month
 */
const Month = new mongoose.Schema({
	user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
	month: {type: Number, required: true},
	items: {type: [Items], required: true},
	weeks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Week' }]
});

/*
	Week
	represents a user's notes for the week
 */
const Week = new mongoose.Schema({
	user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
	week: {type: Number, required: true},
	items: {type: [Items], required: true},
	days: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Day' }]
});

/*
	Day
	represents a user's notes for the day
 */
const Day = new mongoose.Schema({
	user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
	day: {type: Number, required: true},
	items: {type: [Items], required: true},,
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
const Item = new mongoose.Schema({
	content: String
});

mongoose.model('User', User);
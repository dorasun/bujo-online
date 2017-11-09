// app.js
const express = require('express');
const app = express();

const passport = require('passport'), LocalStrategy = require('passport-local').Strategy;

require('./db.js');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Page = mongoose.model('Page');
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
// app.set('views', path.join(__dirname, 'views'));
// app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: false }));

passport.use(new LocalStrategy(
	function(username, password, done) {
		User.findOne({ username: username }, function(err, user) {
			if (err) { return done(err); }
			if (!user) {
				return done(null, false, { message: 'Incorrect username.' });
			}
			if (!user.validPassword(password)) {
				return done(null, false, { message: 'Incorrect password.' });
			}
			return done(null, user);
		});
	}
));

app.get('/login', function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err) { return next(err); }
		if (!user) { return res.redirect('/login'); }
		req.logIn(user, function(err) {
			if (err) { return next(err); }
			return res.redirect('/users/' + user.username);
		});
	})(req, res, next);
});

app.post('/login',
	passport.authenticate('local', { successRedirect: '/',
	                               failureRedirect: '/login',
	                               failureFlash: true })
);

app.get('/', function(req, res){
	Page.find({}, function(err, pages) {
		if(err){
			console.log('No pages yet');
			res.render('index', {});
		}
		else{
			console.log(pages);
			res.render('index', {pages: pages});
		}
	});
});

app.post('/page-add', function(req, res){	//for adding more links to the index
	const newPage = new Page({
		title: req.body.page_title,
		items: []
	});

	newPage.save(function(err){
		if (err){
			error = 'Error has occured';
			res.redirect('/');
		}
		else{
			error = '';
			res.redirect('/page/'+newPage.slug);
		}
	});

	// User.find({}, function(err, user) {
	// 	if(err){
	// 		console.log("No User?????");
	// 	}
	// 	else{
	// 		user.pages.push(newPage);
	// 		user.save(function(err){
	// 			if(err){
	// 				console.log('Error saving');
	// 			}
	// 			else{
	// 				res.redirect('/');
	// 			}
	// 		});
	// 	}
	// });
});

app.get('/page/:slug', function(req, res) {
	Page.findOne({slug: req.params.slug}, function(err, page) {
		if(err){
			res.render('page', {});
		}
		else{
			res.render('page', {page: page});
		}
	});
});

// app.post('/page/:slug-add', function(req, res){
// 	let newItem;

// 	if(req.body.type === 'task'){
// 		newItem = new Task({
// 			content: req.body.content
// 		});
// 	}
// 	else if(req.body.type === 'event'){
// 		newItem = new Event({
// 			content: req.body.content
// 		});
// 	}
// 	else if(req.body.type === 'note'){
// 		newItem = new Note({
// 			content: req.body.content
// 		});
// 	}

// 	Page.findOne({slug: req.params.slug}, function(err, page) {
// 		if(err){
// 			console.log("No page found");
// 		}
// 		else{
// 			console.log(page);
// 			console.log(page.items);
// 			if(req.body.type === 'task'){
// 				if(!page.items.tasks){
// 					page.items.tasks = [];
// 				}
// 				page.items.tasks.push(newItem);
// 			}
// 			else if(req.body.type === 'event'){
// 				if(!page.items.events){
// 					page.items.events = [];
// 				}
// 				page.items.events.push(newItem);
// 			}
// 			else if(req.body.type === 'note'){
// 				console.log('NOTEE');
// 				if(!page.items.notes){
// 					page.items.notes = [];
// 				}
// 				page.items.notes.push(newItem);
// 				console.log(page.items);
// 			}

// 			page.items.save(function(err){
// 				if(err){
// 					console.log('Error');
// 				}
// 				else{
// 					page.save(function(err){
// 						if(err){
// 							console.log('Error');
// 						}
// 						else{
// 							res.redirect('/page/'+page.slug);
// 						}
// 					});
// 				}
// 			});
// 		}
// 	});
// });

app.listen(process.env.PORT || 3000);

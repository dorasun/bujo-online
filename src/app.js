// app.js
const express = require('express');
const app = express();
const mongoose = require('mongoose');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');

const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

require('./db.js');

const User = mongoose.model('User');
const Page = mongoose.model('Page');
const Task = mongoose.model('Task');
const Event = mongoose.model('Event');
const Note = mongoose.model('Note');

const sessionOptions = {
    secret: 'secret for session',
    resave: true,
    saveUninitialized: true
};
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use('local-login', new LocalStrategy({
		usernameField : 'username',
		passwordField : 'passwordHash',
		passReqToCallback : true
	},
	function(req, username, password, done) {
		User.findOne({ 'username' :  username }, function(err, user) {
			if (err){
				return done(err);
			}
			if (!user){
				return done(null, false, req.flash('loginMessage', 'No user found.')); 
			}
			if (!user.validPassword(password)){
				return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
			}

			return done(null, user);
		});
	}
));


app.get('/login', function(req, res) {
	res.render('login', {message: req.flash('loginMessage')});	
});

app.post('/login-attempt', passport.authenticate('local-login', {
	successRedirect: '/',
	failureRedirect: '/login',
	failureFlash: true
}));

passport.use('local-signup', new LocalStrategy({
    usernameField : 'username',
    passwordField : 'passwordHash',
    passReqToCallback : true 
},
function(req, username, password, done) {
    process.nextTick(function() {

        User.findOne({ 'username' :  username }, function(err, user) {
            if (err){
                return done(err);
            }
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
            } 
            else {
                const newUser = new User();
                newUser.username = username;
                newUser.passwordHash = newUser.generateHash(password);
                newUser.pages = [];
                newUser.original = true;
                newUser.color = false;
                newUser.dark = false;

                const newPage = new Page({
					title: 'Tutorial: Click Me!'
				});
				const newItem = new Note({
					content: 'Welcome to BuJo! This is your Tutorial page. Use the form below to add new items to your page, and navigate back to create new pages!'
				});

				newItem.save(function(err){
					if (err){
						throw err;
					}
					else{
						newPage.notes.push(newItem);

						newPage.save(function(err){
							if (err){
								throw err;
							}
							else{
								newUser.pages.push(newPage);

								newUser.save(function(err){
									if(err){
										throw err;
									}
									else{
										return done(null, newUser);
									}
								});
							}
						});
					}
				});
            }
        });    
    });
}));

app.get('/signup', function(req, res){
	res.render('register', {message: req.flash('signupMessage')});
});

app.post('/signup-attempt', passport.authenticate('local-signup',{
	successRedirect: '/login',
	failureRedirect: '/signup',
	failureFlash: true
}));

app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

app.get('/account', isLoggedIn, function(req, res) {
	res.render('account', {user: req.user});
});

app.post('/settings', isLoggedIn, function(req, res){	//for adding more links to the index
	User.findOne({username: req.user.username}, function(err, user){
		if(err){
			res.redirect('/');
		}
		else{
			if(req.body.theme === 'original'){
				user.original = true;
				user.color = false;
				user.dark = false;
			}
			if(req.body.theme === 'color'){
				user.original = false;
				user.color = true;
				user.dark = false;
			}
			if(req.body.theme === 'dark'){
				user.original = false;
				user.color = false;
				user.dark = true;
			}
			user.save(function(err){
				if(err){
					res.redirect('/');
				}
				else{
					res.redirect('/account');
				}
			});
		}
	});
});

app.get('/', function(req, res){
	if(req.user){
		res.render('index', {user: req.user, pages: req.user.pages});
	}
	else{
		res.render('index', {});
	}
});

app.post('/page-add', isLoggedIn, function(req, res){	//for adding more links to the index
	User.findOne({username: req.user.username}, function(err, user){
		if(err){
			res.redirect('/');
		}
		else{
			const newPage = new Page({
				title: req.body.page_title
			});

			newPage.save(function(err){
				if (err){
					res.redirect('/');
				}
				else{
					user.pages.push(newPage);
					user.save(function(err){
						if (err){
							res.redirect('/');
						}
						else{
							res.redirect('/page/'+newPage.slug);
						}
					});
				}
			});
		}
	});
});

app.get('/page/:slug', isLoggedIn, function(req, res) {
	User.findOne({username: req.user.username}, function(err, user){
		if(err){
			res.redirect('/');
		}
		else{
			const slugs = user.pages.map(a => a.slug);
			if(slugs.indexOf(req.params.slug) === -1){	//page doesn't exist
				res.redirect('/');
			}
			else{
				const currPage = user.pages[slugs.indexOf(req.params.slug)];
				res.render('page', {user: user, page: currPage});
			}
		}
	});
});

app.post('/page/:slug-edit', isLoggedIn, function(req, res){
	User.findOne({username: req.user.username}, function(err, user){
		if(err){
			res.redirect('/');
		}
		else{
			const slugs = user.pages.map(a => a.slug);
			if(slugs.indexOf(req.params.slug) === -1){		//page doesn't exist
				res.redirect('/');
			}
			else{
				const page = user.pages[slugs.indexOf(req.params.slug)];
				for(let i=0; i<page.tasks.length; i++){
					if(page.tasks[i].content === req.body.stage.split('-')[0]){
						if(req.body.stage.split('-')[1] === 'incomplete'){
							page.tasks[i].incomplete = true;
							page.tasks[i].inprog = false;
							page.tasks[i].completed = false;
						}
						if(req.body.stage.split('-')[1] === 'inprog'){
							page.tasks[i].incomplete = false;
							page.tasks[i].inprog = true;
							page.tasks[i].completed = false;
						}
						if(req.body.stage.split('-')[1] === 'complete'){
							page.tasks[i].incomplete = false;
							page.tasks[i].inprog = false;
							page.tasks[i].completed = true;
						}
						page.tasks[i].save(function(err){
							if (err){
								res.redirect('/');
							}
							else{
								page.save(function(err){
									if (err){
										res.redirect('/');
									}
									else{
										user.save(function(err){
											if(err){
												res.redirect('/');
											}
											else{
												res.redirect('/page/'+req.params.slug);
											}
										});
									}
								});
							}
						});
					}
				}
			}
		}
	});
});

app.post('/page/:slug-add', isLoggedIn, function(req, res){
	User.findOne({username: req.user.username}, function(err, user){
		if(err){
			res.redirect('/');
		}
		else{
			const slugs = user.pages.map(a => a.slug);
			if(slugs.indexOf(req.params.slug) === -1){		//page doesn't exist
				res.redirect('/');
			}
			else{
				const page = user.pages[slugs.indexOf(req.params.slug)];
				let newItem;

				if(req.body.type === 'task'){
					newItem = new Task({
						content: req.body.content,
						incomplete: true,
						inprog: false,
						completed: false
					});
				}
				else if(req.body.type === 'event'){
					newItem = new Event({
						content: req.body.date +': ' +req.body.content
					});
				}
				else if(req.body.type === 'note'){
					newItem = new Note({
						content: req.body.content
					});
				}

				newItem.save(function(err){
					if (err){
						res.redirect('/');
					}
					else{
						if(req.body.type === 'task'){
							page.tasks.push(newItem);
						}
						else if(req.body.type === 'event'){
							page.events.push(newItem);
						}
						else if(req.body.type === 'note'){
							page.notes.push(newItem);
						}
						page.save(function(err){
							if (err){
								res.redirect('/');
							}
							else{
								user.save(function(err){
									if(err){
										res.redirect('/');
									}
									else{
										res.redirect('/page/'+req.params.slug);
									}
								});
							}
						});
					}
				});
			}
		}
	});
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
        return next();
    }

    res.redirect('/');
}

app.listen(process.env.PORT || 3000);

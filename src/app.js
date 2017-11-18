// app.js
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

require('./db.js');

const User = mongoose.model('User');
const Page = mongoose.model('Page');
// const Year = mongoose.model('Year');
// const Month = mongoose.model('Month');
// const Week = mongoose.model('Week');
// const Day = mongoose.model('Day');
// const Item = mongoose.model('Item');
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
// app.set('views', path.join(__dirname, 'views'));
// app.use(express.static(path.join(__dirname, 'public')));
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
		usernameField : 'email',
		passwordField : 'passwordHash',
		passReqToCallback : true
	},
	function(req, email, password, done) {
		User.findOne({ 'email' :  email }, function(err, user) {
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
    usernameField : 'email',
    passwordField : 'passwordHash',
    passReqToCallback : true 
},
function(req, email, password, done) {
    process.nextTick(function() {

        User.findOne({ 'email' :  email }, function(err, user) {
            if (err){
                return done(err);
            }
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } 
            else {
                const newUser = new User();
                newUser.email = email;
                newUser.passwordHash = newUser.generateHash(password);

                newUser.save(function(err) {
                    if (err){
                        throw err;
                    }
                    return done(null, newUser);
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

app.get('/', function(req, res){
	if(req.user){
		res.render('index', {user: req.user, pages: req.user.pages});
	}
	else{
		res.render('index', {user: req.user});
	}
});

app.post('/page-add', function(req, res){	//for adding more links to the index
	User.findOne({email: req.user.email}, function(err, user){
		if(err){
			res.redirect('/');
		}
		else{
			const newPage = new Page({
				title: req.body.page_title,
				items: []
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
	User.findOne({email: req.user.email}, function(err, user){
		if(err){
			res.redirect('/');
		}
		else{
			const slugs = user.pages.map(a => a.slug);
			if(slugs.indexOf(req.params.slug) === -1){	//page doesn't exist
				res.redirect('/');
			}
			else{
				res.render('page', {page: user.pages[slugs.indexOf(req.params.slug)]});
			}
		}
	});
});

app.post('/page/:slug-add', function(req, res){
	User.findOne({email: req.user.email}, function(err, user){
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
						completed: false,
						migrated: false,
						scheduled: false
					});
				}
				else if(req.body.type === 'event'){
					newItem = new Event({
						content: req.body.content
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
								})
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

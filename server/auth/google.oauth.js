'use strict';

var router = require('express').Router();
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var User = require('../api/users/user.model');

router.get('/', passport.authenticate('google', {
	scope: 'email'
}));

router.get('/callback', passport.authenticate('google', {
	successRedirect: '/stories',
	failureRedirect: '/signup'
}));

passport.use(new GoogleStrategy({
	clientID: '556874244547-iglao39h2okke4o86uon0mpspp3j8pk3.apps.googleusercontent.com',
	clientSecret: 'uNxsA2yPw7d0dDeMgSV8G8Km',
	callbackURL: 'http://192.168.1.12:8080/auth/google/callback'
}, function (token, refreshToken, profile, done) { 
	User.findOne({'google.id': profile.id }, function (err, user) {
		if (err) done(err);
		else if (user) done(null, user);
		else {
			var email = profile.emails[0].value;
			User.create({
				email: email,
				photo: profile.photos[0].value,
				name: profile.displayName,
				google: {
					id: profile.id,
					name: profile.displayName,
					email: email,
					token: token
				}
			}, done);
		}
	});
}));

module.exports = router;
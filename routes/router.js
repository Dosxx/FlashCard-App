const express = require('express')
const routes  = express.Router()
const User    = require('../models/user')
const bcrypt  = require('bcrypt')



routes.get("/", function(req, res) {
	const name = req.cookies.username;
	//check for a current user with sexxxion id
	if(req.session.userId) {
		User.findById(req.session.userId)
		.exec(function (error, user) {
			if(error) {
				return next(error)
			} else {
				return res.render('index', {name: user.username})
			}
		})
	} else {
		return res.redirect('/login')
	}
	
})

//Get login
routes.get('/login', function(req, res) {
	return res.render('login')
})

//Post login
routes.post('/login', function(req, res, next) {
	const email = req.body.email;
	const password = req.body.password;
	if(email && password) {
		User.authenticate(email, password, function(err, user) {
			if(err || !user) {
				let errorCode = err.status
				let error = ""
				switch (errorCode) {
					case 401:
						error = new Error(err.message)
						error.status = err.status
						break;
					case 404:
						error = new Error(err.message)
						error.status = err.status
						break;
				}
				return next(error) 
			} else{
				req.session.userId = user._id;
				const name = user.username
				return res.render('index', {name})
			}

		})
	}else {
		let err = new Error('Email and the password are required')
		err.status = 401
		return next(err)
	}
})

routes.post("/goodbye", (req, res) => {
	res.clearCookie("username", req.body.username)
	return res.redirect('/login')
})

//Get Profile 
routes.get('/profile', function(req, res, next) {
	if(!req.session.userId) {
		let err = new Error("You are not authorized to view this page.")
		err.status = 403
		return next(err)
	}
	User.findById(req.session.userId)
		.exec(function (error, user) {
			if(error) {
				return next(error)
			} else {
				return res.render('profile', {title: 'My Profile',firstname: user.firstName, lastname: user.lastName,
				username: user.username})
			}
		})
})

routes.get('/register', (req, res) => {
	const name = req.cookies.username;
  	return res.render('register')

})

routes.post('/register', (req, res, next) => {
  res.cookie("username", req.body.username);
  const username = req.body.username;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  if (username && firstName && lastName && email && password && confirmPassword) {
  	// make sure the provided password match
		if(password !== confirmPassword) {
			var err = new Error("Password do not match.");
			err.status = 400;
			return next(err);
		}
		//create an object that holds the user input data
		let userData = {
			username: username,
			firstName: firstName,
			lastName: lastName,
			email: email,
			password: password
		}
		//use schema's create method to insert document into Mongo
		User.create(userData, function (err, user) {
			if(err) {
				return next(err)
			}else {
				return res.redirect('/')	
			}
		})
	} else {
		var err = new Error("All fields required.");
		err.status = 400;
		return next(err);
	}
})

module.exports = routes;

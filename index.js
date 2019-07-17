const express      = require("express")
const app          = express()
const bodyParser   = require('body-parser')
const cookieParser = require('cookie-parser')
const mainRoutes   = require('./routes/router')
const cardsRoutes  = require('./routes/cards')
const mongoose     = require('mongoose')
const User         = require('./models/user')
const session      = require('express-session')
const Flashcard    = require("./models/flashcard")

//Mongodb connection
mongoose.connect("mongodb://localhost:27017/flashcard")
let db = mongoose.connection

//mongo error
db.on('error', console.error.bind(console, 'connection error:'))

let myAnswer = "West Africa"

let myQuestion = {
	text: "where was the Ghana empire located?",
	hint: "on the african continent",
	answer: myAnswer
};

let myCard = new Flashcard({
	data: {
		title: "History",
		cards:[myQuestion]
	}
})

Flashcard.remove({}, function(err){
	if(err) console.error(err);
	Flashcard.create(myCard, function(err, hcard){
		console.error(err);
		Flashcard.find(function(err, doc){
			if(err){
				console.error(err);
			} else {
				console.log(doc)
			}
		})
	})
})

//use session for tracking logins
app.use(session({
	secret: 'dossidos in the way we go',
	resave: true,
	saveUninitialized: false
}))

// make userId a global variable
app.use((req, res, next) => {
	res.locals.currentUser = req.session.userId
	next()
})

app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())
app.set("view engine", 'pug')

app.use('/static', express.static('public'))

app.use(mainRoutes)
app.use('/cards', cardsRoutes)

app.use((req, res, next) => {
	const err = new Error("Not found!")
	err.status = 404
	next(err)
})

app.use((err, req, res, next) => {
	res.locals.error = err
	res.status(err.status)
	res.render('error', err)
})

app.listen(3000, function() {
	console.log("the server is running on port 3000")
});

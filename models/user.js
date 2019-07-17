const mongoose = require('mongoose')
const bcrypt   = require('bcrypt')

//create a user schema in mongoDB
let UserSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
		require: true,
		trim: true
	},
	firstName: {
		type: String,
		require: true,
		trim: true
	},
	lastName: {
		type: String,
		require: true,
		trim: true
	},
	email: {
		type: String,
		unique: true,
		require: true,
		trim: true
	},
	password: {
		type: String,
		require: true
	}
})
// authenticate input against database documents
UserSchema.statics.authenticate = function (email, password, callback) {
	User.findOne({email: email})
		.exec(function (err, user) {
			if(err) {
				return callback(err)
			}else if (!user) {
				let err = new Error('User not found.')
				err.status = 404
				return callback(err)
			}
			bcrypt.compare(password, user.password, function(err, result) {
				if (result) {
					return callback(null, user)
				}else {
					let err = new Error("Wrong password! Please try it again")
					err.status = 401
					return callback(err)
				}
			})
		})

}
// hash password before saving to database
UserSchema.pre("save", function (next) {
	let user = this
	bcrypt.hash(user.password, 10, function(err, hash) {
		if(err) {
			return next(err)
		}
		user.password = hash
		next()
	})
})

let User = mongoose.model('User', UserSchema);

module.exports = User;
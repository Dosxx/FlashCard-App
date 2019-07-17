const mongoose = require('mongoose')

let AnswerSchema = new mongoose.Schema({
	text: {type: String, default:""}
})

let QuestionSchema = new mongoose.Schema({
	text: String,
	hint: {type: String, default: ""},
	answer: AnswerSchema
})

let FlashcardSchema = new mongoose.Schema({
	data: {
		type: Object,
		require: true,
		title: {
			type: String,
			unique: true,
			require: true,
			trim: true
		},
		cards: [QuestionSchema]
	}
})

let Flashcard = mongoose.model('Flashcard', FlashcardSchema);

module.exports = Flashcard;
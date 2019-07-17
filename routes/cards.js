const express = require('express')
const cardsRoutes = express.Router()
const {data}  = require('../data/flashcardData.json');
const {cards} = data;
const Flashcard = require('../models/flashcard')


cardsRoutes.get('/', (req, res) => {
	const name = req.cookies.username
	const numberOfCards = cards.length
	const flashcardId = Math.floor(Math.random() * numberOfCards)
  return res.redirect(`/cards/${flashcardId}`)
})

cardsRoutes.get('/:id', (req, res) => {
    const name = req.cookies.username
  	const { side } = req.query
  	const { id } = req.params
  	if(!side || side === 'hint'){
  		return res.redirect(`/cards/${id}?side=question`)
  	} 

  	const text  = cards[id][side]
  	const { hint } = cards[id] 
  	const templateData = { text, id, name} 
  	
  	if(side === "question") {
  		templateData.hint = hint
  		templateData.sideToShow = 'answer'
  		templateData.sideToShowDisplay = 'Answer'
      return res.render('cardFront', templateData)
  	} else if(side === 'answer'){
  		templateData.sideToShow = 'question'
  		templateData.sideToShowDisplay = 'Question'
      return res.render('cardBack', templateData)
  	}

	  
})


module.exports = cardsRoutes;
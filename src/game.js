const rls = require('readline-sync')
const {shuffle, isEmpty} = require('lodash')

const NO_HUMAN = (["demo", "test"]).includes(process.env.NODE_ENV)
const diag = {
  question(txt) {
    if (NO_HUMAN) return console.log(txt)
    return rls.question(txt)
  },
}

const FACES = []
for (i = 2; i <= 10; i++) {
  FACES.push(i)
}
['Jack', 'King', 'Queen', 'Ace'].forEach((royal) => FACES.push(royal))
const SUITS = ['Hearts', 'Spades', 'Diamonds', 'Clubs']
const DECK = []
SUITS.forEach((suit) => FACES.forEach((face, index) => DECK.push({face, suit, value: index})))

const Game = {
  play() {
    this.init()
    while(!this.winner) {
      console.log(`Player 1: ${this.p1Hand.length}, ${this.p2Name}: ${this.p2Hand.length}`)
      this.playRound()
      this.doWeHaveAWinner()
    }
    const again = diag.question(`${this.winner} wins! Hurray! Play again (Y / N)? `)
    this.playAgain(again)
  },

  init() {
    this.winner = null
    this.p1Hand = shuffle(DECK)
    this.p2Hand = this.p1Hand.splice(0,26)
    this.getPlayers()
    console.log(`${this.players === 1 ? "It's you against the computer!" : 'One on one action!'} Let's go!`)
  },

  getPlayers() {
    const answer = diag.question('Welcome to War! 1 or 2 players? ')
    if (answer === '1' || NO_HUMAN) {
      this.p2Name = "The Computer"
      this.players = 1
    } else if (answer === '2') {
      this.p2Name = "Player 2"
      this.players = 2
    } else {
      console.log('Sorry, I don\'t understand. I am a very simple program. Please type "1" or "2" ')
      this.getPlayers()
    }
  },

  playRound() {
    const p1Card = this.takeTurn(1)
    const p2Card = this.players === 2 ? this.takeTurn(2) : this.takeTurn('computer')
    if (p1Card.face === p2Card.face) {
      this.war([p1Card], [p2Card])
    } else {
      if (p1Card.value > p2Card.value) {
        console.log('Player 1 wins the hand!')
        this.p1Hand = [...this.p1Hand, p1Card, p2Card]
      } else {
        console.log(`${this.p2Name} wins the hand!`)
        this.p2Hand = [...this.p2Hand, p2Card, p1Card]
      }
    }
  },

  takeTurn(player) {
    const drawFrom = player === 1 ? this.p1Hand : this.p2Hand
    if (player !== 'computer') diag.question(`Player ${player} draw?`)
    const card = drawFrom.shift()
    console.log(`${player !== 'computer' ? `Player ${player}` : 'Computer'} draws ${card.face} of ${card.suit}`)
    return card
  },

  war(p1Cards, p2Cards) {
    this.doWeHaveAWinner()
    if (this.winner) return
    console.log('War!')
    const p1Card = this.takeTurn(1)
    const p2Card = this.players === 2 ? this.takeTurn(2) : this.takeTurn('computer')
    if (p1Card.face === p2Card.face) {
      console.log('Again!')
      this.war([p1Card, ...p1Cards], [p2Card, ...p2Cards])
    } else {
      if (p1Card.value > p2Card.value) {
        console.log('Player 1 wins the war!')
        this.p1Hand = [...this.p1Hand, ...p1Cards, p1Card, ...p2Cards, p2Card]
      } else {
        console.log(`${this.p2Name} wins the war!`)
        this.p2Hand = [...this.p2Hand, ...p2Cards, p2Card, ...p1Cards, p1Card]
      }
    }

  },

  doWeHaveAWinner() {
    if (isEmpty(this.p2Hand)) this.winner = "Player 1"
    if (isEmpty(this.p1Hand)) this.winner = this.p2Name
  },

  playAgain(again) {
    if (again && again.toUpperCase() === 'Y') {
      this.play()
    } else if (NO_HUMAN || again.toUpperCase() === 'N') {
      console.log('Buhbye!')
      process.exit()
    } else {
      againAgain = diag.question(`Sorry, please answer "Y" or "N". Play again? `)
      this.playAgain(againAgain)
    }
  }
}

module.exports = Game

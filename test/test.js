require('chai').should()
const Game = require('../src/game')

describe('#init()', () => {
  it('should deal each player half of 52 unique cards', () => {
    Game.init()
    Game.p1Hand.should.have.lengthOf(26)
    Game.p2Hand.should.have.lengthOf(26)

    // combine p1Hand and p2Hand, map to "facesuit" string and coerce into a Set to check for unique values
    const fullDeck = [...new Set([...Game.p1Hand, ...Game.p2Hand].map(({face, suit}) => `${face}${suit}`))]
    fullDeck.should.have.lengthOf(52)
  })
})

describe('#playRound()', () => {
  beforeEach(() => {
    Game.players = 1
    Game.p2Name = "The Computer"
    Game.p1Hand = [{face: 2, suit: 'Diamonds', value: 0}, {face: "King", suit: 'Diamonds', value: 11}]
    Game.p2Hand = [{face: 3, suit: 'Diamonds', value: 1}, {face: "Queen", suit: 'Diamonds', value: 10}]
  })

  it('determines round winner based on top card value and awards cards accordingly', () => {
    Game.playRound()
    Game.p1Hand.should.have.lengthOf(1)
    Game.p2Hand.should.have.lengthOf(3)
  })

  it('goes to war if both cards have equal value, determines war winner by next top card', () => {
    Game.p1Hand.unshift({face: 2, suit: 'Hearts', value: 0})
    Game.p2Hand.unshift({face: 2, suit: 'Clubs', value: 0})
    Game.playRound()
    Game.p1Hand.should.have.lengthOf(1)
    Game.p2Hand.should.have.lengthOf(5)
  })

  it('continues war until until a winner is determined', () => {
    Game.p1Hand = [{face: 2, suit: 'Hearts', value: 0}, {face: 3, suit: 'Hearts', value: 1}, ... Game.p1Hand]
    Game.p2Hand = [{face: 2, suit: 'Clubs', value: 0}, {face: 3, suit: 'Clubs', value: 1}, ...Game.p2Hand]
    Game.playRound()
    Game.p1Hand.should.have.lengthOf(1)
    Game.p2Hand.should.have.lengthOf(7)
  })
})

describe('#endGame', () => {
  beforeEach(() => {
    Game.winner = null
    Game.players = 1
    Game.p2Name = "The Computer"
  })

  it('should set a winner when a player\'s hand is empty', () => {
    Game.p1Hand = []
    Game.p2Hand = [{face: 3, suit: 'Diamonds', value: 1}, {face: "Queen", suit: 'Diamonds', value: 10}]
    Game.doWeHaveAWinner()
    Game.winner.should.equal("The Computer")
  })

  it('should end game and set a winner when a players hand empties at start of a war', () => {
    Game.p1Hand = [{face: 2, suit: 'Diamonds', value: 0}]
    Game.p2Hand = [{face: 2, suit: 'Hearts', value: 0}, {face: "Queen", suit: 'Diamonds', value: 10}]
    Game.playRound()
    Game.winner.should.equal("The Computer")
  })

  it('should end game and set a winner when a players hand empties during a war', () => {
    Game.p1Hand = [{face: 2, suit: 'Diamonds', value: 0}, {face: 3, suit: 'Hearts', value: 1}]
    Game.p2Hand = [{face: 2, suit: 'Hearts', value: 0}, {face: 3, suit: 'Clubs', value: 1}, {face: "Queen", suit: 'Diamonds', value: 10}]
    Game.playRound()
    Game.winner.should.equal("The Computer")
  })
})

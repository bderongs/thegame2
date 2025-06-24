"use strict";
// This file implements the core logic for "The Game".
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGame = createGame;
exports.getValidMoves = getValidMoves;
exports.applyMoves = applyMoves;
exports.drawCards = drawCards;
exports.advanceTurn = advanceTurn;
const DECK_SIZE = 98; // Cards from 2 to 99
/**
 * Determines the hand size based on the number of players, following official rules.
 * @param numberOfPlayers - The number of players in the game.
 * @returns The number of cards each player should have.
 */
function getHandSize(numberOfPlayers) {
    if (numberOfPlayers === 1)
        return 8;
    if (numberOfPlayers === 2)
        return 7;
    if (numberOfPlayers >= 3 && numberOfPlayers <= 5)
        return 6;
    throw new Error('Invalid number of players. Must be between 1 and 5.');
}
/**
 * Creates and shuffles a new deck of cards.
 * @returns A shuffled array of cards.
 */
function createShuffledDeck() {
    const deck = Array.from({ length: DECK_SIZE }, (_, i) => i + 2);
    // Fisher-Yates shuffle
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}
/**
 * Creates a new game state for a given number of players.
 * @param numberOfPlayers - The number of players.
 * @returns A new GameState object.
 */
function createGame(numberOfPlayers = 1) {
    const deck = createShuffledDeck();
    const handSize = getHandSize(numberOfPlayers);
    const hands = [];
    for (let i = 0; i < numberOfPlayers; i++) {
        const hand = deck.splice(0, handSize);
        hand.sort((a, b) => a - b);
        hands.push(hand);
    }
    const piles = [
        { id: 1, direction: 'ascending', value: 1 },
        { id: 2, direction: 'ascending', value: 1 },
        { id: 3, direction: 'descending', value: 100 },
        { id: 4, direction: 'descending', value: 100 },
    ];
    return {
        deck,
        piles,
        hands,
        currentPlayer: 0,
        cardsPlayed: 0,
    };
}
/**
 * Checks if a move is valid according to the game rules.
 * @param pile - The pile to play on.
 * @param card - The card to play.
 * @returns True if the move is valid, false otherwise.
 */
function isMoveValid(pile, card) {
    if (pile.direction === 'ascending') {
        // Ascending pile: card must be greater, or it's a 10-jump
        return card > pile.value || card === pile.value - 10;
    }
    else {
        // Descending pile: card must be smaller, or it's a 10-jump
        return card < pile.value || card === pile.value + 10;
    }
}
/**
 * Returns a list of all possible moves for the current player.
 * @param gameState - The current state of the game.
 * @returns An array of valid moves.
 */
function getValidMoves(gameState) {
    const validMoves = [];
    const currentPlayerHand = gameState.hands[gameState.currentPlayer];
    if (!currentPlayerHand)
        return [];
    for (const card of currentPlayerHand) {
        for (const pile of gameState.piles) {
            if (isMoveValid(pile, card)) {
                validMoves.push({ card, pileId: pile.id });
            }
        }
    }
    return validMoves;
}
/**
 * Applies a series of moves to the game state for the current player.
 * @param gameState - The current game state.
 * @param moves - The moves to apply.
 * @returns The new game state.
 */
function applyMoves(gameState, moves) {
    const newGameState = JSON.parse(JSON.stringify(gameState));
    const currentPlayerHand = newGameState.hands[newGameState.currentPlayer];
    for (const move of moves) {
        const pile = newGameState.piles.find((p) => p.id === move.pileId);
        if (pile) {
            pile.value = move.card;
            const cardIndex = currentPlayerHand.indexOf(move.card);
            if (cardIndex > -1) {
                currentPlayerHand.splice(cardIndex, 1);
            }
        }
    }
    newGameState.cardsPlayed += moves.length;
    return newGameState;
}
/**
 * Draws new cards from the deck to replenish the current player's hand.
 * @param gameState - The current game state.
 * @returns The new game state with a replenished hand.
 */
function drawCards(gameState) {
    const newGameState = JSON.parse(JSON.stringify(gameState));
    const handSize = getHandSize(newGameState.hands.length);
    const currentPlayerHand = newGameState.hands[newGameState.currentPlayer];
    const cardsToDraw = Math.min(handSize - currentPlayerHand.length, newGameState.deck.length);
    const newCards = newGameState.deck.splice(0, cardsToDraw);
    currentPlayerHand.push(...newCards);
    currentPlayerHand.sort((a, b) => a - b);
    return newGameState;
}
/**
 * Advances the turn to the next player.
 * @param gameState The current game state.
 * @returns The new game state with the updated player turn.
 */
function advanceTurn(gameState) {
    const newGameState = JSON.parse(JSON.stringify(gameState));
    newGameState.currentPlayer = (newGameState.currentPlayer + 1) % newGameState.hands.length;
    return newGameState;
}

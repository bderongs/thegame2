// This file defines all the shared TypeScript types for the game simulator.

/**
 * A card is a number between 2 and 99.
 */
export type Card = number;

/**
 * The direction of a pile, either ascending (1 to 100) or descending (100 to 1).
 */
export type PileDirection = 'ascending' | 'descending';

/**
 * Represents one of the four piles on the board.
 */
export interface Pile {
    id: number;
    direction: PileDirection;
    value: Card;
}

/**
 * The player's hand, containing a set of cards.
 */
export type Hand = Card[];

/**
 * Represents a single move: placing a card on a specific pile.
 */
export interface Move {
    card: Card;
    pileId: number;
}

/**
 * The hands of all players. Each hand is an array of cards.
 */
export type Hands = Hand[];

/**
 * The complete state of the game at any point in time, now supporting multiplayer.
 */
export interface GameState {
    deck: Card[];
    piles: [Pile, Pile, Pile, Pile];
    hands: Hands; // One hand per player
    currentPlayer: number; // Index of the player whose turn it is
    cardsPlayed: number;
}

/**
 * A strategy is a function that takes the current game state and the current player's index, and returns an array of moves to play.
 */
export type Strategy = (gameState: GameState, playerIndex: number) => Move[];

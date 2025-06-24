"use strict";
// This file runs the game simulation with a given strategy.
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSingleGame = runSingleGame;
exports.runSimulation = runSimulation;
const game_1 = require("./game");
const MIN_CARDS_TO_PLAY_PER_TURN = 2;
/**
 * Runs a single game from start to finish with a given strategy for all players.
 * @param strategy - The strategy function to use for playing the game.
 * @param numberOfPlayers - The number of players in the game.
 * @param logger - An optional function to log game events for debugging.
 * @returns The final number of cards left in the deck and all hands.
 */
function runSingleGame(strategy, numberOfPlayers, logger) {
    let gameState = (0, game_1.createGame)(numberOfPlayers);
    logger === null || logger === void 0 ? void 0 : logger(`--- Starting a new game with ${numberOfPlayers} players ---\n`);
    while (true) {
        const currentPlayer = gameState.currentPlayer;
        logger === null || logger === void 0 ? void 0 : logger(`\n--- Player ${currentPlayer + 1}'s Turn ---`);
        logger === null || logger === void 0 ? void 0 : logger(`Piles: ${JSON.stringify(gameState.piles.map(p => p.value))}`);
        logger === null || logger === void 0 ? void 0 : logger(`Hand:  ${JSON.stringify(gameState.hands[currentPlayer])}`);
        // Determine the minimum number of cards to play
        const minRequired = (gameState.deck.length > 0) ? MIN_CARDS_TO_PLAY_PER_TURN : 1;
        let playedCount = 0;
        let movesToPlay = [];
        let tempGameState = Object.assign({}, gameState);
        // Try to play up to minRequired cards
        while (playedCount < minRequired) {
            const moves = strategy(tempGameState, currentPlayer);
            if (moves.length === 0)
                break;
            movesToPlay.push(...moves);
            tempGameState = (0, game_1.applyMoves)(tempGameState, moves);
            playedCount += moves.length;
        }
        if (playedCount < minRequired) {
            logger === null || logger === void 0 ? void 0 : logger(`Player ${currentPlayer + 1} cannot play the required ${minRequired} cards. GAME OVER.`);
            break;
        }
        // Apply all moves to the real game state
        gameState = (0, game_1.applyMoves)(gameState, movesToPlay);
        if (movesToPlay.length > 0) {
            logger === null || logger === void 0 ? void 0 : logger(`Plays: ${JSON.stringify(movesToPlay)}`);
            logger === null || logger === void 0 ? void 0 : logger(`Piles after play: ${JSON.stringify(gameState.piles.map(p => p.value))}`);
        }
        else {
            logger === null || logger === void 0 ? void 0 : logger('Plays: No moves were made.');
        }
        const handBeforeDraw = [...gameState.hands[currentPlayer]];
        gameState = (0, game_1.drawCards)(gameState);
        const cardsDrawn = gameState.hands[currentPlayer].filter(c => !handBeforeDraw.includes(c));
        if (cardsDrawn.length > 0) {
            logger === null || logger === void 0 ? void 0 : logger(`Draws: ${JSON.stringify(cardsDrawn)}`);
            logger === null || logger === void 0 ? void 0 : logger(`New Hand: ${JSON.stringify(gameState.hands[currentPlayer])}`);
        }
        // Win condition: all cards played
        const totalCardsInHands = gameState.hands.reduce((sum, hand) => sum + hand.length, 0);
        if (totalCardsInHands === 0 && gameState.deck.length === 0) {
            logger === null || logger === void 0 ? void 0 : logger('--- GAME WON: All cards have been played! ---');
            break;
        }
        gameState = (0, game_1.advanceTurn)(gameState);
    }
    const cardsLeft = 98 - gameState.cardsPlayed;
    logger === null || logger === void 0 ? void 0 : logger(`\n--- Game Finished ---`);
    logger === null || logger === void 0 ? void 0 : logger(`Cards left: ${cardsLeft}`);
    return cardsLeft;
}
/**
 * Runs multiple simulations for a given strategy and calculates statistics.
 * @param strategy - The strategy to test.
 * @param numberOfGames - The number of games to simulate.
 * @param numberOfPlayers - The number of players in each game.
 * @returns An object with the simulation results.
 */
function runSimulation(strategy, numberOfGames, numberOfPlayers) {
    let totalCardsLeft = 0;
    let wins = 0;
    for (let i = 0; i < numberOfGames; i++) {
        const cardsLeft = runSingleGame(strategy, numberOfPlayers);
        if (cardsLeft === 0) {
            wins++;
        }
        totalCardsLeft += cardsLeft;
    }
    return {
        numberOfGames,
        numberOfPlayers,
        wins,
        averageCardsLeft: totalCardsLeft / numberOfGames,
    };
}

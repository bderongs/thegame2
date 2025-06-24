// This file runs the game simulation with a given strategy.

import { createGame, applyMoves, drawCards, getValidMoves, advanceTurn } from './game';
import { GameState, Strategy, StrategyWithBooking, BookingAction } from './types';
import { ruleBasedStrategy, RuleBasedParams } from './strategies';

const MIN_CARDS_TO_PLAY_PER_TURN = 2;

/**
 * Runs a single game from start to finish with a given strategy (or array of strategies) for all players.
 * Supports booking logic: after each turn, calls updateBooking if present.
 * @param strategies - A single strategy or an array of strategies (one per player).
 * @param numberOfPlayers - The number of players in the game.
 * @param logger - An optional function to log game events for debugging.
 * @returns The final number of cards left in the deck and all hands.
 */
export function runSingleGame(
    strategies: StrategyWithBooking | StrategyWithBooking[],
    numberOfPlayers: number,
    logger?: (message: string) => void
): number {
    let gameState = createGame(numberOfPlayers);
    logger?.(`--- Starting a new game with ${numberOfPlayers} players ---\n`);

    // Normalize strategies to an array
    const strategyList: StrategyWithBooking[] = Array.isArray(strategies)
        ? strategies
        : Array(numberOfPlayers).fill(strategies);

    while (true) {
        const currentPlayer = gameState.currentPlayer;
        const strategy = strategyList[currentPlayer];
        logger?.(`\n--- Player ${currentPlayer + 1}'s Turn ---`);
        logger?.(`Piles: ${JSON.stringify(gameState.piles.map((p: { value: number }) => p.value))}`);
        logger?.(`Hand:  ${JSON.stringify(gameState.hands[currentPlayer])}`);

        // Determine the minimum number of cards to play
        const minRequired = (gameState.deck.length > 0) ? MIN_CARDS_TO_PLAY_PER_TURN : 1;
        let playedCount = 0;
        let movesToPlay = [];
        let tempGameState = { ...gameState };

        // Try to play up to minRequired cards
        while (playedCount < minRequired) {
            const moves = strategy(tempGameState, currentPlayer);
            if (moves.length === 0) break;
            movesToPlay.push(...moves);
            tempGameState = applyMoves(tempGameState, moves);
            playedCount += moves.length;
        }

        if (playedCount < minRequired) {
            logger?.(`Player ${currentPlayer + 1} cannot play the required ${minRequired} cards. GAME OVER.`);
            break;
        }

        // Apply all moves to the real game state
        gameState = applyMoves(gameState, movesToPlay);
        if (movesToPlay.length > 0) {
            logger?.(`Plays: ${JSON.stringify(movesToPlay)}`);
            logger?.(`Piles after play: ${JSON.stringify(gameState.piles.map((p: { value: number }) => p.value))}`);
        } else {
            logger?.('Plays: No moves were made.');
        }

        const handBeforeDraw = [...gameState.hands[currentPlayer]];
        gameState = drawCards(gameState);
        const cardsDrawn = gameState.hands[currentPlayer].filter((c: number) => !handBeforeDraw.includes(c));
        if (cardsDrawn.length > 0) {
            logger?.(`Draws: ${JSON.stringify(cardsDrawn)}`);
            logger?.(`New Hand: ${JSON.stringify(gameState.hands[currentPlayer])}`);
        }

        // --- Booking logic: allow player to book or release a pile ---
        if (typeof strategy.updateBooking === 'function') {
            const bookingAction: BookingAction = strategy.updateBooking(gameState, currentPlayer);
            if (bookingAction) {
                const pile = gameState.piles.find((p: { id: number }) => p.id === bookingAction.pileId);
                if (pile) {
                    if (bookingAction.action === 'book') {
                        pile.bookedBy = currentPlayer;
                        logger?.(`Player ${currentPlayer + 1} books pile ${pile.id}`);
                    } else if (bookingAction.action === 'release' && pile.bookedBy === currentPlayer) {
                        pile.bookedBy = undefined;
                        logger?.(`Player ${currentPlayer + 1} releases pile ${pile.id}`);
                    }
                }
            }
        }

        // Win condition: all cards played
        const totalCardsInHands = gameState.hands.reduce((sum: number, hand: number[]) => sum + hand.length, 0);
        if (totalCardsInHands === 0 && gameState.deck.length === 0) {
            logger?.('--- GAME WON: All cards have been played! ---');
            break;
        }

        gameState = advanceTurn(gameState);
    }

    const cardsLeft = 98 - gameState.cardsPlayed;
    logger?.(`\n--- Game Finished ---`);
    logger?.(`Cards left: ${cardsLeft}`);
    return cardsLeft;
}

/**
 * Runs multiple simulations for a given strategy and calculates statistics.
 * @param strategy - The strategy to test.
 * @param numberOfGames - The number of games to simulate.
 * @param numberOfPlayers - The number of players in each game.
 * @returns An object with the simulation results.
 */
export function runSimulation(strategy: Strategy, numberOfGames: number, numberOfPlayers: number) {
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

/**
 * Runs a grid search over parameter combinations to find the best performing strategy settings.
 * @param paramRanges - An object with arrays of possible values for each parameter.
 * @param numberOfGames - Number of games per parameter set.
 * @param numberOfPlayers - Number of players.
 * @param maxIterations - Maximum number of parameter combinations to try.
 * @param logger - Optional logger for progress.
 * @returns Array of results sorted by win rate and average cards left.
 */
export function runParameterSearch(
    paramRanges: {
        playExtraTendency: number[],
        maxAllowedJump: number[],
        pileHealthCaution: number[],
        bookingFrequency: number[],
    },
    numberOfGames: number,
    numberOfPlayers: number,
    maxIterations: number = 100,
    logger?: (msg: string) => void
) {
    // Generate all parameter combinations (cartesian product)
    const combos: RuleBasedParams[] = [];
    for (const playExtraTendency of paramRanges.playExtraTendency) {
        for (const maxAllowedJump of paramRanges.maxAllowedJump) {
            for (const pileHealthCaution of paramRanges.pileHealthCaution) {
                for (const bookingFrequency of paramRanges.bookingFrequency) {
                    combos.push({ playExtraTendency, maxAllowedJump, pileHealthCaution, bookingFrequency });
                }
            }
        }
    }
    // Limit to maxIterations
    const limitedCombos = combos.slice(0, maxIterations);
    const results: any[] = [];
    let iter = 0;
    for (const params of limitedCombos) {
        iter++;
        logger?.(`Testing combo ${iter}/${limitedCombos.length}: ${JSON.stringify(params)}`);
        const simResult = runSimulation((gs: GameState, pi: number) => ruleBasedStrategy(gs, pi, params), numberOfGames, numberOfPlayers);
        results.push({
            ...params,
            winRate: simResult.wins / simResult.numberOfGames,
            avgCardsLeft: simResult.averageCardsLeft,
        });
    }
    // Sort by win rate desc, then avgCardsLeft asc
    results.sort((a, b) => b.winRate - a.winRate || a.avgCardsLeft - b.avgCardsLeft);
    return results;
} 
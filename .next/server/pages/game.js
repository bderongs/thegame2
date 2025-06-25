"use strict";
(() => {
var exports = {};
exports.id = 203;
exports.ids = [203];
exports.modules = {

/***/ 6742:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  config: () => (/* binding */ config),
  "default": () => (/* binding */ next_route_loaderkind_PAGES_page_2Fgame_preferredRegion_absolutePagePath_private_next_pages_2Fgame_tsx_absoluteAppPath_private_next_pages_2F_app_tsx_absoluteDocumentPath_private_next_pages_2F_document_tsx_middlewareConfigBase64_e30_3D_),
  getServerSideProps: () => (/* binding */ next_route_loaderkind_PAGES_page_2Fgame_preferredRegion_absolutePagePath_private_next_pages_2Fgame_tsx_absoluteAppPath_private_next_pages_2F_app_tsx_absoluteDocumentPath_private_next_pages_2F_document_tsx_middlewareConfigBase64_e30_3D_getServerSideProps),
  getStaticPaths: () => (/* binding */ getStaticPaths),
  getStaticProps: () => (/* binding */ getStaticProps),
  reportWebVitals: () => (/* binding */ reportWebVitals),
  routeModule: () => (/* binding */ routeModule),
  unstable_getServerProps: () => (/* binding */ unstable_getServerProps),
  unstable_getServerSideProps: () => (/* binding */ unstable_getServerSideProps),
  unstable_getStaticParams: () => (/* binding */ unstable_getStaticParams),
  unstable_getStaticPaths: () => (/* binding */ unstable_getStaticPaths),
  unstable_getStaticProps: () => (/* binding */ unstable_getStaticProps)
});

// NAMESPACE OBJECT: ./pages/game.tsx
var pages_game_namespaceObject = {};
__webpack_require__.r(pages_game_namespaceObject);
__webpack_require__.d(pages_game_namespaceObject, {
  "default": () => (GamePage),
  getServerSideProps: () => (getServerSideProps)
});

// EXTERNAL MODULE: ./node_modules/next/dist/server/future/route-modules/pages/module.js
var pages_module = __webpack_require__(3185);
// EXTERNAL MODULE: ./node_modules/next/dist/server/future/route-kind.js
var route_kind = __webpack_require__(5244);
// EXTERNAL MODULE: ./node_modules/next/dist/build/webpack/loaders/next-route-loader/helpers.js
var helpers = __webpack_require__(7182);
// EXTERNAL MODULE: ./pages/_document.tsx
var _document = __webpack_require__(2699);
// EXTERNAL MODULE: ./pages/_app.tsx
var _app = __webpack_require__(3533);
// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(5893);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(6689);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/play.js
var play = __webpack_require__(9482);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/users.js
var users = __webpack_require__(9525);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/settings.js
var settings = __webpack_require__(1408);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/bar-chart-2.js
var bar_chart_2 = __webpack_require__(66);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/eye.js
var eye = __webpack_require__(4464);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/circle-check.js
var circle_check = __webpack_require__(5594);
;// CONCATENATED MODULE: ./lib/game/game.ts
// This file implements the core logic for "The Game".
const DECK_SIZE = 98; // Cards from 2 to 99
/**
 * Determines the hand size based on the number of players, following official rules.
 * @param numberOfPlayers - The number of players in the game.
 * @returns The number of cards each player should have.
 */ function getHandSize(numberOfPlayers) {
    if (numberOfPlayers === 1) return 8;
    if (numberOfPlayers === 2) return 7;
    if (numberOfPlayers >= 3 && numberOfPlayers <= 5) return 6;
    throw new Error("Invalid number of players. Must be between 1 and 5.");
}
/**
 * Creates and shuffles a new deck of cards.
 * @returns A shuffled array of cards.
 */ function createShuffledDeck() {
    const deck = Array.from({
        length: DECK_SIZE
    }, (_, i)=>i + 2);
    // Fisher-Yates shuffle
    for(let i = deck.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [
            deck[j],
            deck[i]
        ];
    }
    return deck;
}
/**
 * Creates a new game state for a given number of players.
 * @param numberOfPlayers - The number of players.
 * @returns A new GameState object.
 */ function createGame(numberOfPlayers = 1) {
    const deck = createShuffledDeck();
    const handSize = getHandSize(numberOfPlayers);
    const hands = [];
    for(let i = 0; i < numberOfPlayers; i++){
        const hand = deck.splice(0, handSize);
        hand.sort((a, b)=>a - b);
        hands.push(hand);
    }
    const piles = [
        {
            id: 1,
            direction: "ascending",
            value: 1
        },
        {
            id: 2,
            direction: "ascending",
            value: 1
        },
        {
            id: 3,
            direction: "descending",
            value: 100
        },
        {
            id: 4,
            direction: "descending",
            value: 100
        }
    ];
    return {
        deck,
        piles,
        hands,
        currentPlayer: 0,
        cardsPlayed: 0
    };
}
/**
 * Checks if a move is valid according to the game rules.
 * @param pile - The pile to play on.
 * @param card - The card to play.
 * @returns True if the move is valid, false otherwise.
 */ function isMoveValid(pile, card) {
    if (pile.direction === "ascending") {
        // Ascending pile: card must be greater, or it's a 10-jump
        return card > pile.value || card === pile.value - 10;
    } else {
        // Descending pile: card must be smaller, or it's a 10-jump
        return card < pile.value || card === pile.value + 10;
    }
}
/**
 * Returns a list of all possible moves for the current player.
 * @param gameState - The current state of the game.
 * @returns An array of valid moves.
 */ function getValidMoves(gameState) {
    const validMoves = [];
    const currentPlayerHand = gameState.hands[gameState.currentPlayer];
    if (!currentPlayerHand) return [];
    for (const card of currentPlayerHand){
        for (const pile of gameState.piles){
            if (isMoveValid(pile, card)) {
                validMoves.push({
                    card,
                    pileId: pile.id
                });
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
 */ function applyMoves(gameState, moves) {
    const newGameState = JSON.parse(JSON.stringify(gameState));
    const currentPlayerHand = newGameState.hands[newGameState.currentPlayer];
    for (const move of moves){
        const pile = newGameState.piles.find((p)=>p.id === move.pileId);
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
 */ function drawCards(gameState) {
    const newGameState = JSON.parse(JSON.stringify(gameState));
    const handSize = getHandSize(newGameState.hands.length);
    const currentPlayerHand = newGameState.hands[newGameState.currentPlayer];
    const cardsToDraw = Math.min(handSize - currentPlayerHand.length, newGameState.deck.length);
    const newCards = newGameState.deck.splice(0, cardsToDraw);
    currentPlayerHand.push(...newCards);
    currentPlayerHand.sort((a, b)=>a - b);
    return newGameState;
}
/**
 * Advances the turn to the next player.
 * @param gameState The current game state.
 * @returns The new game state with the updated player turn.
 */ function advanceTurn(gameState) {
    const newGameState = JSON.parse(JSON.stringify(gameState));
    newGameState.currentPlayer = (newGameState.currentPlayer + 1) % newGameState.hands.length;
    return newGameState;
}

;// CONCATENATED MODULE: ./lib/game/strategies.ts
// This file defines the AI strategies for playing "The Game".

/**
 * A rule-based strategy: Play the minimum required cards (prioritizing 10-jumps and closest cards),
 * then only play more if the card is a direct follower (±1), a 10-jump, or clearly improves the pile.
 * Stop otherwise.
 */ const ruleBasedStrategy = (gameState, playerIndex, params = {})=>{
    const { playExtraTendency = 0.5, maxAllowedJump = 99, pileHealthCaution = 0.5 } = params;
    const hand = [
        ...gameState.hands[playerIndex]
    ];
    if (hand.length === 0) return [];
    const minRequired = gameState.deck.length > 0 ? 2 : 1;
    const moves = [];
    let piles = [
        ...gameState.piles.map((p)=>({
                ...p
            }))
    ];
    let handCopy = [
        ...hand
    ];
    // Helper to get valid moves for the current hand and piles
    function getMoves(currentHand, currentPiles) {
        const tempState = {
            ...gameState,
            hands: [
                ...gameState.hands.slice(0, playerIndex),
                currentHand,
                ...gameState.hands.slice(playerIndex + 1)
            ],
            piles: currentPiles,
            currentPlayer: playerIndex
        };
        return getValidMoves(tempState);
    }
    // Helper to filter out moves that target piles booked by other players
    function filterMovesAvoidingBookedByOthers(moves) {
        return moves.filter((m)=>{
            const pile = piles.find((p)=>p.id === m.pileId);
            return pile.bookedBy === undefined || pile.bookedBy === playerIndex;
        });
    }
    // 1. Play the minimum required cards (prioritize 10-jumps, then closest)
    for(let i = 0; i < minRequired; i++){
        let validMoves = getMoves(handCopy, piles);
        let safeMoves = filterMovesAvoidingBookedByOthers(validMoves);
        // If there are safe moves, use them; otherwise, fallback to all valid moves
        validMoves = safeMoves.length > 0 ? safeMoves : validMoves;
        if (validMoves.length === 0) break;
        // Prefer 10-jump
        let move = validMoves.find((m)=>{
            const pile = piles.find((p)=>p.id === m.pileId);
            return Math.abs(m.card - pile.value) === 10;
        });
        // Otherwise, play the closest card
        if (!move) {
            let minDiff = Infinity;
            for (const m of validMoves){
                const pile = piles.find((p)=>p.id === m.pileId);
                const diff = Math.abs(m.card - pile.value);
                if (diff < minDiff) {
                    minDiff = diff;
                    move = m;
                }
            }
        }
        if (!move) break;
        moves.push(move);
        // Update hand and piles
        handCopy = handCopy.filter((c)=>c !== move.card);
        piles = piles.map((p)=>p.id === move.pileId ? {
                ...p,
                value: move.card
            } : p);
    }
    // 2. Only play more if allowed by parameters
    while(true){
        let validMoves = getMoves(handCopy, piles);
        let safeMoves = filterMovesAvoidingBookedByOthers(validMoves);
        validMoves = safeMoves.length > 0 ? safeMoves : validMoves;
        if (validMoves.length === 0) break;
        // Find a move that is a direct follower, a 10-jump, or within maxAllowedJump
        let move;
        for (const m of validMoves){
            const pile = piles.find((p)=>p.id === m.pileId);
            const diff = m.card - pile.value;
            const absDiff = Math.abs(diff);
            // Always allow direct follower or 10-jump
            if (absDiff === 1 || absDiff === 10) {
                move = m;
                break;
            }
            // Allow bigger jumps if within maxAllowedJump and not too risky
            if (absDiff <= maxAllowedJump && (pileHealthCaution < 0.5 || (pile.direction === "ascending" ? m.card < 90 : m.card > 10))) {
                move = m;
                break;
            }
        }
        // Decide probabilistically whether to play extra
        if (!move || Math.random() > playExtraTendency) break;
        moves.push(move);
        handCopy = handCopy.filter((c)=>c !== move.card);
        piles = piles.map((p)=>p.id === move.pileId ? {
                ...p,
                value: move.card
            } : p);
    }
    return moves;
};
/**
 * updateBooking method for ruleBasedStrategy.
 * Decides whether to book a pile based on bookingFrequency parameter.
 */ ruleBasedStrategy.updateBooking = function(gameState, playerIndex, params = {}) {
    const { bookingFrequency = 0 } = params;
    if (bookingFrequency === 0) return null;
    const hand = gameState.hands[playerIndex];
    // Find all possible moves
    const moves = getValidMoves({
        ...gameState,
        currentPlayer: playerIndex
    });
    // Helper to get pile for a move
    const getPile = (move)=>gameState.piles.find((p)=>p.id === move.pileId);
    // 1. Book if a 10-jump is available
    if (bookingFrequency >= 1) {
        const tenJumpMove = moves.find((m)=>{
            const pile = getPile(m);
            return Math.abs(m.card - pile.value) === 10 && (pile.bookedBy === undefined || pile.bookedBy === playerIndex);
        });
        if (tenJumpMove) {
            return {
                pileId: tenJumpMove.pileId,
                action: "book"
            };
        }
    }
    // 2. Book if a ±1 move is available (if bookingFrequency >= 2)
    if (bookingFrequency >= 2) {
        const plusMinusOneMove = moves.find((m)=>{
            const pile = getPile(m);
            return Math.abs(m.card - pile.value) === 1 && (pile.bookedBy === undefined || pile.bookedBy === playerIndex);
        });
        if (plusMinusOneMove) {
            return {
                pileId: plusMinusOneMove.pileId,
                action: "book"
            };
        }
    }
    // Otherwise, release any pile currently booked by this player
    const bookedPile = gameState.piles.find((p)=>p.bookedBy === playerIndex);
    if (bookedPile) {
        return {
            pileId: bookedPile.id,
            action: "release"
        };
    }
    return null;
};

;// CONCATENATED MODULE: ./lib/game/simulate.ts
// This file runs the game simulation with a given strategy.


const MIN_CARDS_TO_PLAY_PER_TURN = 2;
/**
 * Runs a single game from start to finish with a given strategy (or array of strategies) for all players.
 * Supports booking logic: after each turn, calls updateBooking if present.
 * @param strategies - A single strategy or an array of strategies (one per player).
 * @param numberOfPlayers - The number of players in the game.
 * @param logger - An optional function to log game events for debugging.
 * @returns The final number of cards left in the deck and all hands.
 */ function runSingleGame(strategies, numberOfPlayers, logger) {
    let gameState = createGame(numberOfPlayers);
    logger?.(`--- Starting a new game with ${numberOfPlayers} players ---\n`);
    // Normalize strategies to an array
    const strategyList = Array.isArray(strategies) ? strategies : Array(numberOfPlayers).fill(strategies);
    while(true){
        const currentPlayer = gameState.currentPlayer;
        const strategy = strategyList[currentPlayer];
        logger?.(`\n--- Player ${currentPlayer + 1}'s Turn ---`);
        logger?.(`Piles: ${JSON.stringify(gameState.piles.map((p)=>p.value))}`);
        logger?.(`Hand:  ${JSON.stringify(gameState.hands[currentPlayer])}`);
        // Determine the minimum number of cards to play
        const minRequired = gameState.deck.length > 0 ? MIN_CARDS_TO_PLAY_PER_TURN : 1;
        let playedCount = 0;
        let movesToPlay = [];
        let tempGameState = {
            ...gameState
        };
        // Try to play up to minRequired cards
        while(playedCount < minRequired){
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
            logger?.(`Piles after play: ${JSON.stringify(gameState.piles.map((p)=>p.value))}`);
        } else {
            logger?.("Plays: No moves were made.");
        }
        const handBeforeDraw = [
            ...gameState.hands[currentPlayer]
        ];
        gameState = drawCards(gameState);
        const cardsDrawn = gameState.hands[currentPlayer].filter((c)=>!handBeforeDraw.includes(c));
        if (cardsDrawn.length > 0) {
            logger?.(`Draws: ${JSON.stringify(cardsDrawn)}`);
            logger?.(`New Hand: ${JSON.stringify(gameState.hands[currentPlayer])}`);
        }
        // --- Booking logic: allow player to book or release a pile ---
        if (typeof strategy.updateBooking === "function") {
            const bookingAction = strategy.updateBooking(gameState, currentPlayer);
            if (bookingAction) {
                const pile = gameState.piles.find((p)=>p.id === bookingAction.pileId);
                if (pile) {
                    if (bookingAction.action === "book") {
                        pile.bookedBy = currentPlayer;
                        logger?.(`Player ${currentPlayer + 1} books pile ${pile.id}`);
                    } else if (bookingAction.action === "release" && pile.bookedBy === currentPlayer) {
                        pile.bookedBy = undefined;
                        logger?.(`Player ${currentPlayer + 1} releases pile ${pile.id}`);
                    }
                }
            }
        }
        // Win condition: all cards played
        const totalCardsInHands = gameState.hands.reduce((sum, hand)=>sum + hand.length, 0);
        if (totalCardsInHands === 0 && gameState.deck.length === 0) {
            logger?.("--- GAME WON: All cards have been played! ---");
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
 */ function runSimulation(strategy, numberOfGames, numberOfPlayers) {
    let totalCardsLeft = 0;
    let wins = 0;
    for(let i = 0; i < numberOfGames; i++){
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
        averageCardsLeft: totalCardsLeft / numberOfGames
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
 */ function runParameterSearch(paramRanges, numberOfGames, numberOfPlayers, maxIterations = 100, logger) {
    // Generate all parameter combinations (cartesian product)
    const combos = [];
    for (const playExtraTendency of paramRanges.playExtraTendency){
        for (const maxAllowedJump of paramRanges.maxAllowedJump){
            for (const pileHealthCaution of paramRanges.pileHealthCaution){
                for (const bookingFrequency of paramRanges.bookingFrequency){
                    combos.push({
                        playExtraTendency,
                        maxAllowedJump,
                        pileHealthCaution,
                        bookingFrequency
                    });
                }
            }
        }
    }
    // Limit to maxIterations
    const limitedCombos = combos.slice(0, maxIterations);
    const results = [];
    let iter = 0;
    for (const params of limitedCombos){
        iter++;
        logger?.(`Testing combo ${iter}/${limitedCombos.length}: ${JSON.stringify(params)}`);
        const simResult = runSimulation((gs, pi)=>ruleBasedStrategy(gs, pi, params), numberOfGames, numberOfPlayers);
        results.push({
            ...params,
            winRate: simResult.wins / simResult.numberOfGames,
            avgCardsLeft: simResult.averageCardsLeft
        });
    }
    // Sort by win rate desc, then avgCardsLeft asc
    results.sort((a, b)=>b.winRate - a.winRate || a.avgCardsLeft - b.avgCardsLeft);
    return results;
}

;// CONCATENATED MODULE: ./pages/game.tsx
// This page provides a web interface for running and analyzing simulations of "The Game" with tunable strategy parameters.










function GamePage() {
    const [numPlayers, setNumPlayers] = (0,external_react_.useState)(2);
    const [playExtraTendency, setPlayExtraTendency] = (0,external_react_.useState)(0.5);
    const [maxAllowedJump, setMaxAllowedJump] = (0,external_react_.useState)(99);
    const [pileHealthCaution, setPileHealthCaution] = (0,external_react_.useState)(0.5);
    const [mode, setMode] = (0,external_react_.useState)("single");
    const [numGames, setNumGames] = (0,external_react_.useState)(1000);
    const [maxIterations, setMaxIterations] = (0,external_react_.useState)(50);
    const [results, setResults] = (0,external_react_.useState)(null);
    const [loading, setLoading] = (0,external_react_.useState)(false);
    const [bookingFrequency, setBookingFrequency] = (0,external_react_.useState)(0);
    const [searchLog, setSearchLog] = (0,external_react_.useState)([]);
    // Parameter search ranges
    const [playExtraTendencyRange, setPlayExtraTendencyRange] = (0,external_react_.useState)([
        0,
        0.5,
        1
    ]);
    const [maxAllowedJumpRange, setMaxAllowedJumpRange] = (0,external_react_.useState)([
        1,
        10,
        99
    ]);
    const [pileHealthCautionRange, setPileHealthCautionRange] = (0,external_react_.useState)([
        0,
        0.5,
        1
    ]);
    const [bookingFrequencyRange, setBookingFrequencyRange] = (0,external_react_.useState)([
        0,
        1,
        2
    ]);
    const params = {
        playExtraTendency,
        maxAllowedJump,
        pileHealthCaution,
        bookingFrequency
    };
    const handleRun = async ()=>{
        setLoading(true);
        setResults(null);
        if (mode === "single") {
            // Run a single game with verbose logging
            const log = [];
            runSingleGame((gs, pi)=>ruleBasedStrategy(gs, pi, params), numPlayers, (msg)=>log.push(msg));
            setResults({
                mode,
                numPlayers,
                playExtraTendency,
                maxAllowedJump,
                pileHealthCaution,
                log
            });
        } else if (mode === "multi") {
            // Run multiple simulations
            const simResults = runSimulation((gs, pi)=>ruleBasedStrategy(gs, pi, params), numGames, numPlayers);
            setResults({
                mode,
                numPlayers,
                playExtraTendency,
                maxAllowedJump,
                pileHealthCaution,
                numGames,
                winRate: simResults.wins / simResults.numberOfGames,
                avgCardsLeft: simResults.averageCardsLeft
            });
        } else if (mode === "search") {
            // Parameter search mode
            const log = [];
            setSearchLog([]);
            const results = runParameterSearch({
                playExtraTendency: playExtraTendencyRange,
                maxAllowedJump: maxAllowedJumpRange,
                pileHealthCaution: pileHealthCautionRange,
                bookingFrequency: bookingFrequencyRange
            }, numGames, numPlayers, maxIterations, (msg)=>{
                log.push(msg);
                setSearchLog([
                    ...log
                ]);
            });
            setResults({
                mode,
                results
            });
        }
        setLoading(false);
    };
    return /*#__PURE__*/ jsx_runtime.jsx("div", {
        className: "min-h-screen bg-gray-50 py-8 px-4 flex flex-col items-center",
        children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
            className: "w-full max-w-2xl bg-white rounded-xl shadow-lg p-8",
            children: [
                /*#__PURE__*/ (0,jsx_runtime.jsxs)("h1", {
                    className: "text-3xl font-bold mb-6 flex items-center gap-2",
                    children: [
                        /*#__PURE__*/ jsx_runtime.jsx(bar_chart_2/* default */.Z, {
                            className: "w-8 h-8 text-blue-500"
                        }),
                        "The Game — Simulation Lab"
                    ]
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsxs)("form", {
                    className: "space-y-6",
                    onSubmit: (e)=>{
                        e.preventDefault();
                        handleRun();
                    },
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                            className: "flex flex-col gap-2",
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("label", {
                                    className: "font-semibold flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ jsx_runtime.jsx(users/* default */.Z, {
                                            className: "w-4 h-4"
                                        }),
                                        " Number of players"
                                    ]
                                }),
                                /*#__PURE__*/ jsx_runtime.jsx("input", {
                                    type: "number",
                                    min: 1,
                                    max: 5,
                                    value: numPlayers,
                                    onChange: (e)=>setNumPlayers(Number(e.target.value)),
                                    className: "input input-bordered w-full max-w-xs"
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                            className: "flex flex-col gap-2",
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("label", {
                                    className: "font-semibold flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ jsx_runtime.jsx(settings/* default */.Z, {
                                            className: "w-4 h-4"
                                        }),
                                        " Tendency to play extra cards"
                                    ]
                                }),
                                /*#__PURE__*/ jsx_runtime.jsx("input", {
                                    type: "range",
                                    min: 0,
                                    max: 1,
                                    step: 0.01,
                                    value: playExtraTendency,
                                    onChange: (e)=>setPlayExtraTendency(Number(e.target.value))
                                }),
                                /*#__PURE__*/ jsx_runtime.jsx("span", {
                                    className: "text-xs text-gray-500",
                                    children: playExtraTendency
                                }),
                                /*#__PURE__*/ jsx_runtime.jsx("span", {
                                    className: "text-xs text-gray-400",
                                    children: "0 = never play extra cards, 1 = always play extra cards if allowed. Controls how likely the player is to play more than the minimum required cards."
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                            className: "flex flex-col gap-2",
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("label", {
                                    className: "font-semibold flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ jsx_runtime.jsx(settings/* default */.Z, {
                                            className: "w-4 h-4"
                                        }),
                                        " Max allowed jump for extra cards"
                                    ]
                                }),
                                /*#__PURE__*/ jsx_runtime.jsx("input", {
                                    type: "range",
                                    min: 1,
                                    max: 99,
                                    step: 1,
                                    value: maxAllowedJump,
                                    onChange: (e)=>setMaxAllowedJump(Number(e.target.value))
                                }),
                                /*#__PURE__*/ jsx_runtime.jsx("span", {
                                    className: "text-xs text-gray-500",
                                    children: maxAllowedJump
                                }),
                                /*#__PURE__*/ jsx_runtime.jsx("span", {
                                    className: "text-xs text-gray-400",
                                    children: "1 = only direct followers/10-jumps, 99 = allow any jump. Controls how big a jump you're willing to make for extra cards (riskiness)."
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                            className: "flex flex-col gap-2",
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("label", {
                                    className: "font-semibold flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ jsx_runtime.jsx(settings/* default */.Z, {
                                            className: "w-4 h-4"
                                        }),
                                        " Pile health caution"
                                    ]
                                }),
                                /*#__PURE__*/ jsx_runtime.jsx("input", {
                                    type: "range",
                                    min: 0,
                                    max: 1,
                                    step: 0.01,
                                    value: pileHealthCaution,
                                    onChange: (e)=>setPileHealthCaution(Number(e.target.value))
                                }),
                                /*#__PURE__*/ jsx_runtime.jsx("span", {
                                    className: "text-xs text-gray-500",
                                    children: pileHealthCaution
                                }),
                                /*#__PURE__*/ jsx_runtime.jsx("span", {
                                    className: "text-xs text-gray-400",
                                    children: '0 = don\'t care about pile health, 1 = never "waste" a pile. Controls how cautious the player is about leaving piles in a good state for the future.'
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                            className: "flex flex-col gap-2",
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("label", {
                                    className: "font-semibold flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ jsx_runtime.jsx(settings/* default */.Z, {
                                            className: "w-4 h-4"
                                        }),
                                        " Pile booking frequency"
                                    ]
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("select", {
                                    value: bookingFrequency,
                                    onChange: (e)=>setBookingFrequency(Number(e.target.value)),
                                    className: "input input-bordered w-full max-w-xs",
                                    children: [
                                        /*#__PURE__*/ jsx_runtime.jsx("option", {
                                            value: 0,
                                            children: "Never book a pile"
                                        }),
                                        /*#__PURE__*/ jsx_runtime.jsx("option", {
                                            value: 1,
                                            children: "Book if a 10-jump is available"
                                        }),
                                        /*#__PURE__*/ jsx_runtime.jsx("option", {
                                            value: 2,
                                            children: "Book if a 10-jump or \xb11 is available"
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ jsx_runtime.jsx("span", {
                                    className: "text-xs text-gray-400",
                                    children: 'Controls how often the player will "book" a pile to signal intent to other players.'
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                            className: "flex flex-col gap-2",
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("label", {
                                    className: "font-semibold flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ jsx_runtime.jsx(eye/* default */.Z, {
                                            className: "w-4 h-4"
                                        }),
                                        " Simulation mode"
                                    ]
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    className: "flex gap-4",
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("button", {
                                            type: "button",
                                            className: `flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${mode === "single" ? "bg-blue-100 border-blue-500 text-blue-700 shadow" : "bg-white border-gray-300 text-gray-700"} hover:border-blue-400`,
                                            onClick: ()=>setMode("single"),
                                            children: [
                                                mode === "single" && /*#__PURE__*/ jsx_runtime.jsx(circle_check/* default */.Z, {
                                                    className: "w-4 h-4 text-blue-500"
                                                }),
                                                "Single Game (Verbose)"
                                            ]
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("button", {
                                            type: "button",
                                            className: `flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${mode === "multi" ? "bg-blue-100 border-blue-500 text-blue-700 shadow" : "bg-white border-gray-300 text-gray-700"} hover:border-blue-400`,
                                            onClick: ()=>setMode("multi"),
                                            children: [
                                                mode === "multi" && /*#__PURE__*/ jsx_runtime.jsx(circle_check/* default */.Z, {
                                                    className: "w-4 h-4 text-blue-500"
                                                }),
                                                "Multiple Simulations"
                                            ]
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("button", {
                                            type: "button",
                                            className: `flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${mode === "search" ? "bg-blue-100 border-blue-500 text-blue-700 shadow" : "bg-white border-gray-300 text-gray-700"} hover:border-blue-400`,
                                            onClick: ()=>setMode("search"),
                                            children: [
                                                mode === "search" && /*#__PURE__*/ jsx_runtime.jsx(circle_check/* default */.Z, {
                                                    className: "w-4 h-4 text-blue-500"
                                                }),
                                                "Parameter Search (Find Optimal)"
                                            ]
                                        })
                                    ]
                                }),
                                mode === "multi" && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    className: "flex flex-col gap-2 mt-2",
                                    children: [
                                        /*#__PURE__*/ jsx_runtime.jsx("label", {
                                            className: "text-sm",
                                            children: "Number of games"
                                        }),
                                        /*#__PURE__*/ jsx_runtime.jsx("input", {
                                            type: "number",
                                            min: 1,
                                            max: 10000,
                                            value: numGames,
                                            onChange: (e)=>setNumGames(Number(e.target.value)),
                                            className: "input input-bordered w-full max-w-xs"
                                        })
                                    ]
                                }),
                                mode === "search" && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                    className: "flex flex-col gap-2 mt-2",
                                    children: [
                                        /*#__PURE__*/ jsx_runtime.jsx("label", {
                                            className: "text-sm",
                                            children: "Number of games per combo"
                                        }),
                                        /*#__PURE__*/ jsx_runtime.jsx("input", {
                                            type: "number",
                                            min: 1,
                                            max: 10000,
                                            value: numGames,
                                            onChange: (e)=>setNumGames(Number(e.target.value)),
                                            className: "input input-bordered w-full max-w-xs"
                                        }),
                                        /*#__PURE__*/ jsx_runtime.jsx("label", {
                                            className: "text-sm",
                                            children: "Max parameter combinations (iterations)"
                                        }),
                                        /*#__PURE__*/ jsx_runtime.jsx("input", {
                                            type: "number",
                                            min: 1,
                                            max: 500,
                                            value: maxIterations,
                                            onChange: (e)=>setMaxIterations(Number(e.target.value)),
                                            className: "input input-bordered w-full max-w-xs"
                                        }),
                                        /*#__PURE__*/ jsx_runtime.jsx("label", {
                                            className: "text-sm",
                                            children: "playExtraTendency values (comma separated)"
                                        }),
                                        /*#__PURE__*/ jsx_runtime.jsx("input", {
                                            type: "text",
                                            value: playExtraTendencyRange.join(","),
                                            onChange: (e)=>setPlayExtraTendencyRange(e.target.value.split(",").map(Number).filter((x)=>!isNaN(x))),
                                            className: "input input-bordered w-full max-w-xs"
                                        }),
                                        /*#__PURE__*/ jsx_runtime.jsx("label", {
                                            className: "text-sm",
                                            children: "maxAllowedJump values (comma separated)"
                                        }),
                                        /*#__PURE__*/ jsx_runtime.jsx("input", {
                                            type: "text",
                                            value: maxAllowedJumpRange.join(","),
                                            onChange: (e)=>setMaxAllowedJumpRange(e.target.value.split(",").map(Number).filter((x)=>!isNaN(x))),
                                            className: "input input-bordered w-full max-w-xs"
                                        }),
                                        /*#__PURE__*/ jsx_runtime.jsx("label", {
                                            className: "text-sm",
                                            children: "pileHealthCaution values (comma separated)"
                                        }),
                                        /*#__PURE__*/ jsx_runtime.jsx("input", {
                                            type: "text",
                                            value: pileHealthCautionRange.join(","),
                                            onChange: (e)=>setPileHealthCautionRange(e.target.value.split(",").map(Number).filter((x)=>!isNaN(x))),
                                            className: "input input-bordered w-full max-w-xs"
                                        }),
                                        /*#__PURE__*/ jsx_runtime.jsx("label", {
                                            className: "text-sm",
                                            children: "bookingFrequency values (comma separated)"
                                        }),
                                        /*#__PURE__*/ jsx_runtime.jsx("input", {
                                            type: "text",
                                            value: bookingFrequencyRange.join(","),
                                            onChange: (e)=>setBookingFrequencyRange(e.target.value.split(",").map(Number).filter((x)=>!isNaN(x))),
                                            className: "input input-bordered w-full max-w-xs"
                                        })
                                    ]
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("button", {
                            type: "submit",
                            className: "btn btn-primary w-full flex items-center justify-center gap-2",
                            disabled: loading,
                            children: [
                                /*#__PURE__*/ jsx_runtime.jsx(play/* default */.Z, {
                                    className: "w-5 h-5"
                                }),
                                " ",
                                loading ? "Running..." : "Run Simulation"
                            ]
                        })
                    ]
                }),
                results && /*#__PURE__*/ jsx_runtime.jsx("div", {
                    className: "mt-8",
                    children: results.mode === "single" ? /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "bg-gray-100 rounded-lg p-4 max-h-96 overflow-y-auto",
                        children: [
                            /*#__PURE__*/ jsx_runtime.jsx("h2", {
                                className: "font-bold mb-2",
                                children: "Game Log"
                            }),
                            /*#__PURE__*/ jsx_runtime.jsx("pre", {
                                className: "text-xs whitespace-pre-wrap",
                                children: results.log.join("\n")
                            })
                        ]
                    }) : results.mode === "multi" ? /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "bg-gray-100 rounded-lg p-4",
                        children: [
                            /*#__PURE__*/ jsx_runtime.jsx("h2", {
                                className: "font-bold mb-2",
                                children: "Simulation Results"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "flex flex-col gap-1 text-sm",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                        children: [
                                            "Games played: ",
                                            results.numGames
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                        children: [
                                            "Players: ",
                                            results.numPlayers
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                        children: [
                                            "Win rate: ",
                                            (results.winRate * 100).toFixed(2),
                                            "%"
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                        children: [
                                            "Average cards left: ",
                                            results.avgCardsLeft
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("span", {
                                        children: [
                                            "Booking frequency: ",
                                            bookingFrequency === 0 ? "Never" : bookingFrequency === 1 ? "10-jump only" : "10-jump or \xb11"
                                        ]
                                    })
                                ]
                            })
                        ]
                    }) : /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                        className: "bg-gray-100 rounded-lg p-4",
                        children: [
                            /*#__PURE__*/ jsx_runtime.jsx("h2", {
                                className: "font-bold mb-2",
                                children: "Parameter Search Results"
                            }),
                            /*#__PURE__*/ jsx_runtime.jsx("div", {
                                className: "max-h-64 overflow-y-auto mb-2",
                                children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("table", {
                                    className: "table-auto w-full text-xs",
                                    children: [
                                        /*#__PURE__*/ jsx_runtime.jsx("thead", {
                                            children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("tr", {
                                                children: [
                                                    /*#__PURE__*/ jsx_runtime.jsx("th", {
                                                        children: "playExtraTendency"
                                                    }),
                                                    /*#__PURE__*/ jsx_runtime.jsx("th", {
                                                        children: "maxAllowedJump"
                                                    }),
                                                    /*#__PURE__*/ jsx_runtime.jsx("th", {
                                                        children: "pileHealthCaution"
                                                    }),
                                                    /*#__PURE__*/ jsx_runtime.jsx("th", {
                                                        children: "bookingFrequency"
                                                    }),
                                                    /*#__PURE__*/ jsx_runtime.jsx("th", {
                                                        children: "Win Rate"
                                                    }),
                                                    /*#__PURE__*/ jsx_runtime.jsx("th", {
                                                        children: "Avg Cards Left"
                                                    })
                                                ]
                                            })
                                        }),
                                        /*#__PURE__*/ jsx_runtime.jsx("tbody", {
                                            children: results.results.slice(0, 20).map((r, i)=>/*#__PURE__*/ (0,jsx_runtime.jsxs)("tr", {
                                                    className: i === 0 ? "font-bold bg-blue-50" : "",
                                                    children: [
                                                        /*#__PURE__*/ jsx_runtime.jsx("td", {
                                                            children: r.playExtraTendency
                                                        }),
                                                        /*#__PURE__*/ jsx_runtime.jsx("td", {
                                                            children: r.maxAllowedJump
                                                        }),
                                                        /*#__PURE__*/ jsx_runtime.jsx("td", {
                                                            children: r.pileHealthCaution
                                                        }),
                                                        /*#__PURE__*/ jsx_runtime.jsx("td", {
                                                            children: r.bookingFrequency
                                                        }),
                                                        /*#__PURE__*/ (0,jsx_runtime.jsxs)("td", {
                                                            children: [
                                                                (r.winRate * 100).toFixed(2),
                                                                "%"
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ jsx_runtime.jsx("td", {
                                                            children: r.avgCardsLeft
                                                        })
                                                    ]
                                                }, i))
                                        })
                                    ]
                                })
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "bg-gray-200 rounded p-2 max-h-32 overflow-y-auto text-xs",
                                children: [
                                    /*#__PURE__*/ jsx_runtime.jsx("div", {
                                        children: "Progress log:"
                                    }),
                                    /*#__PURE__*/ jsx_runtime.jsx("pre", {
                                        children: searchLog.join("\n")
                                    })
                                ]
                            })
                        ]
                    })
                })
            ]
        })
    });
}
// Force SSR for Netlify/Next.js so /game is always available
const getServerSideProps = async ()=>{
    return {
        props: {}
    };
};

;// CONCATENATED MODULE: ./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES&page=%2Fgame&preferredRegion=&absolutePagePath=private-next-pages%2Fgame.tsx&absoluteAppPath=private-next-pages%2F_app.tsx&absoluteDocumentPath=private-next-pages%2F_document.tsx&middlewareConfigBase64=e30%3D!
// @ts-ignore this need to be imported from next/dist to be external



// Import the app and document modules.
// @ts-expect-error - replaced by webpack/turbopack loader

// @ts-expect-error - replaced by webpack/turbopack loader

// Import the userland code.
// @ts-expect-error - replaced by webpack/turbopack loader

const PagesRouteModule = pages_module.PagesRouteModule;
// Re-export the component (should be the default export).
/* harmony default export */ const next_route_loaderkind_PAGES_page_2Fgame_preferredRegion_absolutePagePath_private_next_pages_2Fgame_tsx_absoluteAppPath_private_next_pages_2F_app_tsx_absoluteDocumentPath_private_next_pages_2F_document_tsx_middlewareConfigBase64_e30_3D_ = ((0,helpers/* hoist */.l)(pages_game_namespaceObject, "default"));
// Re-export methods.
const getStaticProps = (0,helpers/* hoist */.l)(pages_game_namespaceObject, "getStaticProps");
const getStaticPaths = (0,helpers/* hoist */.l)(pages_game_namespaceObject, "getStaticPaths");
const next_route_loaderkind_PAGES_page_2Fgame_preferredRegion_absolutePagePath_private_next_pages_2Fgame_tsx_absoluteAppPath_private_next_pages_2F_app_tsx_absoluteDocumentPath_private_next_pages_2F_document_tsx_middlewareConfigBase64_e30_3D_getServerSideProps = (0,helpers/* hoist */.l)(pages_game_namespaceObject, "getServerSideProps");
const config = (0,helpers/* hoist */.l)(pages_game_namespaceObject, "config");
const reportWebVitals = (0,helpers/* hoist */.l)(pages_game_namespaceObject, "reportWebVitals");
// Re-export legacy methods.
const unstable_getStaticProps = (0,helpers/* hoist */.l)(pages_game_namespaceObject, "unstable_getStaticProps");
const unstable_getStaticPaths = (0,helpers/* hoist */.l)(pages_game_namespaceObject, "unstable_getStaticPaths");
const unstable_getStaticParams = (0,helpers/* hoist */.l)(pages_game_namespaceObject, "unstable_getStaticParams");
const unstable_getServerProps = (0,helpers/* hoist */.l)(pages_game_namespaceObject, "unstable_getServerProps");
const unstable_getServerSideProps = (0,helpers/* hoist */.l)(pages_game_namespaceObject, "unstable_getServerSideProps");
// Create and export the route module that will be consumed.
const routeModule = new PagesRouteModule({
    definition: {
        kind: route_kind/* RouteKind */.x.PAGES,
        page: "/game",
        pathname: "/game",
        // The following aren't used in production.
        bundlePath: "",
        filename: ""
    },
    components: {
        App: _app["default"],
        Document: _document["default"]
    },
    userland: pages_game_namespaceObject
});

//# sourceMappingURL=pages.js.map

/***/ }),

/***/ 3076:
/***/ ((module) => {

module.exports = require("next/dist/server/future/route-modules/route-module.js");

/***/ }),

/***/ 4140:
/***/ ((module) => {

module.exports = require("next/dist/server/get-page-files.js");

/***/ }),

/***/ 9716:
/***/ ((module) => {

module.exports = require("next/dist/server/htmlescape.js");

/***/ }),

/***/ 3100:
/***/ ((module) => {

module.exports = require("next/dist/server/render.js");

/***/ }),

/***/ 6368:
/***/ ((module) => {

module.exports = require("next/dist/server/utils.js");

/***/ }),

/***/ 6724:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/constants.js");

/***/ }),

/***/ 8743:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/html-context.js");

/***/ }),

/***/ 8524:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/is-plain-object.js");

/***/ }),

/***/ 6689:
/***/ ((module) => {

module.exports = require("react");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [769,456,906], () => (__webpack_exec__(6742)));
module.exports = __webpack_exports__;

})();
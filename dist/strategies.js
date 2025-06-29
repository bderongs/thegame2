"use strict";
// This file defines the AI strategies for playing "The Game".
Object.defineProperty(exports, "__esModule", { value: true });
exports.ruleBasedStrategy = void 0;
const game_1 = require("./game");
/**
 * A rule-based strategy: Play the minimum required cards (prioritizing 10-jumps and closest cards),
 * then only play more if the card is a direct follower (±1), a 10-jump, or clearly improves the pile.
 * Stop otherwise.
 */
const ruleBasedStrategy = (gameState, playerIndex, params = {}) => {
    const { playExtraTendency = 0.5, maxAllowedJump = 99, pileHealthCaution = 0.5, } = params;
    const hand = [...gameState.hands[playerIndex]];
    if (hand.length === 0)
        return [];
    const minRequired = (gameState.deck.length > 0) ? 2 : 1;
    const moves = [];
    let piles = [...gameState.piles.map((p) => (Object.assign({}, p)))];
    let handCopy = [...hand];
    // Helper to get valid moves for the current hand and piles
    function getMoves(currentHand, currentPiles) {
        const tempState = Object.assign(Object.assign({}, gameState), { hands: [...gameState.hands.slice(0, playerIndex), currentHand, ...gameState.hands.slice(playerIndex + 1)], piles: currentPiles, currentPlayer: playerIndex });
        return (0, game_1.getValidMoves)(tempState);
    }
    // 1. Play the minimum required cards (prioritize 10-jumps, then closest)
    for (let i = 0; i < minRequired; i++) {
        const validMoves = getMoves(handCopy, piles);
        if (validMoves.length === 0)
            break;
        // Prefer 10-jump
        let move = validMoves.find(m => {
            const pile = piles.find(p => p.id === m.pileId);
            return Math.abs(m.card - pile.value) === 10;
        });
        // Otherwise, play the closest card
        if (!move) {
            let minDiff = Infinity;
            for (const m of validMoves) {
                const pile = piles.find(p => p.id === m.pileId);
                const diff = Math.abs(m.card - pile.value);
                if (diff < minDiff) {
                    minDiff = diff;
                    move = m;
                }
            }
        }
        if (!move)
            break;
        moves.push(move);
        // Update hand and piles
        handCopy = handCopy.filter(c => c !== move.card);
        piles = piles.map(p => p.id === move.pileId ? Object.assign(Object.assign({}, p), { value: move.card }) : p);
    }
    // 2. Only play more if allowed by parameters
    while (true) {
        const validMoves = getMoves(handCopy, piles);
        if (validMoves.length === 0)
            break;
        // Find a move that is a direct follower, a 10-jump, or within maxAllowedJump
        let move;
        for (const m of validMoves) {
            const pile = piles.find(p => p.id === m.pileId);
            const diff = m.card - pile.value;
            const absDiff = Math.abs(diff);
            // Always allow direct follower or 10-jump
            if (absDiff === 1 || absDiff === 10) {
                move = m;
                break;
            }
            // Allow bigger jumps if within maxAllowedJump and not too risky
            if (absDiff <= maxAllowedJump &&
                (pileHealthCaution < 0.5 || (pile.direction === 'ascending' ? m.card < 90 : m.card > 10))) {
                move = m;
                break;
            }
        }
        // Decide probabilistically whether to play extra
        if (!move || Math.random() > playExtraTendency)
            break;
        moves.push(move);
        handCopy = handCopy.filter(c => c !== move.card);
        piles = piles.map(p => p.id === move.pileId ? Object.assign(Object.assign({}, p), { value: move.card }) : p);
    }
    return moves;
};
exports.ruleBasedStrategy = ruleBasedStrategy;

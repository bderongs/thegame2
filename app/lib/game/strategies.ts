// This file defines the AI strategies for playing "The Game".

import { GameState, Move, Strategy, Pile } from './types';
import { getValidMoves } from './game';

/**
 * Parameters for the rule-based strategy.
 */
export interface RuleBasedParams {
    playExtraTendency?: number; // 0 (never extra) to 1 (always extra)
    maxAllowedJump?: number;    // 1 (only direct/10-jump) to 99 (any jump)
    pileHealthCaution?: number; // 0 (don't care) to 1 (never waste pile)
    bookingFrequency?: number;  // 0 (never), 1 (10-jump), 2 (10-jump or ±1)
}

/**
 * A rule-based strategy: Play the minimum required cards (prioritizing 10-jumps and closest cards),
 * then only play more if the card is a direct follower (±1), a 10-jump, or clearly improves the pile.
 * Stop otherwise.
 */
export const ruleBasedStrategy = (
    gameState: GameState,
    playerIndex: number,
    params: RuleBasedParams = {}
) => {
    const {
        playExtraTendency = 0.5,
        maxAllowedJump = 99,
        pileHealthCaution = 0.5,
    } = params;
    const hand = [...gameState.hands[playerIndex]];
    if (hand.length === 0) return [];
    const minRequired = (gameState.deck.length > 0) ? 2 : 1;
    const moves: Move[] = [];
    let piles = [...gameState.piles.map((p: Pile) => ({ ...p }))] as [Pile, Pile, Pile, Pile];
    let handCopy = [...hand];

    // Helper to get valid moves for the current hand and piles
    function getMoves(currentHand: number[], currentPiles: [Pile, Pile, Pile, Pile]): Move[] {
        const tempState = { ...gameState, hands: [...gameState.hands.slice(0, playerIndex), currentHand, ...gameState.hands.slice(playerIndex + 1)], piles: currentPiles, currentPlayer: playerIndex };
        return getValidMoves(tempState);
    }

    // Helper to filter out moves that target piles booked by other players
    function filterMovesAvoidingBookedByOthers(moves: Move[]): Move[] {
        return moves.filter(m => {
            const pile = piles.find(p => p.id === m.pileId)!;
            return pile.bookedBy === undefined || pile.bookedBy === playerIndex;
        });
    }

    // 1. Play the minimum required cards (prioritize 10-jumps, then closest)
    for (let i = 0; i < minRequired; i++) {
        let validMoves = getMoves(handCopy, piles);
        let safeMoves = filterMovesAvoidingBookedByOthers(validMoves);
        // If there are safe moves, use them; otherwise, fallback to all valid moves
        validMoves = safeMoves.length > 0 ? safeMoves : validMoves;
        if (validMoves.length === 0) break;
        // Prefer 10-jump
        let move = validMoves.find(m => {
            const pile = piles.find(p => p.id === m.pileId)!;
            return Math.abs(m.card - pile.value) === 10;
        });
        // Otherwise, play the closest card
        if (!move) {
            let minDiff = Infinity;
            for (const m of validMoves) {
                const pile = piles.find(p => p.id === m.pileId)!;
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
        handCopy = handCopy.filter(c => c !== move.card);
        piles = piles.map(p => p.id === move.pileId ? { ...p, value: move.card } : p) as [Pile, Pile, Pile, Pile];
    }

    // 2. Only play more if allowed by parameters
    while (true) {
        let validMoves = getMoves(handCopy, piles);
        let safeMoves = filterMovesAvoidingBookedByOthers(validMoves);
        validMoves = safeMoves.length > 0 ? safeMoves : validMoves;
        if (validMoves.length === 0) break;
        // Find a move that is a direct follower, a 10-jump, or within maxAllowedJump
        let move: Move | undefined;
        for (const m of validMoves) {
            const pile = piles.find(p => p.id === m.pileId)!;
            const diff = m.card - pile.value;
            const absDiff = Math.abs(diff);
            // Always allow direct follower or 10-jump
            if (absDiff === 1 || absDiff === 10) {
                move = m;
                break;
            }
            // Allow bigger jumps if within maxAllowedJump and not too risky
            if (
                absDiff <= maxAllowedJump &&
                (pileHealthCaution < 0.5 || (pile.direction === 'ascending' ? m.card < 90 : m.card > 10))
            ) {
                move = m;
                break;
            }
        }
        // Decide probabilistically whether to play extra
        if (!move || Math.random() > playExtraTendency) break;
        moves.push(move);
        handCopy = handCopy.filter(c => c !== move.card);
        piles = piles.map(p => p.id === move.pileId ? { ...p, value: move.card } : p) as [Pile, Pile, Pile, Pile];
    }

    return moves;
};

/**
 * updateBooking method for ruleBasedStrategy.
 * Decides whether to book a pile based on bookingFrequency parameter.
 */
ruleBasedStrategy.updateBooking = function (
    gameState: GameState,
    playerIndex: number,
    params: RuleBasedParams = {}
) {
    const { bookingFrequency = 0 } = params;
    if (bookingFrequency === 0) return null;
    const hand = gameState.hands[playerIndex];
    // Find all possible moves
    const moves = getValidMoves({ ...gameState, currentPlayer: playerIndex });
    // Helper to get pile for a move
    const getPile = (move: Move) => gameState.piles.find(p => p.id === move.pileId)!;
    // 1. Book if a 10-jump is available
    if (bookingFrequency >= 1) {
        const tenJumpMove = moves.find(m => {
            const pile = getPile(m);
            return Math.abs(m.card - pile.value) === 10 && (pile.bookedBy === undefined || pile.bookedBy === playerIndex);
        });
        if (tenJumpMove) {
            return { pileId: tenJumpMove.pileId, action: 'book' };
        }
    }
    // 2. Book if a ±1 move is available (if bookingFrequency >= 2)
    if (bookingFrequency >= 2) {
        const plusMinusOneMove = moves.find(m => {
            const pile = getPile(m);
            return Math.abs(m.card - pile.value) === 1 && (pile.bookedBy === undefined || pile.bookedBy === playerIndex);
        });
        if (plusMinusOneMove) {
            return { pileId: plusMinusOneMove.pileId, action: 'book' };
        }
    }
    // Otherwise, release any pile currently booked by this player
    const bookedPile = gameState.piles.find(p => p.bookedBy === playerIndex);
    if (bookedPile) {
        return { pileId: bookedPile.id, action: 'release' };
    }
    return null;
}; 
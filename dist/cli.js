"use strict";
// This file provides a command-line interface to run the game simulation.
Object.defineProperty(exports, "__esModule", { value: true });
const simulate_1 = require("./simulate");
const strategies_1 = require("./strategies");
const STRATEGIES = {
    rule: strategies_1.ruleBasedStrategy,
};
function printResults(strategyName, results) {
    console.log(`\n--- Results for ${strategyName} ---`);
    console.log(`Players: ${results.numberOfPlayers}`);
    console.log(`Games Played: ${results.numberOfGames}`);
    console.log(`Wins: ${results.wins} (${((results.wins / results.numberOfGames) * 100).toFixed(2)}%)`);
    console.log(`Average Cards Left: ${results.averageCardsLeft.toFixed(2)}`);
    console.log('--------------------------------\n');
}
function parseParams(args) {
    const params = {};
    for (const arg of args) {
        if (arg.startsWith('--tendency=')) {
            params.playExtraTendency = parseFloat(arg.split('=')[1]);
        }
        else if (arg.startsWith('--maxjump=')) {
            params.maxAllowedJump = parseInt(arg.split('=')[1], 10);
        }
        else if (arg.startsWith('--caution=')) {
            params.pileHealthCaution = parseFloat(arg.split('=')[1]);
        }
    }
    return params;
}
function main() {
    const args = process.argv.slice(2);
    const verbose = args.includes('--verbose') || args.includes('-v');
    const filteredArgs = args.filter(arg => !arg.startsWith('--tendency=') && !arg.startsWith('--maxjump=') && !arg.startsWith('--caution=') && arg !== '--verbose' && arg !== '-v');
    const params = parseParams(args);
    const strategyName = filteredArgs[0] || 'rule';
    const arg1 = filteredArgs[1];
    const arg2 = filteredArgs[2];
    if (strategyName !== 'rule') {
        console.error('Only the "rule" strategy is available.');
        process.exit(1);
    }
    if (verbose) {
        const numberOfPlayers = parseInt(arg1, 10) || 2;
        console.log(`Running single game with "rule" strategy for ${numberOfPlayers} players with verbose output...`);
        (0, simulate_1.runSingleGame)((gs, pi) => (0, strategies_1.ruleBasedStrategy)(gs, pi, params), numberOfPlayers, console.log);
    }
    else {
        const numberOfGames = parseInt(arg1, 10) || 1000;
        const numberOfPlayers = parseInt(arg2, 10) || 2;
        console.log(`Running simulation with "rule" strategy for ${numberOfGames} games and ${numberOfPlayers} players...`);
        (0, simulate_1.runSimulation)((gs, pi) => (0, strategies_1.ruleBasedStrategy)(gs, pi, params), numberOfGames, numberOfPlayers);
    }
}
main();

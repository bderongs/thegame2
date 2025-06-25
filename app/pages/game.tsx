// This page provides a web interface for running and analyzing simulations of "The Game" with tunable strategy parameters.

import React, { useState } from 'react';
import { Play, Users, Settings, BarChart2, Eye, CheckCircle2 } from 'lucide-react';
import { runSimulation, runSingleGame, runParameterSearch } from '../lib/game/simulate';
import { ruleBasedStrategy, RuleBasedParams } from '../lib/game/strategies';
import { GameState } from '../lib/game/types';

export default function GamePage() {
    const [numPlayers, setNumPlayers] = useState(2);
    const [playExtraTendency, setPlayExtraTendency] = useState(0.5);
    const [maxAllowedJump, setMaxAllowedJump] = useState(99);
    const [pileHealthCaution, setPileHealthCaution] = useState(0.5);
    const [mode, setMode] = useState<'single' | 'multi' | 'search'>('single');
    const [numGames, setNumGames] = useState(1000);
    const [maxIterations, setMaxIterations] = useState(50);
    const [results, setResults] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [bookingFrequency, setBookingFrequency] = useState(0);
    const [searchLog, setSearchLog] = useState<string[]>([]);
    // Parameter search ranges
    const [playExtraTendencyRange, setPlayExtraTendencyRange] = useState([0, 0.5, 1]);
    const [maxAllowedJumpRange, setMaxAllowedJumpRange] = useState([1, 10, 99]);
    const [pileHealthCautionRange, setPileHealthCautionRange] = useState([0, 0.5, 1]);
    const [bookingFrequencyRange, setBookingFrequencyRange] = useState([0, 1, 2]);

    const params: RuleBasedParams = {
        playExtraTendency,
        maxAllowedJump,
        pileHealthCaution,
        bookingFrequency,
    };

    const handleRun = async () => {
        setLoading(true);
        setResults(null);
        if (mode === 'single') {
            // Run a single game with verbose logging
            const log: string[] = [];
            runSingleGame((gs: GameState, pi: number) => ruleBasedStrategy(gs, pi, params), numPlayers, (msg: string) => log.push(msg));
            setResults({
                mode,
                numPlayers,
                playExtraTendency,
                maxAllowedJump,
                pileHealthCaution,
                log,
            });
        } else if (mode === 'multi') {
            // Run multiple simulations
            const simResults = runSimulation((gs: GameState, pi: number) => ruleBasedStrategy(gs, pi, params), numGames, numPlayers);
            setResults({
                mode,
                numPlayers,
                playExtraTendency,
                maxAllowedJump,
                pileHealthCaution,
                numGames,
                winRate: simResults.wins / simResults.numberOfGames,
                avgCardsLeft: simResults.averageCardsLeft,
            });
        } else if (mode === 'search') {
            // Parameter search mode
            const log: string[] = [];
            setSearchLog([]);
            const results = runParameterSearch(
                {
                    playExtraTendency: playExtraTendencyRange,
                    maxAllowedJump: maxAllowedJumpRange,
                    pileHealthCaution: pileHealthCautionRange,
                    bookingFrequency: bookingFrequencyRange,
                },
                numGames,
                numPlayers,
                maxIterations,
                (msg: string) => {
                    log.push(msg);
                    setSearchLog([...log]);
                }
            );
            setResults({ mode, results });
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 flex flex-col items-center">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
                    <BarChart2 className="w-8 h-8 text-blue-500" />
                    The Game — Simulation Lab
                </h1>
                <form className="space-y-6" onSubmit={e => { e.preventDefault(); handleRun(); }}>
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold flex items-center gap-2"><Users className="w-4 h-4" /> Number of players</label>
                        <input type="number" min={1} max={5} value={numPlayers} onChange={e => setNumPlayers(Number(e.target.value))} className="input input-bordered w-full max-w-xs" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold flex items-center gap-2"><Settings className="w-4 h-4" /> Tendency to play extra cards</label>
                        <input type="range" min={0} max={1} step={0.01} value={playExtraTendency} onChange={e => setPlayExtraTendency(Number(e.target.value))} />
                        <span className="text-xs text-gray-500">{playExtraTendency}</span>
                        <span className="text-xs text-gray-400">0 = never play extra cards, 1 = always play extra cards if allowed. Controls how likely the player is to play more than the minimum required cards.</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold flex items-center gap-2"><Settings className="w-4 h-4" /> Max allowed jump for extra cards</label>
                        <input type="range" min={1} max={99} step={1} value={maxAllowedJump} onChange={e => setMaxAllowedJump(Number(e.target.value))} />
                        <span className="text-xs text-gray-500">{maxAllowedJump}</span>
                        <span className="text-xs text-gray-400">1 = only direct followers/10-jumps, 99 = allow any jump. Controls how big a jump you're willing to make for extra cards (riskiness).</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold flex items-center gap-2"><Settings className="w-4 h-4" /> Pile health caution</label>
                        <input type="range" min={0} max={1} step={0.01} value={pileHealthCaution} onChange={e => setPileHealthCaution(Number(e.target.value))} />
                        <span className="text-xs text-gray-500">{pileHealthCaution}</span>
                        <span className="text-xs text-gray-400">0 = don't care about pile health, 1 = never "waste" a pile. Controls how cautious the player is about leaving piles in a good state for the future.</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold flex items-center gap-2"><Settings className="w-4 h-4" /> Pile booking frequency</label>
                        <select value={bookingFrequency} onChange={e => setBookingFrequency(Number(e.target.value))} className="input input-bordered w-full max-w-xs">
                            <option value={0}>Never book a pile</option>
                            <option value={1}>Book if a 10-jump is available</option>
                            <option value={2}>Book if a 10-jump or ±1 is available</option>
                        </select>
                        <span className="text-xs text-gray-400">Controls how often the player will "book" a pile to signal intent to other players.</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="font-semibold flex items-center gap-2"><Eye className="w-4 h-4" /> Simulation mode</label>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${mode === 'single' ? 'bg-blue-100 border-blue-500 text-blue-700 shadow' : 'bg-white border-gray-300 text-gray-700'} hover:border-blue-400`}
                                onClick={() => setMode('single')}
                            >
                                {mode === 'single' && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                                Single Game (Verbose)
                            </button>
                            <button
                                type="button"
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${mode === 'multi' ? 'bg-blue-100 border-blue-500 text-blue-700 shadow' : 'bg-white border-gray-300 text-gray-700'} hover:border-blue-400`}
                                onClick={() => setMode('multi')}
                            >
                                {mode === 'multi' && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                                Multiple Simulations
                            </button>
                            <button
                                type="button"
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${mode === 'search' ? 'bg-blue-100 border-blue-500 text-blue-700 shadow' : 'bg-white border-gray-300 text-gray-700'} hover:border-blue-400`}
                                onClick={() => setMode('search')}
                            >
                                {mode === 'search' && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                                Parameter Search (Find Optimal)
                            </button>
                        </div>
                        {mode === 'multi' && (
                            <div className="flex flex-col gap-2 mt-2">
                                <label className="text-sm">Number of games</label>
                                <input type="number" min={1} max={10000} value={numGames} onChange={e => setNumGames(Number(e.target.value))} className="input input-bordered w-full max-w-xs" />
                            </div>
                        )}
                        {mode === 'search' && (
                            <div className="flex flex-col gap-2 mt-2">
                                <label className="text-sm">Number of games per combo</label>
                                <input type="number" min={1} max={10000} value={numGames} onChange={e => setNumGames(Number(e.target.value))} className="input input-bordered w-full max-w-xs" />
                                <label className="text-sm">Max parameter combinations (iterations)</label>
                                <input type="number" min={1} max={500} value={maxIterations} onChange={e => setMaxIterations(Number(e.target.value))} className="input input-bordered w-full max-w-xs" />
                                <label className="text-sm">playExtraTendency values (comma separated)</label>
                                <input type="text" value={playExtraTendencyRange.join(',')} onChange={e => setPlayExtraTendencyRange(e.target.value.split(',').map(Number).filter(x => !isNaN(x)))} className="input input-bordered w-full max-w-xs" />
                                <label className="text-sm">maxAllowedJump values (comma separated)</label>
                                <input type="text" value={maxAllowedJumpRange.join(',')} onChange={e => setMaxAllowedJumpRange(e.target.value.split(',').map(Number).filter(x => !isNaN(x)))} className="input input-bordered w-full max-w-xs" />
                                <label className="text-sm">pileHealthCaution values (comma separated)</label>
                                <input type="text" value={pileHealthCautionRange.join(',')} onChange={e => setPileHealthCautionRange(e.target.value.split(',').map(Number).filter(x => !isNaN(x)))} className="input input-bordered w-full max-w-xs" />
                                <label className="text-sm">bookingFrequency values (comma separated)</label>
                                <input type="text" value={bookingFrequencyRange.join(',')} onChange={e => setBookingFrequencyRange(e.target.value.split(',').map(Number).filter(x => !isNaN(x)))} className="input input-bordered w-full max-w-xs" />
                            </div>
                        )}
                    </div>
                    <button type="submit" className="btn btn-primary w-full flex items-center justify-center gap-2" disabled={loading}>
                        <Play className="w-5 h-5" /> {loading ? 'Running...' : 'Run Simulation'}
                    </button>
                </form>
                {results && (
                    <div className="mt-8">
                        {results.mode === 'single' ? (
                            <div className="bg-gray-100 rounded-lg p-4 max-h-96 overflow-y-auto">
                                <h2 className="font-bold mb-2">Game Log</h2>
                                <pre className="text-xs whitespace-pre-wrap">{results.log.join('\n')}</pre>
                            </div>
                        ) : results.mode === 'multi' ? (
                            <div className="bg-gray-100 rounded-lg p-4">
                                <h2 className="font-bold mb-2">Simulation Results</h2>
                                <div className="flex flex-col gap-1 text-sm">
                                    <span>Games played: {results.numGames}</span>
                                    <span>Players: {results.numPlayers}</span>
                                    <span>Win rate: {(results.winRate * 100).toFixed(2)}%</span>
                                    <span>Average cards left: {results.avgCardsLeft}</span>
                                    <span>Booking frequency: {bookingFrequency === 0 ? 'Never' : bookingFrequency === 1 ? '10-jump only' : '10-jump or ±1'}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-100 rounded-lg p-4">
                                <h2 className="font-bold mb-2">Parameter Search Results</h2>
                                <div className="max-h-64 overflow-y-auto mb-2">
                                    <table className="table-auto w-full text-xs">
                                        <thead>
                                            <tr>
                                                <th>playExtraTendency</th>
                                                <th>maxAllowedJump</th>
                                                <th>pileHealthCaution</th>
                                                <th>bookingFrequency</th>
                                                <th>Win Rate</th>
                                                <th>Avg Cards Left</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {results.results.slice(0, 20).map((r: any, i: number) => (
                                                <tr key={i} className={i === 0 ? 'font-bold bg-blue-50' : ''}>
                                                    <td>{r.playExtraTendency}</td>
                                                    <td>{r.maxAllowedJump}</td>
                                                    <td>{r.pileHealthCaution}</td>
                                                    <td>{r.bookingFrequency}</td>
                                                    <td>{(r.winRate * 100).toFixed(2)}%</td>
                                                    <td>{r.avgCardsLeft}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="bg-gray-200 rounded p-2 max-h-32 overflow-y-auto text-xs">
                                    <div>Progress log:</div>
                                    <pre>{searchLog.join('\n')}</pre>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// Force SSR for Netlify/Next.js so /game is always available
export const getServerSideProps = async () => {
    return { props: {} };
}; 
import React, { useState } from 'react';
import { TrendingUp, BarChart2, ShieldCheck, DollarSign, Filter, ArrowUpRight, CheckCircle2, XCircle } from 'lucide-react';
import { BACKTEST_SUMMARY, SAMPLE_BACKTEST_TRADES } from '../data/footballData';
import { BacktestTrade } from '../types/tft';

export const BacktestEngine: React.FC = () => {
  const [selectedStrategy, setSelectedStrategy] = useState<'value_3pct' | 'all_bets' | 'draw_alpha' | 'underdog'>('value_3pct');

  const filteredTrades = SAMPLE_BACKTEST_TRADES.filter((t) => {
    if (selectedStrategy === 'draw_alpha') return t.predictedOutcome === 'X';
    if (selectedStrategy === 'underdog') return t.marketOdds >= 3.0;
    if (selectedStrategy === 'value_3pct') return t.edge >= 0.03;
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Top Banner and Summary Metrics */}
      <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <TrendingUp className="w-4 h-4" />
              <span>OUT-OF-SAMPLE BACKTESTING · 2018–2026/27</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Quantitative Portfolio Performance & Edge Validation
            </h2>
            <p className="text-xs text-slate-400">
              Walk-forward rolling evaluation testing TFT against bookmaker closing lines with no lookahead bias.
            </p>
          </div>

          {/* Strategy Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setSelectedStrategy('value_3pct')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                selectedStrategy === 'value_3pct' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Value Edge &gt; 3%
            </button>
            <button
              onClick={() => setSelectedStrategy('all_bets')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                selectedStrategy === 'all_bets' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Signals
            </button>
            <button
              onClick={() => setSelectedStrategy('draw_alpha')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                selectedStrategy === 'draw_alpha' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Draw Specialist
            </button>
            <button
              onClick={() => setSelectedStrategy('underdog')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                selectedStrategy === 'underdog' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Underdog Alpha
            </button>
          </div>
        </div>

        {/* 4 Quantitative KPI Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80">
            <div className="text-xs text-slate-400">Cumulative Strategy ROI</div>
            <div className="text-2xl font-mono font-bold text-emerald-400 tabular-nums">
              +{BACKTEST_SUMMARY.totalRoiPercent}%
            </div>
            <div className="text-[11px] text-slate-500 font-mono">4,820 Out-of-sample bets</div>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80">
            <div className="text-xs text-slate-400">Sharpe Ratio (Annualized)</div>
            <div className="text-2xl font-mono font-bold text-white tabular-nums">
              {BACKTEST_SUMMARY.sharpeRatio}
            </div>
            <div className="text-[11px] text-slate-500 font-mono">Max Drawdown: -{BACKTEST_SUMMARY.maxDrawdownPercent}%</div>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80">
            <div className="text-xs text-slate-400">TFT Brier Score vs Market</div>
            <div className="text-2xl font-mono font-bold text-emerald-400 tabular-nums">
              {BACKTEST_SUMMARY.brierScoreTFT}
            </div>
            <div className="text-[11px] text-emerald-400 font-mono">
              Market: {BACKTEST_SUMMARY.brierScoreMarket} (TFT Wins)
            </div>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80">
            <div className="text-xs text-slate-400">Ranked Probability Score</div>
            <div className="text-2xl font-mono font-bold text-blue-400 tabular-nums">
              {BACKTEST_SUMMARY.rankedProbScore}
            </div>
            <div className="text-[11px] text-slate-500 font-mono">Calibrated Multi-Class</div>
          </div>
        </div>
      </div>

      {/* Equity Curve SVG Chart */}
      <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between text-xs">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Cumulative Growth of Bankroll ($10,000 Starting Capital)
            </h3>
            <p className="text-xs text-slate-400">Fractional Half-Kelly staking based on TFT calibrated edge</p>
          </div>
          <div className="font-mono text-emerald-400 font-bold text-sm">
            Current Bankroll: $26,080 (+160.8%)
          </div>
        </div>

        {/* SVG Curve */}
        <div className="h-48 w-full bg-slate-950 rounded-lg border border-slate-800/80 p-2 relative">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 600 150" preserveAspectRatio="none">
            {/* Grid Lines */}
            <line x1="0" y1="35" x2="600" y2="35" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.5" />
            <line x1="0" y1="75" x2="600" y2="75" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.5" />
            <line x1="0" y1="115" x2="600" y2="115" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.5" />

            {/* Gradient fill */}
            <defs>
              <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Area Path */}
            <path
              d="M 10 135 L 70 120 L 130 115 L 190 100 L 250 85 L 310 70 L 370 65 L 430 45 L 490 35 L 580 20 L 580 145 L 10 145 Z"
              fill="url(#equityGrad)"
            />

            {/* Line Path */}
            <path
              d="M 10 135 L 70 120 L 130 115 L 190 100 L 250 85 L 310 70 L 370 65 L 430 45 L 490 35 L 580 20"
              fill="none"
              stroke="#34d399"
              strokeWidth="2.5"
            />
          </svg>
        </div>
      </div>

      {/* Trade Log High-Density Table */}
      <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Recent Out-of-Sample Trades</h3>
            <p className="text-xs text-slate-400">
              Filtered matches with positive edge identified by the model
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">{filteredTrades.length} trades shown</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800 text-[11px]">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">League</th>
                <th className="px-4 py-3">Matchup</th>
                <th className="px-3 py-3">Pick</th>
                <th className="px-3 py-3">Odds</th>
                <th className="px-3 py-3">TFT Prob</th>
                <th className="px-3 py-3">Edge</th>
                <th className="px-3 py-3">Stake</th>
                <th className="px-3 py-3 text-right">PnL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredTrades.map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-2.5 text-slate-400">{t.date}</td>
                  <td className="px-4 py-2.5 font-sans text-slate-300">{t.league}</td>
                  <td className="px-4 py-2.5 font-sans font-medium text-white">
                    {t.homeTeam} vs {t.awayTeam}
                  </td>
                  <td className="px-3 py-2.5 font-bold text-emerald-400">{t.predictedOutcome}</td>
                  <td className="px-3 py-2.5 tabular-nums">{t.marketOdds.toFixed(2)}</td>
                  <td className="px-3 py-2.5 tabular-nums text-slate-200">{(t.modelProb * 100).toFixed(1)}%</td>
                  <td className="px-3 py-2.5 tabular-nums text-emerald-400 font-bold">+{(t.edge * 100).toFixed(1)}%</td>
                  <td className="px-3 py-2.5 tabular-nums text-slate-400">{(t.stakePercent * 100).toFixed(1)}%</td>
                  <td className="px-3 py-2.5 text-right font-bold tabular-nums text-emerald-400">
                    +{t.profitUnit.toFixed(3)}u
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

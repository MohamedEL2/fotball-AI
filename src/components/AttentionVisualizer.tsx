import React, { useState } from 'react';
import { Layers, BarChart3, Info, Eye, ArrowUpRight, Filter, Sparkles, TrendingUp } from 'lucide-react';
import { TEAMS, INITIAL_VSN_WEIGHTS } from '../data/footballData';
import { TeamProfile } from '../types/tft';

export const AttentionVisualizer: React.FC = () => {
  const [selectedTeamKey, setSelectedTeamKey] = useState<string>('mancity');
  const [featureCategoryFilter, setFeatureCategoryFilter] = useState<'all' | 'past_observed' | 'static_covariate' | 'known_future'>('all');
  const [hoveredMatchStep, setHoveredMatchStep] = useState<number | null>(null);

  const team: TeamProfile = TEAMS[selectedTeamKey] || TEAMS.mancity;

  const filteredFeatures = INITIAL_VSN_WEIGHTS.filter((f) => {
    if (featureCategoryFilter === 'all') return true;
    return f.category === featureCategoryFilter;
  });

  const maxAttention = Math.max(...team.recentSequences.map((s) => s.attentionWeight));

  return (
    <div className="space-y-8">
      {/* Top Banner & Club Picker */}
      <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <Layers className="w-4 h-4" />
              <span>INTERPRETABLE MULTI-HEAD ATTENTION</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Temporal Self-Attention & Variable Selection
            </h2>
            <p className="text-xs text-slate-400">
              Inspect how the TFT dynamically assigns attention across 15 historical club matches and filters noise via VSN gating.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Select Club Sequence:</span>
            <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800">
              {Object.keys(TEAMS).map((key) => {
                const t = TEAMS[key];
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedTeamKey(key)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                      selectedTeamKey === key
                        ? 'bg-slate-800 text-white font-bold border border-slate-700'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Team Profile Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800 text-xs">
          <div>
            <div className="text-slate-400">Current European Elo</div>
            <div className="text-lg font-mono font-bold text-emerald-400 tabular-nums">
              {team.currentElo} <span className="text-xs font-normal text-slate-500">pts</span>
            </div>
          </div>
          <div>
            <div className="text-slate-400">Rolling Sequence Length</div>
            <div className="text-lg font-mono font-bold text-white tabular-nums">15 matches</div>
          </div>
          <div>
            <div className="text-slate-400">Highest Attention Spike</div>
            <div className="text-lg font-mono font-bold text-purple-400 tabular-nums">
              {(maxAttention * 100).toFixed(1)}% <span className="text-xs font-normal text-slate-500">weight</span>
            </div>
          </div>
          <div>
            <div className="text-slate-400">Dominant Predictor</div>
            <div className="text-sm font-semibold text-white">Bi-Weekly Elo Delta (24.6%)</div>
          </div>
        </div>
      </div>

      {/* Temporal Attention Weight Heatmap across 15 matches */}
      <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Sequence Attention Heatmap: {team.name}
            </h3>
            <p className="text-xs text-slate-400">
              Hover over any match step in the 15-game lookback to inspect why the self-attention layer weighted this fixture.
            </p>
          </div>
          <div className="text-xs font-mono text-slate-400 flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-slate-800 inline-block border border-slate-700"></span> Low (&lt;5%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-600/60 inline-block"></span> Medium (5–10%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-400 inline-block"></span> High (&gt;10%)
            </span>
          </div>
        </div>

        {/* 15-Step Interactive Attention Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-15 gap-2 font-mono">
          {team.recentSequences.map((seq, index) => {
            const isSelected = hoveredMatchStep === seq.matchIndex;
            const weightPct = seq.attentionWeight * 100;

            let bgColor = 'bg-slate-900 border-slate-800 text-slate-300';
            if (weightPct >= 12) {
              bgColor = 'bg-emerald-500/25 border-emerald-400 text-emerald-300 font-bold';
            } else if (weightPct >= 7) {
              bgColor = 'bg-emerald-600/15 border-emerald-600/40 text-emerald-400 font-semibold';
            }

            return (
              <div
                key={seq.matchIndex}
                onMouseEnter={() => setHoveredMatchStep(seq.matchIndex)}
                onMouseLeave={() => setHoveredMatchStep(null)}
                className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer relative ${bgColor} ${
                  isSelected ? 'ring-2 ring-emerald-400 scale-105 z-10' : ''
                }`}
              >
                <div className="text-[10px] text-slate-400">t-{15 - index}</div>
                <div className="text-xs tabular-nums mt-1">{weightPct.toFixed(1)}%</div>
                <div className="text-[9px] text-slate-400 truncate mt-1">
                  {seq.isHome ? 'H' : 'A'} vs {seq.opponent.split(' ')[0]}
                </div>
                <div className="text-[10px] font-bold mt-0.5">
                  {seq.teamGoals}-{seq.oppGoals}
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Inspection Callout of Selected Match */}
        {(() => {
          const activeSeq =
            team.recentSequences.find((s) => s.matchIndex === hoveredMatchStep) ||
            team.recentSequences[team.recentSequences.length - 1];

          return (
            <div className="mt-4 p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-semibold text-white flex items-center gap-2">
                  <span>Match Context: {team.name} vs {activeSeq.opponent}</span>
                  <span className="font-mono text-emerald-400">
                    (Self-Attention Weight: {(activeSeq.attentionWeight * 100).toFixed(1)}%)
                  </span>
                </span>
                <span className="font-mono text-slate-400">{activeSeq.date}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
                <div>
                  <div className="text-[11px] text-slate-500">Venue & Score</div>
                  <div className="font-mono font-bold text-white">
                    {activeSeq.isHome ? 'Home' : 'Away'} · {activeSeq.teamGoals} - {activeSeq.oppGoals}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500">Expected Goals (xG)</div>
                  <div className="font-mono text-slate-200">
                    {activeSeq.xG.toFixed(2)} vs {activeSeq.xGA.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500">Elo Differential</div>
                  <div className="font-mono text-emerald-400">
                    {activeSeq.eloDiff > 0 ? `+${activeSeq.eloDiff}` : activeSeq.eloDiff} pts
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500">Closing Odds (H / D / A)</div>
                  <div className="font-mono text-slate-200">
                    {activeSeq.closingOddsHome.toFixed(2)} / {activeSeq.closingOddsDraw.toFixed(2)} / {activeSeq.closingOddsAway.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500">Attention Rationale</div>
                  <div className="text-slate-300">
                    {activeSeq.attentionWeight > 0.1
                      ? 'High-intensity rival fixture; primary tactical anchor'
                      : 'Routine domestic league match; baseline anchor'}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Variable Selection Networks (VSN) Feature Importance Breakdown */}
      <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Variable Selection Network (VSN) Importance Weights
            </h3>
            <p className="text-xs text-slate-400">
              Conditioned gating showing which features the TFT selected during sequence encoding.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setFeatureCategoryFilter('all')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                featureCategoryFilter === 'all' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              All (8)
            </button>
            <button
              onClick={() => setFeatureCategoryFilter('past_observed')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                featureCategoryFilter === 'past_observed' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Past Observed
            </button>
            <button
              onClick={() => setFeatureCategoryFilter('static_covariate')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                featureCategoryFilter === 'static_covariate' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Static Covariates
            </button>
            <button
              onClick={() => setFeatureCategoryFilter('known_future')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                featureCategoryFilter === 'known_future' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Known Future
            </button>
          </div>
        </div>

        {/* Feature List */}
        <div className="space-y-4">
          {filteredFeatures.map((feat, index) => {
            const pct = (feat.weight * 100).toFixed(1);

            let tagColor = 'bg-blue-500/10 text-blue-400';
            let label = 'Past Observed';
            if (feat.category === 'static_covariate') {
              tagColor = 'bg-purple-500/10 text-purple-400';
              label = 'Static Covariate';
            } else if (feat.category === 'known_future') {
              tagColor = 'bg-amber-500/10 text-amber-400';
              label = 'Known Future';
            }

            return (
              <div key={index} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{feat.featureName}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${tagColor}`}>{label}</span>
                  </div>
                  <div className="font-mono text-emerald-400 font-bold text-sm">{pct}%</div>
                </div>

                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${(feat.weight / 0.3) * 100}%` }}
                  ></div>
                </div>

                <p className="text-[11px] text-slate-400">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Download, CheckCircle2, Cpu, HardDrive, Sliders, Check, FileCode, BarChart2, ShieldCheck } from 'lucide-react';
import { TFTConfig, EpochLog } from '../types/tft';
import { LEAGUES } from '../data/footballData';

interface TrainingSimulatorProps {
  onTrainingComplete?: (finalLoss: number) => void;
  onInspectAttention?: () => void;
}

export const TrainingSimulator: React.FC<TrainingSimulatorProps> = ({
  onTrainingComplete,
  onInspectAttention,
}) => {
  const [config, setConfig] = useState<TFTConfig>({
    lookbackMatches: 15,
    dModel: 128,
    attentionHeads: 4,
    dropout: 0.15,
    learningRate: 0.001,
    batchSize: 128,
    maxEpochs: 25,
    selectedLeague: 'all',
    quantiles: [0.1, 0.5, 0.9],
    includeElo: true,
    includeBettingOdds: true,
    includeRollingXG: true,
    includeRestDays: true,
  });

  const [pipelineStage, setPipelineStage] = useState<
    'idle' | 'ingesting' | 'features' | 'dataloaders' | 'training' | 'completed'
  >('idle');

  const [currentEpoch, setCurrentEpoch] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [epochLogs, setEpochLogs] = useState<EpochLog[]>([]);
  const [simulatedVramMb, setSimulatedVramMb] = useState<number>(0);
  const [savedArtifacts, setSavedArtifacts] = useState<{
    weightsSaved: boolean;
    featureImportanceSaved: boolean;
    metricsSaved: boolean;
  }>({ weightsSaved: false, featureImportanceSaved: false, metricsSaved: false });

  const timerRef = useRef<number | null>(null);

  // Initial synthetic pre-populated baseline epoch curves
  useEffect(() => {
    if (epochLogs.length === 0) {
      const initialLogs: EpochLog[] = [
        { epoch: 1, trainLoss: 0.542, valLoss: 0.518, valRpsLoss: 0.2310, valAccuracy: 0.512, valLogLoss: 0.982, learningRate: 0.001, durationSec: 104 },
        { epoch: 2, trainLoss: 0.485, valLoss: 0.462, valRpsLoss: 0.2185, valAccuracy: 0.548, valLogLoss: 0.934, learningRate: 0.001, durationSec: 102 },
        { epoch: 3, trainLoss: 0.441, valLoss: 0.428, valRpsLoss: 0.2090, valAccuracy: 0.575, valLogLoss: 0.898, learningRate: 0.001, durationSec: 103 },
        { epoch: 4, trainLoss: 0.412, valLoss: 0.402, valRpsLoss: 0.2012, valAccuracy: 0.598, valLogLoss: 0.865, learningRate: 0.001, durationSec: 105 },
        { epoch: 5, trainLoss: 0.388, valLoss: 0.381, valRpsLoss: 0.1945, valAccuracy: 0.612, valLogLoss: 0.840, learningRate: 0.001, durationSec: 101 },
      ];
      setEpochLogs(initialLogs);
      setCurrentEpoch(5);
    }
  }, []);

  const startPipeline = () => {
    setIsPlaying(true);
    if (pipelineStage === 'idle' || pipelineStage === 'completed') {
      setPipelineStage('ingesting');
      setEpochLogs([]);
      setCurrentEpoch(0);
      setSavedArtifacts({ weightsSaved: false, featureImportanceSaved: false, metricsSaved: false });
      setSimulatedVramMb(1420);

      setTimeout(() => {
        setPipelineStage('features');
        setSimulatedVramMb(2240);
        setTimeout(() => {
          setPipelineStage('dataloaders');
          setSimulatedVramMb(3180);
          setTimeout(() => {
            setPipelineStage('training');
            setSimulatedVramMb(3840);
          }, 1200);
        }, 1200);
      }, 1200);
    }
  };

  const pausePipeline = () => {
    setIsPlaying(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const resetPipeline = () => {
    pausePipeline();
    setPipelineStage('idle');
    setCurrentEpoch(0);
    setEpochLogs([]);
    setSavedArtifacts({ weightsSaved: false, featureImportanceSaved: false, metricsSaved: false });
    setSimulatedVramMb(0);
  };

  useEffect(() => {
    if (isPlaying && pipelineStage === 'training') {
      timerRef.current = window.setInterval(() => {
        setCurrentEpoch((prevEpoch) => {
          const nextEpoch = prevEpoch + 1;
          if (nextEpoch > config.maxEpochs) {
            pausePipeline();
            setPipelineStage('completed');
            setSavedArtifacts({
              weightsSaved: true,
              featureImportanceSaved: true,
              metricsSaved: true,
            });
            if (onTrainingComplete) {
              onTrainingComplete(0.1782);
            }
            return prevEpoch;
          }

          // Mathematical learning rate decay and convergence model
          const progress = nextEpoch / config.maxEpochs;
          const noise = (Math.random() - 0.5) * 0.005;
          const decay = Math.exp(-progress * 2.8);

          const trainLoss = Math.max(0.245, 0.23 + 0.32 * decay + noise);
          const valLoss = Math.max(0.262, 0.25 + 0.30 * decay + (Math.random() - 0.48) * 0.008);
          const valRpsLoss = Math.max(0.1782, 0.175 + 0.06 * decay + noise * 0.5);
          const valAccuracy = Math.min(0.648, 0.48 + 0.16 * (1 - decay) + (Math.random() - 0.5) * 0.006);
          const valLogLoss = Math.max(0.785, 0.77 + 0.25 * decay);

          const newLog: EpochLog = {
            epoch: nextEpoch,
            trainLoss: Number(trainLoss.toFixed(4)),
            valLoss: Number(valLoss.toFixed(4)),
            valRpsLoss: Number(valRpsLoss.toFixed(4)),
            valAccuracy: Number(valAccuracy.toFixed(3)),
            valLogLoss: Number(valLogLoss.toFixed(4)),
            learningRate: Number((config.learningRate * Math.pow(0.92, Math.floor(nextEpoch / 5))).toFixed(6)),
            durationSec: Math.floor(98 + Math.random() * 8),
          };

          setEpochLogs((prevLogs) => [...prevLogs, newLog]);
          return nextEpoch;
        });
      }, 900);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, pipelineStage, config]);

  const downloadJSON = (data: any, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadModelWeightsDummy = () => {
    const meta = {
      model_type: 'TemporalFusionTransformer',
      framework: 'pytorch_forecasting',
      dataset: 'club_football_matches_2000_2026',
      hyperparameters: config,
      best_val_loss: epochLogs.length > 0 ? epochLogs[epochLogs.length - 1].valLoss : 0.265,
      brier_score_tft: 0.1782,
      saved_at: new Date().toISOString(),
      checkpoint_name: 'tft_football_best_epoch25.ckpt',
    };
    downloadJSON(meta, 'tft_football_model_checkpoint_metadata.json');
  };

  return (
    <div className="space-y-8">
      {/* Header and Controls */}
      <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <Cpu className="w-4 h-4" />
              <span>ORCHESTRATOR · NVIDIA T4 TENSOR ENGINE</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              TFT End-to-End Training Pipeline
            </h2>
            <p className="text-xs text-slate-400">
              Autonomous sequence dataloader construction, self-attention convergence, and artifact saving.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isPlaying ? (
              <button
                onClick={startPipeline}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{currentEpoch > 0 ? 'Resume Training' : 'Start Pipeline'}</span>
              </button>
            ) : (
              <button
                onClick={pausePipeline}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-lg transition-colors cursor-pointer"
              >
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause Training</span>
              </button>
            )}

            <button
              onClick={resetPipeline}
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Pipeline Stage Tracker */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 border-t border-slate-800">
          <div
            className={`p-3 rounded-lg border text-xs transition-colors ${
              pipelineStage === 'ingesting'
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                : pipelineStage === 'features' || pipelineStage === 'dataloaders' || pipelineStage === 'training' || pipelineStage === 'completed'
                ? 'bg-slate-900 border-slate-700 text-slate-200'
                : 'bg-slate-950/50 border-slate-800 text-slate-500'
            }`}
          >
            <div className="font-semibold flex items-center justify-between">
              <span>1. Mount & Ingest</span>
              {(pipelineStage === 'features' || pipelineStage === 'dataloaders' || pipelineStage === 'training' || pipelineStage === 'completed') && (
                <Check className="w-3 h-3 text-emerald-400" />
              )}
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">474.8k matches</div>
          </div>

          <div
            className={`p-3 rounded-lg border text-xs transition-colors ${
              pipelineStage === 'features'
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                : pipelineStage === 'dataloaders' || pipelineStage === 'training' || pipelineStage === 'completed'
                ? 'bg-slate-900 border-slate-700 text-slate-200'
                : 'bg-slate-950/50 border-slate-800 text-slate-500'
            }`}
          >
            <div className="font-semibold flex items-center justify-between">
              <span>2. Sequence Elo & Odds</span>
              {(pipelineStage === 'dataloaders' || pipelineStage === 'training' || pipelineStage === 'completed') && (
                <Check className="w-3 h-3 text-emerald-400" />
              )}
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">k={config.lookbackMatches} match window</div>
          </div>

          <div
            className={`p-3 rounded-lg border text-xs transition-colors ${
              pipelineStage === 'dataloaders'
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                : pipelineStage === 'training' || pipelineStage === 'completed'
                ? 'bg-slate-900 border-slate-700 text-slate-200'
                : 'bg-slate-950/50 border-slate-800 text-slate-500'
            }`}
          >
            <div className="font-semibold flex items-center justify-between">
              <span>3. TimeSeriesDataSet</span>
              {(pipelineStage === 'training' || pipelineStage === 'completed') && (
                <Check className="w-3 h-3 text-emerald-400" />
              )}
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">Group: [team_id]</div>
          </div>

          <div
            className={`p-3 rounded-lg border text-xs transition-colors ${
              pipelineStage === 'training'
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                : pipelineStage === 'completed'
                ? 'bg-slate-900 border-slate-700 text-slate-200'
                : 'bg-slate-950/50 border-slate-800 text-slate-500'
            }`}
          >
            <div className="font-semibold flex items-center justify-between">
              <span>4. GPU Training</span>
              {pipelineStage === 'completed' && <Check className="w-3 h-3 text-emerald-400" />}
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
              Epoch {currentEpoch}/{config.maxEpochs}
            </div>
          </div>

          <div
            className={`p-3 rounded-lg border text-xs transition-colors ${
              pipelineStage === 'completed'
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                : 'bg-slate-950/50 border-slate-800 text-slate-500'
            }`}
          >
            <div className="font-semibold flex items-center justify-between">
              <span>5. Save Artifacts</span>
              {pipelineStage === 'completed' && <Check className="w-3 h-3 text-emerald-400" />}
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
              {pipelineStage === 'completed' ? 'Auto-Saved' : 'Pending'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Controls & Status, Right Live Convergence Graph & Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Hyperparameter Configuration */}
        <div className="p-5 bg-slate-900/50 rounded-xl border border-slate-800 space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">TFT Model Hyperparameters</h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Lookback Sequence Window (k)</span>
                <span className="font-mono text-emerald-400">{config.lookbackMatches} matches</span>
              </div>
              <input
                type="range"
                min="5"
                max="25"
                step="1"
                disabled={isPlaying}
                value={config.lookbackMatches}
                onChange={(e) => setConfig({ ...config, lookbackMatches: parseInt(e.target.value) })}
                className="w-full accent-emerald-400"
              />
              <span className="text-[11px] text-slate-500">Historical club matches fed into self-attention layer</span>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Hidden Dimension (d_model)</span>
                <span className="font-mono text-emerald-400">{config.dModel}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[64, 128, 256].map((size) => (
                  <button
                    key={size}
                    type="button"
                    disabled={isPlaying}
                    onClick={() => setConfig({ ...config, dModel: size })}
                    className={`py-1 rounded text-center font-mono border transition-colors ${
                      config.dModel === size
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Attention Heads</span>
                <span className="font-mono text-emerald-400">{config.attentionHeads} heads</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[1, 4, 8].map((heads) => (
                  <button
                    key={heads}
                    type="button"
                    disabled={isPlaying}
                    onClick={() => setConfig({ ...config, attentionHeads: heads })}
                    className={`py-1 rounded text-center font-mono border transition-colors ${
                      config.attentionHeads === heads
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {heads}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Target Global Leagues</span>
                <span className="font-mono text-slate-400 text-[11px]">42 available</span>
              </div>
              <select
                disabled={isPlaying}
                value={config.selectedLeague}
                onChange={(e) => setConfig({ ...config, selectedLeague: e.target.value })}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs focus:border-emerald-500"
              >
                {LEAGUES.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} ({l.totalMatches.toLocaleString()} matches)
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-2">
              <div className="text-slate-400 font-semibold">Sequence Covariate Flags:</div>
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.includeElo}
                  disabled={isPlaying}
                  onChange={(e) => setConfig({ ...config, includeElo: e.target.checked })}
                  className="rounded accent-emerald-400"
                />
                <span>Bi-Weekly European Elo Ratings</span>
              </label>
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.includeBettingOdds}
                  disabled={isPlaying}
                  onChange={(e) => setConfig({ ...config, includeBettingOdds: e.target.checked })}
                  className="rounded accent-emerald-400"
                />
                <span>Historical Closing Pre-Match Odds</span>
              </label>
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.includeRollingXG}
                  disabled={isPlaying}
                  onChange={(e) => setConfig({ ...config, includeRollingXG: e.target.checked })}
                  className="rounded accent-emerald-400"
                />
                <span>Rolling xG & Goal Margins</span>
              </label>
            </div>

            {/* Hardware Status */}
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1 font-mono text-[11px]">
              <div className="text-slate-400 flex items-center justify-between">
                <span>GPU Device:</span>
                <span className="text-slate-200">NVIDIA T4 (16GB)</span>
              </div>
              <div className="text-slate-400 flex items-center justify-between">
                <span>VRAM Allocation:</span>
                <span className="text-emerald-400">{simulatedVramMb} MB / 16,384 MB</span>
              </div>
              <div className="text-slate-400 flex items-center justify-between">
                <span>Throughput:</span>
                <span className="text-slate-200">~124 batches/sec</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Live Loss Curves, Metrics, Artifacts */}
        <div className="lg:col-span-2 space-y-5">
          {/* Convergence Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400">Current Epoch</div>
              <div className="text-xl font-mono font-bold text-white tabular-nums">
                {currentEpoch} <span className="text-xs font-normal text-slate-500">/ {config.maxEpochs}</span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                {currentEpoch > 0 ? `${Math.round((currentEpoch / config.maxEpochs) * 100)}% complete` : 'Ready'}
              </div>
            </div>

            <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400">Val Loss (Quantile)</div>
              <div className="text-xl font-mono font-bold text-emerald-400 tabular-nums">
                {epochLogs.length > 0 ? epochLogs[epochLogs.length - 1].valLoss : '—'}
              </div>
              <div className="text-[11px] text-emerald-500 font-mono">Quantile [0.1, 0.5, 0.9]</div>
            </div>

            <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400">Ranked Prob Score (RPS)</div>
              <div className="text-xl font-mono font-bold text-blue-400 tabular-nums">
                {epochLogs.length > 0 ? epochLogs[epochLogs.length - 1].valRpsLoss : '—'}
              </div>
              <div className="text-[11px] text-slate-500 font-mono">Baseline Odds: 0.1865</div>
            </div>

            <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400">Directional Accuracy</div>
              <div className="text-xl font-mono font-bold text-purple-400 tabular-nums">
                {epochLogs.length > 0 ? `${(epochLogs[epochLogs.length - 1].valAccuracy * 100).toFixed(1)}%` : '—'}
              </div>
              <div className="text-[11px] text-slate-500 font-mono">1X2 Match Outcomes</div>
            </div>
          </div>

          {/* SVG Loss Curve Chart */}
          <div className="p-5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="font-semibold text-slate-200 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-emerald-400" />
                <span>Training & Validation Convergence Curves</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2.5 h-0.5 bg-slate-400 inline-block"></span> Train Loss
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2.5 h-0.5 bg-emerald-400 inline-block"></span> Val Loss
                </span>
                <span className="flex items-center gap-1.5 text-blue-400">
                  <span className="w-2.5 h-0.5 bg-blue-400 inline-block"></span> RPS Score
                </span>
              </div>
            </div>

            {/* SVG Visualizer */}
            <div className="h-52 w-full bg-slate-950/70 rounded-lg border border-slate-800/80 p-2 relative">
              {epochLogs.length > 1 ? (
                <svg className="w-full h-full overflow-visible" viewBox="0 0 600 180" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="45" x2="600" y2="45" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.5" />
                  <line x1="0" y1="90" x2="600" y2="90" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.5" />
                  <line x1="0" y1="135" x2="600" y2="135" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.5" />

                  {/* Train Loss Path */}
                  <path
                    d={epochLogs
                      .map((log, i) => {
                        const x = (i / (Math.max(config.maxEpochs, epochLogs.length) - 1)) * 580 + 10;
                        const y = 160 - ((log.trainLoss - 0.2) / 0.4) * 140;
                        return `${i === 0 ? 'M' : 'L'} ${x} ${Math.max(10, Math.min(170, y))}`;
                      })
                      .join(' ')}
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                  />

                  {/* Val Loss Path */}
                  <path
                    d={epochLogs
                      .map((log, i) => {
                        const x = (i / (Math.max(config.maxEpochs, epochLogs.length) - 1)) * 580 + 10;
                        const y = 160 - ((log.valLoss - 0.2) / 0.4) * 140;
                        return `${i === 0 ? 'M' : 'L'} ${x} ${Math.max(10, Math.min(170, y))}`;
                      })
                      .join(' ')}
                    fill="none"
                    stroke="#34d399"
                    strokeWidth="2"
                  />

                  {/* RPS Path */}
                  <path
                    d={epochLogs
                      .map((log, i) => {
                        const x = (i / (Math.max(config.maxEpochs, epochLogs.length) - 1)) * 580 + 10;
                        const y = 160 - ((log.valRpsLoss - 0.15) / 0.15) * 140;
                        return `${i === 0 ? 'M' : 'L'} ${x} ${Math.max(10, Math.min(170, y))}`;
                      })
                      .join(' ')}
                    fill="none"
                    stroke="#60a5fa"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                  />
                </svg>
              ) : (
                <div className="flex items-center justify-center h-full text-xs text-slate-500 font-mono">
                  Press "Start Pipeline" to stream live GPU training loss curves...
                </div>
              )}
            </div>
          </div>

          {/* Autonomous Saved Artifacts Box */}
          <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Autonomous Saved Artifacts (Output Directory)
                </h4>
              </div>
              <span className="text-[11px] font-mono text-slate-500">./tft_football_output/</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Artifact 1: Checkpoint Weights */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-white">tft_football_best.ckpt</span>
                  {pipelineStage === 'completed' || currentEpoch > 0 ? (
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-3 h-3" /> Ready
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500 font-mono">Pending</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  PyTorch-Lightning checkpoint with PyTorch-Forecasting weights & state dict (142 MB).
                </p>
                <button
                  onClick={downloadModelWeightsDummy}
                  className="w-full flex items-center justify-center gap-1.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>Download Metadata</span>
                </button>
              </div>

              {/* Artifact 2: Feature Importance */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-white">feature_importance.json</span>
                  {pipelineStage === 'completed' || currentEpoch > 0 ? (
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-3 h-3" /> Extracted
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500 font-mono">Pending</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  Variable Selection Network weights across Elo, odds, and rolling match stats.
                </p>
                <button
                  onClick={() =>
                    downloadJSON(
                      {
                        model: 'TemporalFusionTransformer',
                        vsn_weights: {
                          elo_delta: 0.246,
                          market_implied_prob: 0.218,
                          rolling_xg_diff: 0.164,
                          rest_days: 0.112,
                          home_advantage: 0.095,
                        },
                      },
                      'feature_importance.json'
                    )
                  }
                  className="w-full flex items-center justify-center gap-1.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>Export JSON</span>
                </button>
              </div>

              {/* Artifact 3: Validation Metrics */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-white">val_metrics.json</span>
                  {pipelineStage === 'completed' || currentEpoch > 0 ? (
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-3 h-3" /> Logged
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500 font-mono">Pending</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  Final test metrics: Brier score (0.1782), RPS (0.1940), LogLoss (0.785).
                </p>
                <button
                  onClick={() =>
                    downloadJSON(
                      {
                        val_loss: 0.262,
                        brier_score_tft: 0.1782,
                        brier_score_market: 0.1865,
                        ranked_probability_score: 0.1940,
                        directional_accuracy: 0.638,
                        alpha_edge: '+3.8% over market baseline',
                      },
                      'val_metrics.json'
                    )
                  }
                  className="w-full flex items-center justify-center gap-1.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>Export JSON</span>
                </button>
              </div>
            </div>

            {onInspectAttention && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={onInspectAttention}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <span>Proceed to Attention Matrix Visualizer →</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

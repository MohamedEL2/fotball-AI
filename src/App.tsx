/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { TFTFeasibilityOverview } from './components/TFTFeasibilityOverview';
import { KaggleDatasetHub } from './components/KaggleDatasetHub';
import { TrainingSimulator } from './components/TrainingSimulator';
import { AttentionVisualizer } from './components/AttentionVisualizer';
import { MatchInferenceEngine } from './components/MatchInferenceEngine';
import { BacktestEngine } from './components/BacktestEngine';
import { CodeExporter } from './components/CodeExporter';
import { AIAnalystModal } from './components/AIAnalystModal';
import { Sparkles, Terminal, Database, Cpu, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('feasibility');
  const [isAIModalOpen, setIsAIModalOpen] = useState<boolean>(false);

  const handleQuickExport = () => {
    setActiveTab('code');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar adhering to Top Bar Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onQuickExport={handleQuickExport}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'feasibility' && (
          <TFTFeasibilityOverview
            onStartPipeline={() => setActiveTab('simulator')}
            onViewAttention={() => setActiveTab('attention')}
          />
        )}

        {activeTab === 'kaggle' && <KaggleDatasetHub />}

        {activeTab === 'simulator' && (
          <TrainingSimulator
            onInspectAttention={() => setActiveTab('attention')}
          />
        )}

        {activeTab === 'attention' && <AttentionVisualizer />}

        {activeTab === 'inference' && <MatchInferenceEngine />}

        {activeTab === 'backtest' && <BacktestEngine />}

        {activeTab === 'code' && <CodeExporter />}
      </main>

      {/* Floating Quantitative AI Strategist Assistant Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsAIModalOpen(true)}
          className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full border border-slate-700 shadow-xl transition-all hover:border-emerald-500/50 cursor-pointer group"
        >
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold">Ask Quant Strategist</span>
        </button>
      </div>

      {/* Quantitative AI Modal */}
      <AIAnalystModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
      />

      {/* Clean Footer */}
      <footer className="mt-16 border-t border-slate-900 bg-slate-950/80 py-8 px-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Club Football Match Data (2000–2026/27) · 474,820 matches across 42 global leagues</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
            <span>Temporal Fusion Transformer (TFT)</span>
            <span>·</span>
            <span>PyTorch-Forecasting & Lightning</span>
            <span>·</span>
            <span>NVIDIA T4 / A100 GPU</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

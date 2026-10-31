import React from 'react';
import { Download } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onQuickExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onQuickExport }) => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-8 px-6 py-3.5 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      {/* Zone 1: Single text element wordmark */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setActiveTab('feasibility');
        }}
        className="text-lg font-bold tracking-tight text-white hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
      >
        TFT Football ML
      </a>

      {/* Zone 2: 4–5 clean single-line text navigation links */}
      <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-400">
        <button
          onClick={() => setActiveTab('feasibility')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 text-left ${
            activeTab === 'feasibility' ? 'text-emerald-400 font-semibold' : ''
          }`}
        >
          Feasibility & Architecture
        </button>
        <button
          onClick={() => setActiveTab('kaggle')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 text-left ${
            activeTab === 'kaggle' ? 'text-emerald-400 font-semibold' : ''
          }`}
        >
          Kaggle Dataset Hub
        </button>
        <button
          onClick={() => setActiveTab('simulator')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 text-left ${
            activeTab === 'simulator' ? 'text-emerald-400 font-semibold' : ''
          }`}
        >
          Training Pipeline
        </button>
        <button
          onClick={() => setActiveTab('attention')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 text-left ${
            activeTab === 'attention' ? 'text-emerald-400 font-semibold' : ''
          }`}
        >
          Temporal Attention & VSN
        </button>
        <button
          onClick={() => setActiveTab('inference')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 text-left ${
            activeTab === 'inference' ? 'text-emerald-400 font-semibold' : ''
          }`}
        >
          Match Inference & Edge
        </button>
        <button
          onClick={() => setActiveTab('backtest')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 text-left ${
            activeTab === 'backtest' ? 'text-emerald-400 font-semibold' : ''
          }`}
        >
          Backtest & PnL
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 text-left ${
            activeTab === 'code' ? 'text-emerald-400 font-semibold' : ''
          }`}
        >
          Kaggle Python Script
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onQuickExport}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Pipeline Script</span>
        </button>
      </div>
    </header>
  );
};

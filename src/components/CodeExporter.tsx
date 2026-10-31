import React, { useState } from 'react';
import { Copy, Check, Download, Terminal, Cpu, HardDrive, ExternalLink, Sparkles } from 'lucide-react';
import { TFT_PYTHON_TRAINING_SCRIPT } from '../data/tftPythonScript';
import { TFT_JUPYTER_NOTEBOOK_JSON } from '../data/tftNotebook';

export const CodeExporter: React.FC = () => {
  const [hasCopied, setHasCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'script' | 'kaggle' | 'colab' | 'requirements'>('script');

  const handleCopy = () => {
    navigator.clipboard.writeText(TFT_PYTHON_TRAINING_SCRIPT);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([TFT_PYTHON_TRAINING_SCRIPT], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'train_tft_football.py';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadNotebook = () => {
    const blob = new Blob([JSON.stringify(TFT_JUPYTER_NOTEBOOK_JSON, null, 2)], { type: 'application/x-ipynb+json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'TFT_Football_Training_Pipeline.ipynb';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <Terminal className="w-4 h-4" />
              <span>READY-TO-USE PYTHON PIPELINE · KAGGLE & COLAB</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Production PyTorch-Forecasting TFT Script
            </h2>
            <p className="text-xs text-slate-400">
              Download or copy the standalone script to train the model on Kaggle with an NVIDIA T4 GPU in 45–90 minutes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer shadow-sm"
            >
              {hasCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{hasCopied ? 'Copied Code!' : 'Copy Code'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg transition-colors cursor-pointer border border-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .py</span>
            </button>
            <button
              onClick={handleDownloadNotebook}
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-purple-300 bg-purple-950/40 hover:bg-purple-900/50 rounded-lg transition-colors cursor-pointer border border-purple-800/60"
            >
              <Download className="w-3.5 h-3.5 text-purple-400" />
              <span>Download .ipynb</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs font-medium w-fit">
          <button
            onClick={() => setActiveTab('script')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'script' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            train_tft_football.py
          </button>
          <button
            onClick={() => setActiveTab('kaggle')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'kaggle' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Kaggle Instructions
          </button>
          <button
            onClick={() => setActiveTab('colab')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'colab' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Google Colab Setup
          </button>
          <button
            onClick={() => setActiveTab('requirements')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'requirements' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            requirements.txt
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'script' && (
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 relative space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-slate-800">
            <span>train_tft_football.py (PyTorch-Forecasting + PyTorch-Lightning)</span>
            <span className="text-emerald-400">Lines: 215 · UTF-8</span>
          </div>
          <pre className="p-4 bg-slate-900/70 rounded-lg overflow-x-auto text-xs font-mono text-slate-200 leading-relaxed max-h-[580px] scrollbar-thin">
            <code>{TFT_PYTHON_TRAINING_SCRIPT}</code>
          </pre>
        </div>
      )}

      {activeTab === 'kaggle' && (
        <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-800 space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">How to Run on Kaggle (NVIDIA T4 GPU)</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Kaggle provides 30 hours of free weekly NVIDIA T4 GPU computing, which is ideal for the 45–90 minute training runtime of the TFT on 475k match rows.
            </p>
          </div>

          <div className="space-y-4 text-xs font-mono">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="text-emerald-400 font-bold">Step 1: Create a Kaggle Notebook</div>
              <p className="text-slate-300 font-sans">
                Open Kaggle and click <strong>New Notebook</strong>. Under <strong>Settings</strong> on the right sidebar, switch the <strong>Accelerator</strong> to <strong>GPU T4 x2</strong>.
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="text-emerald-400 font-bold">Step 2: Install PyTorch-Forecasting</div>
              <pre className="p-3 bg-slate-900 rounded text-slate-200">
                <code>!pip install pytorch-forecasting pytorch-lightning optuna</code>
              </pre>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="text-emerald-400 font-bold">Step 3: Mount the Club Football Dataset</div>
              <pre className="p-3 bg-slate-900 rounded text-slate-200">
                <code># Add Dataset from Kaggle: "Club Football Match Data (2000-2026/27)"
# Input path will be: /kaggle/input/club-football-match-data/club_football_matches.csv</code>
              </pre>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="text-emerald-400 font-bold">Step 4: Execute Autonomous Training & Saving</div>
              <pre className="p-3 bg-slate-900 rounded text-slate-200">
                <code>!python train_tft_football.py \
  --dataset /kaggle/input/club-football-match-data/club_football_matches.csv \
  --lookback 15 \
  --output_dir /kaggle/working/tft_output</code>
              </pre>
              <p className="text-slate-400 font-sans text-[11px]">
                Model weights (`tft_football_best.ckpt`) and feature importances (`feature_importance.json`) will be written directly to `/kaggle/working/`.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'colab' && (
        <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-800 space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">How to Run on Google Colab</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Colab provides free T4 GPUs. You can mount your Google Drive or download the dataset directly via Kaggle API.
            </p>
          </div>

          <div className="space-y-4 text-xs font-mono">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="text-emerald-400 font-bold">1. Connect GPU Runtime</div>
              <p className="text-slate-300 font-sans">
                Go to <strong>Runtime &gt; Change runtime type &gt; Hardware accelerator: T4 GPU</strong>.
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="text-emerald-400 font-bold">2. Quick Installation Cell</div>
              <pre className="p-3 bg-slate-900 rounded text-slate-200">
                <code>!pip install -q pytorch-forecasting pytorch-lightning pandas numpy torch</code>
              </pre>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="text-emerald-400 font-bold">3. Run the Script</div>
              <pre className="p-3 bg-slate-900 rounded text-slate-200">
                <code># Upload train_tft_football.py and run:
!python train_tft_football.py --dataset ./club_football_matches.csv --lookback 15</code>
              </pre>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'requirements' && (
        <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Python Dependencies (requirements.txt)</h3>
            <button
              onClick={() => {
                const reqs = `torch>=2.1.0\npytorch-lightning>=2.1.0\npytorch-forecasting>=1.0.0\npandas>=2.1.0\nnumpy>=1.24.0\nscikit-learn>=1.3.0\ntensorboard>=2.14.0\noptuna>=3.4.0\n`;
                navigator.clipboard.writeText(reqs);
                alert('Copied requirements.txt to clipboard!');
              }}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-mono cursor-pointer"
            >
              Copy requirements.txt
            </button>
          </div>

          <pre className="p-4 bg-slate-950 rounded-lg text-xs font-mono text-slate-200 leading-relaxed border border-slate-800">
            <code>{`torch>=2.1.0
pytorch-lightning>=2.1.0
pytorch-forecasting>=1.0.0
pandas>=2.1.0
numpy>=1.24.0
scikit-learn>=1.3.0
tensorboard>=2.14.0
optuna>=3.4.0`}</code>
          </pre>
        </div>
      )}
    </div>
  );
};

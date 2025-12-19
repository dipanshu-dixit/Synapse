'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Key, Github, Info, BookOpen, HelpCircle, Download, History, RotateCcw, User, Settings as SettingsIcon } from 'lucide-react';

interface AnalysisEntry {
  timestamp: string;
  scenario: string;
  analysis: {
    empathy: number;
    honesty: number;
    wisdom: number;
  };
}

interface AnalysisResult {
  empathy: number;
  honesty: number;
  wisdom: number;
  verdict: string;
}

export default function Settings({ apiKey, history, currentAnalysis, onClose, onApiKeyChange, showScoreExplanations, onShowScoreExplanationsChange, apiProvider, onApiProviderChange }: {
  apiKey: string;
  history: AnalysisEntry[];
  currentAnalysis: AnalysisResult | null;
  onClose: () => void;
  onApiKeyChange: (key: string) => void;
  showScoreExplanations: boolean;
  onShowScoreExplanationsChange: (show: boolean) => void;
  apiProvider: string;
  onApiProviderChange: (provider: string) => void;
}) {
  const [keys, setKeys] = useState({
    openrouter: '',
    together: '',
    groq: ''
  });
  const [saved, setSaved] = useState(false);
  const [testingKey, setTestingKey] = useState(false);
  const [unsavedKey, setUnsavedKey] = useState(false);
  const [userName, setUserName] = useState('');
  const [userDetails, setUserDetails] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const openrouterKey = localStorage.getItem('openrouter_key') || '';
    const togetherKey = localStorage.getItem('together_key') || '';
    const groqKey = localStorage.getItem('groq_key') || '';
    setKeys({
      openrouter: openrouterKey,
      together: togetherKey,
      groq: groqKey
    });

    const name = localStorage.getItem('synapse_user_name') || '';
    const details = localStorage.getItem('synapse_user_details') || '';
    setUserName(name);
    setUserDetails(details);
  }, []);

  const handleExport = () => {
    const data = { history, currentAnalysis };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'synapse-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveProfile = () => {
    localStorage.setItem('synapse_user_name', userName);
    localStorage.setItem('synapse_user_details', userDetails);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      localStorage.removeItem('synapse_history');
      localStorage.removeItem('openrouter_key');
      localStorage.removeItem('together_key');
      localStorage.removeItem('groq_key');
      localStorage.removeItem('synapse_user_name');
      localStorage.removeItem('synapse_user_details');
      setKeys({
        openrouter: '',
        together: '',
        groq: ''
      });
      setUserName('');
      setUserDetails('');
      setSaved(false);
      // Reload page or reset state
      window.location.reload();
    }
  };

  const handleSave = (provider: string, newKey: string) => {
    const keyName = `${provider}_key`;
    localStorage.setItem(keyName, newKey);
    if (provider === apiProvider) {
      onApiKeyChange(newKey);
    }
    setSaved(true);
    setUnsavedKey(false);
    setTimeout(() => setSaved(false), 2000);
  };

  const testKey = async () => {
    const currentKey = keys[apiProvider as keyof typeof keys];
    if (!currentKey.trim()) return;
    setTestingKey(true);
    try {
      const response = await fetch('/api/question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: currentKey, provider: apiProvider })
      });
      const data = await response.json();
      if (response.ok && data.question) {
        alert('API Key is valid! Key saved successfully.');
        handleSave(apiProvider, currentKey);
      } else {
        const errorMessage = data.error || 'Unknown error';
        if (response.status === 429) {
          alert(`Usage limit reached: ${errorMessage}`);
        } else {
          alert(`API Key is invalid: ${errorMessage}. Please check and try again.`);
        }
      }
    } catch (e) {
      alert('Failed to test API key. Please check your internet connection and try again.');
    } finally {
      setTestingKey(false);
    }
  };

  const handleClose = () => {
    if (unsavedKey) {
      const confirmSave = confirm('You have unsaved API key changes. Do you want to test and save the key before closing?');
      if (confirmSave) {
        testKey();
        return;
      }
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-xl"
        onClick={handleClose}
      />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative w-full max-w-[500px] glass-panel rounded-[32px] p-8 shadow-2xl z-4 max-h-[80vh] overflow-y-auto overflow-x-hidden"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-white">Settings</h2>
          <button onClick={handleClose} className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition border border-white/20">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* API Keys Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Key size={16} /> API Keys
            </h3>
            
            <div className="space-y-3">
              <label className="flex items-center gap-2 label-text">
                OpenRouter API Key
              </label>
              <input 
                type="password"
                value={keys.openrouter}
                onChange={(e) => {
                  setKeys(prev => ({ ...prev, openrouter: e.target.value }));
                  setUnsavedKey(true);
                }}
                placeholder="sk-or-v1-..."
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-white/30 outline-none transition placeholder:text-white/40"
                autoComplete="off"
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 label-text">
                Together AI API Key
              </label>
              <input 
                type="password"
                value={keys.together}
                onChange={(e) => {
                  setKeys(prev => ({ ...prev, together: e.target.value }));
                  setUnsavedKey(true);
                }}
                placeholder="..."
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-white/30 outline-none transition placeholder:text-white/40"
                autoComplete="off"
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 label-text">
                Groq API Key
              </label>
              <input 
                type="password"
                value={keys.groq}
                onChange={(e) => {
                  setKeys(prev => ({ ...prev, groq: e.target.value }));
                  setUnsavedKey(true);
                }}
                placeholder="gsk_..."
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-white/30 outline-none transition placeholder:text-white/40"
                autoComplete="off"
              />
            </div>

            <div className="flex gap-2">
              <button 
                onClick={testKey} 
                disabled={testingKey || !keys[apiProvider as keyof typeof keys].trim()}
                className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm rounded-xl transition"
              >
                {testingKey ? 'Testing...' : `Test ${apiProvider.charAt(0).toUpperCase() + apiProvider.slice(1)} Key`}
              </button>
              <button 
                onClick={() => handleSave(apiProvider, keys[apiProvider as keyof typeof keys])}
                disabled={!keys[apiProvider as keyof typeof keys].trim()}
                className="px-4 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-cyan-300 text-sm rounded-xl transition border border-cyan-500/30"
              >
                Save All
              </button>
            </div>
            <p className="text-[10px] text-zinc-600">
              API keys are stored locally on your device. Get keys from each provider&apos;s website.
            </p>
            {saved && <p className="text-[10px] text-green-400 mt-1">Settings saved successfully!</p>}
          </div>

          <div className="space-y-3 border-t border-white/5 pt-4">
            <label className="flex items-center gap-2 label-text">
              <SettingsIcon size={14} /> AI Provider
            </label>
            <select
              value={apiProvider}
              onChange={(e) => {
                onApiProviderChange(e.target.value);
                localStorage.setItem('synapse_api_provider', e.target.value);
              }}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-white/30 outline-none transition"
            >
              <option value="openrouter">OpenRouter (Recommended)</option>
              <option value="together">Together AI</option>
              <option value="groq">Groq</option>
            </select>
            <p className="text-[10px] text-zinc-600">
              Choose your preferred AI provider. All providers offer free models with automatic fallback.
            </p>
          </div>

          <div className="space-y-3 border-t border-white/5 pt-4">
            <label className="flex items-center gap-2 label-text">
              <User size={14} /> Display Name
            </label>
            <input 
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name (optional)"
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-white/30 outline-none transition placeholder:text-white/40"
            />
            <label className="flex items-center gap-2 label-text">
              <Info size={14} /> About You
            </label>
            <textarea 
              value={userDetails}
              onChange={(e) => setUserDetails(e.target.value)}
              placeholder="Share anonymous details about yourself (age, profession, etc.)"
              rows={3}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-white/30 outline-none transition resize-none placeholder:text-white/40"
            />
            <button onClick={handleSaveProfile} className="w-full bg-white/10 hover:bg-white/20 text-white text-sm rounded-xl py-2 transition">
              Save Profile
            </button>
          </div>

          <div className="space-y-4">
            <div className="border-t border-white/5 pt-4">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <SettingsIcon size={16} /> Preferences
              </h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400">Enable animations</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400">Auto-save responses</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400">Show score explanations</span>
                  <input 
                    type="checkbox" 
                    checked={showScoreExplanations}
                    onChange={(e) => {
                      onShowScoreExplanationsChange(e.target.checked);
                      localStorage.setItem('synapse_show_score_explanations', JSON.stringify(e.target.checked));
                    }}
                    className="rounded" 
                  />
                </label>
              </div>
            </div>
            <div className="border-t border-white/5 pt-4">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Info size={16} /> About Synapse
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                SYNAPSE is a psychological analysis tool that quantifies your humanity through AI-powered moral dilemmas. 
                It measures Empathy, Honesty, and Wisdom without sugar-coating the results.
              </p>
            </div>

            <div className="border-t border-white/5 pt-4">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <HelpCircle size={16} /> How It Works
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Answer moral dilemmas honestly. Our AI analyzes your responses against psychological benchmarks, 
                providing scores and a brutal verdict about your character traits.
              </p>
            </div>

            <div className="border-t border-white/5 pt-4">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <BookOpen size={16} /> Documentation
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Learn more about the psychological metrics, methodology, and research behind SYNAPSE.
              </p>
            </div>

            <div className="border-t border-white/5 pt-4">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Download size={16} /> Export Data
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Download your analysis results and history as JSON for personal records.
              </p>
              {!apiKey && (
                <p className="text-xs text-amber-400 mt-1">Requires API key to export analysis data.</p>
              )}
              <button 
                onClick={handleExport} 
                disabled={!apiKey}
                className={`mt-2 px-4 py-2 text-xs rounded transition ${
                  apiKey 
                    ? 'bg-white/10 hover:bg-white/20 text-white' 
                    : 'bg-zinc-600/20 text-zinc-500 cursor-not-allowed'
                }`}
              >
                Export Results
              </button>
            </div>

            <div className="border-t border-white/5 pt-4">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <History size={16} /> Analysis History
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                View your past psychological analyses and track your growth over time.
              </p>
              {!apiKey && (
                <p className="text-xs text-amber-400 mt-1">Requires API key to view analysis history.</p>
              )}
              <button 
                onClick={() => setShowHistory(!showHistory)} 
                disabled={!apiKey}
                className={`mt-2 px-4 py-2 text-xs rounded transition ${
                  apiKey 
                    ? 'bg-white/10 hover:bg-white/20 text-white' 
                    : 'bg-zinc-600/20 text-zinc-500 cursor-not-allowed'
                }`}
              >
                {showHistory ? 'Hide History' : 'View History'}
              </button>

              {showHistory && apiKey && (
                <div className="mt-4 space-y-3 max-h-60 overflow-y-auto">
                  {history.length === 0 ? (
                    <p className="text-xs text-zinc-500">No analysis history yet.</p>
                  ) : (
                    history.map((entry: AnalysisEntry, index: number) => (
                      <div key={index} className="bg-white/5 rounded-lg p-3">
                        <p className="text-xs text-zinc-400 mb-1">
                          {new Date(entry.timestamp).toLocaleString()}
                        </p>
                        <p className="text-xs text-white/80 mb-2 line-clamp-2">
                          &ldquo;{entry.scenario}&rdquo;
                        </p>
                        <div className="flex gap-4 text-xs">
                          <span className="text-blue-400">E: {entry.analysis.empathy}</span>
                          <span className="text-green-400">H: {entry.analysis.honesty}</span>
                          <span className="text-purple-400">W: {entry.analysis.wisdom}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="border-t border-white/5 pt-4">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <RotateCcw size={16} /> Reset Progress
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Clear all stored data and start fresh. This cannot be undone.
              </p>
              <button onClick={handleReset} className="mt-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs rounded transition">
                Reset All Data
              </button>
            </div>

            <div className="border-t border-white/5 pt-4">
              <h3 className="text-sm font-semibold text-white mb-3">Support & Feedback</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                Have suggestions or found a bug? We&apos;d love to hear from you.
              </p>
              <div className="flex gap-2">
                <a href="https://github.com/dipanshu-dixit/Synapse" target="_blank" rel="noopener noreferrer" className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-xs rounded transition">
                  GitHub Repo
                </a>
                <button 
                  onClick={() => window.location.href = 'mailto:dipanshudixit206@gmail.com?subject=SYNAPSE%20Feedback%20-%20v1.0.1&body=Hi%20Dipanshu,%0D%0A%0D%0AI%27m%20writing%20to%20provide%20feedback%20about%20SYNAPSE%20(v1.0.1).%0D%0A%0D%0AGitHub%20Repository:%20https://github.com/dipanshu-dixit/Synapse%0D%0A%0D%0AMy%20feedback:%0D%0A%0D%0A%0D%0A%0D%0ABest%20regards'}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-xs rounded transition"
                >
                  Send Feedback
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-4 mt-6 text-center">
            <p className="text-xs text-zinc-500">
              SYNAPSE v1.0.1 • Open Source
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
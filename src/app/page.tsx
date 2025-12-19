'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings as SettingsIcon, RefreshCw, ArrowRight, ArrowLeft } from 'lucide-react';
import Settings from './components/Settings';

const SPICY_SCENARIOS = [
  "You find out your sibling's partner is cheating. Telling them destroys their happiness; staying quiet makes you complicit. What's your choice?",
  "Your boss offers you a raise if you fire your closest work friend. The friend has been underperforming. Do you take it?",
  "You witness your neighbor's teenager stealing food. Reporting them protects the store but ruins a kid's record. What do you do?",
  "You discover your partner's secret bank account with $50,000. Confronting them might end the relationship. Do you say something?",
  "A homeless person asks you for money, but you suspect they're using it for drugs. Give it anyway or walk away?",
  "Your elderly parent wants to drive despite failing eyesight. Do you take away their keys or let them risk it?",
  "You find $10,000 in cash on the street. Keep it or try to find the owner?",
  "Your child comes home with a failing grade but claims the teacher hates them. Believe the child or the teacher?",
  "A colleague takes credit for your work. Confront them privately or go to HR?",
  "You see someone shoplifting baby formula. They're clearly struggling financially. Report them or let it go?",
  "Your best friend confesses to cheating on their spouse. Keep their secret or tell the spouse?",
  "You inherit a fortune but must give half to a charity you hate. Accept the inheritance or refuse it?",
  "A stranger offers you a ride home in a storm. Accept despite the risks or wait for public transport?",
  "Your pet is suffering from a terminal illness. Euthanize them or let nature take its course?",
  "You find out your boss is embezzling money. Report them anonymously or stay out of it?",
  "A friend borrows money and never pays back. Cut ties or keep lending?",
  "You witness animal cruelty but reporting might put you in danger. Speak up or stay silent?",
  "Your partner wants an open relationship. Agree to save the relationship or end it?",
  "You see a coworker being harassed. Intervene directly or report it discreetly?",
  "Your doctor gives you a terminal diagnosis but offers experimental treatment. Take the risk or accept fate?",
  // Add more unique questions...
];

interface AnalysisResult {
  empathy: number;
  honesty: number;
  wisdom: number;
  verdict: string;
}

interface HistoryEntry {
  timestamp: string;
  scenario: string;
  analysis: AnalysisResult;
}

export default function Home() {
  const [response, setResponse] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [promptIndex, setPromptIndex] = useState(0);
  const [apiKey, setApiKey] = useState('');
  const [apiProvider, setApiProvider] = useState('openrouter');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [currentScenario, setCurrentScenario] = useState(SPICY_SCENARIOS[0]);
  const [showScoreExplanations, setShowScoreExplanations] = useState(false);
  const [loadingNext, setLoadingNext] = useState(false);
  const [questionHistory, setQuestionHistory] = useState<string[]>([SPICY_SCENARIOS[0]]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [creativeLoadingText, setCreativeLoadingText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  const CREATIVE_LOADING_MESSAGES = [
    "🧠 AI is pondering the depths of human morality...",
    "📚 Crafting a dilemma that will test your character...",
    "🎭 Weaving a scenario from the threads of ethics...",
    "⚖️ Balancing right and wrong in this moral equation...",
    "🔍 Searching for the perfect psychological puzzle...",
    "💭 AI is thinking about what makes you human...",
    "🎪 Preparing a thought experiment just for you...",
    "🌟 Generating a scenario that will reveal your true self...",
    "🕵️ Investigating the mysteries of moral decision-making...",
    "🎨 Painting a picture of ethical complexity...",
    "📖 Writing the next chapter in your moral journey...",
    "🧪 Mixing ingredients for the perfect dilemma...",
    "🎯 Aiming for a scenario that hits the heart...",
    "🌈 Exploring the spectrum of human choices...",
    "🎪 Setting up the big top for your moral circus..."
  ];

  const handleProviderChange = (provider: string) => {
    setApiProvider(provider);
    // Load the API key for the new provider
    const key = localStorage.getItem(`${provider}_key`) || '';
    setApiKey(key);
  };

  const getRandomLoadingMessage = () => {
    return CREATIVE_LOADING_MESSAGES[Math.floor(Math.random() * CREATIVE_LOADING_MESSAGES.length)];
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setCurrentScenario(questionHistory[currentQuestionIndex - 1]);
      setResponse(''); // Clear response when changing questions
      setAnalysis(null); // Clear analysis when changing questions
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questionHistory.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setCurrentScenario(questionHistory[currentQuestionIndex + 1]);
      setResponse(''); // Clear response when changing questions
      setAnalysis(null); // Clear analysis when changing questions
    } else {
      // Load new question
      handleNext();
    }
  };

  useEffect(() => {
    // Load provider first
    const provider = localStorage.getItem('synapse_api_provider') || 'openrouter';
    setApiProvider(provider);

    // Load API key for the current provider
    const key = localStorage.getItem(`${provider}_key`) || '';
    setApiKey(key);

    const savedHistory = localStorage.getItem('synapse_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    // Load preferences
    const scoreExplanations = localStorage.getItem('synapse_show_score_explanations');
    if (scoreExplanations) setShowScoreExplanations(JSON.parse(scoreExplanations));

    // Set initial scenario
    const initializeScenario = async () => {
      if (key) {
        try {
          const res = await fetch('/api/question', {
            method: 'POST',
            body: JSON.stringify({ apiKey: key, provider: provider })
          });
          const data = await res.json();
          if (data.question) {
            setCurrentScenario(data.question);
          } else {
            setCurrentScenario(SPICY_SCENARIOS[Math.floor(Math.random() * SPICY_SCENARIOS.length)]);
          }
        } catch (e) {
          setCurrentScenario(SPICY_SCENARIOS[Math.floor(Math.random() * SPICY_SCENARIOS.length)]);
        }
      } else {
        setCurrentScenario(SPICY_SCENARIOS[Math.floor(Math.random() * SPICY_SCENARIOS.length)]);
      }
    };
    initializeScenario();
  }, []);

  const handleAnalyze = async () => {
    if (!apiKey) {
      setShowSettings(true);
      return;
    }
    
    setLoading(true);
    setAnalyzing(true); // Prevent question changes during analysis
    
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: JSON.stringify({
          scenario: currentScenario,
          userResponse: response,
          apiKey: apiKey,
          provider: apiProvider
        })
      });
      const data = await res.json();
      if (res.status === 429) {
        alert(`Usage limit reached: ${data.error}\n\nPlease wait a few minutes before trying again, or consider upgrading to a paid plan for unlimited access.`);
      } else if (data.error === "API_KEY_MISSING") {
        setShowSettings(true);
      } else if (data.error && typeof data.error === 'string') {
        alert(`API Error: ${data.error}\n\nFree models have usage limits. Consider upgrading to a paid plan for unlimited access.`);
      } else {
        setAnalysis(data);
        const newEntry = {
          scenario: currentScenario,
          response: response,
          analysis: data,
          timestamp: new Date().toISOString()
        };
        const updatedHistory = [newEntry, ...history].slice(0, 50); // Keep last 50
        setHistory(updatedHistory);
        localStorage.setItem('synapse_history', JSON.stringify(updatedHistory));
      }
    } catch (e) {
      alert("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
      setAnalyzing(false); // Allow question changes again
    }
  };

  const handleNext = async () => {
    setLoadingNext(true);
    setCreativeLoadingText(getRandomLoadingMessage());
    setAnalysis(null);
    setResponse('');
    setCurrentScenario(''); // Clear immediately to hide old question
    
    if (apiKey) {
      try {
        const res = await fetch('/api/question', {
          method: 'POST',
          body: JSON.stringify({ apiKey, provider: apiProvider })
        });
        const data = await res.json();
        if (res.status === 429) {
          alert(`Usage limit reached: ${data.error}\n\nFalling back to predefined scenarios.`);
          // Fallback to hardcoded
          setPromptIndex((prev) => (prev + 1) % SPICY_SCENARIOS.length);
          const newQuestion = SPICY_SCENARIOS[promptIndex];
          setCurrentScenario(newQuestion);
          setQuestionHistory(prev => [...prev, newQuestion]);
          setCurrentQuestionIndex(questionHistory.length);
        } else if (data.question) {
          setCurrentScenario(data.question);
          setQuestionHistory(prev => [...prev, data.question]);
          setCurrentQuestionIndex(questionHistory.length);
        } else {
          // Fallback to hardcoded
          setPromptIndex((prev) => (prev + 1) % SPICY_SCENARIOS.length);
          const newQuestion = SPICY_SCENARIOS[promptIndex];
          setCurrentScenario(newQuestion);
          setQuestionHistory(prev => [...prev, newQuestion]);
          setCurrentQuestionIndex(questionHistory.length);
        }
      } catch (e) {
        // Fallback
        setPromptIndex((prev) => (prev + 1) % SPICY_SCENARIOS.length);
        const newQuestion = SPICY_SCENARIOS[promptIndex];
        setCurrentScenario(newQuestion);
        setQuestionHistory(prev => [...prev, newQuestion]);
        setCurrentQuestionIndex(questionHistory.length);
      }
    } else {
      // No API key, use fallback
      setPromptIndex((prev) => (prev + 1) % SPICY_SCENARIOS.length);
      const newQuestion = SPICY_SCENARIOS[promptIndex];
      setCurrentScenario(newQuestion);
      setQuestionHistory(prev => [...prev, newQuestion]);
      setCurrentQuestionIndex(questionHistory.length);
    }
    setLoadingNext(false);
    setCreativeLoadingText('');
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      
      {/* Branding Header */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-8 left-8 z-50 flex items-center gap-3"
      >
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        <span className="text-sm font-bold tracking-[0.3em] text-white">SYNAPSE</span>
      </motion.div>

      {/* Aura Background */}
      <motion.div 
        animate={{ x: [0, 100, -50, 0], y: [0, -80, 60, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ filter: 'blur(120px)' }}
      >
        <div className="w-[800px] h-[800px] bg-[rgba(255,255,255,0.03)] rounded-full" />
      </motion.div>

      {/* Main Centered Content */}
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {!analysis ? (
            <motion.div 
              layoutId="main-content"
              key="input"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
              transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 1 }}
              className="space-y-12"
            >
              <h1 className="text-3xl md:text-4xl font-medium text-center leading-tight text-white/90">
                {loadingNext && !currentScenario ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center gap-4"
                  >
                    <RefreshCw className="animate-spin text-4xl" size={40} />
                    <p className="text-lg italic text-center max-w-md leading-relaxed">
                      {creativeLoadingText}
                    </p>
                  </motion.div>
                ) : (
                  <>&ldquo;{currentScenario}&rdquo;</>
                )}
              </h1>

              {/* Question Navigation */}
              {!loadingNext && !analyzing && questionHistory.length > 1 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-4 mt-6"
                >
                  <button
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm rounded-full border border-white/20 transition-all disabled:hover:bg-white/10"
                  >
                    <ArrowLeft size={14} />
                    Previous
                  </button>
                  
                  <span className="text-xs text-zinc-400">
                    {currentQuestionIndex + 1} of {questionHistory.length}
                  </span>
                  
                  <button
                    onClick={handleNextQuestion}
                    disabled={analyzing}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm rounded-full border border-white/20 transition-all disabled:hover:bg-white/10"
                  >
                    {currentQuestionIndex === questionHistory.length - 1 ? (
                      <>
                        <RefreshCw size={14} />
                        New
                      </>
                    ) : (
                      <>
                        Next
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </motion.div>
              )}

              <div className="p-1 rounded-[32px] overflow-hidden mt-8">
                <textarea 
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Type your raw, unfiltered thoughts..."
                  disabled={loadingNext}
                  className="spatial-input glass-panel w-full h-48 p-6 bg-transparent text-lg placeholder-zinc-600 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div className="flex justify-center">
                <button 
                  onClick={handleAnalyze}
                  disabled={loading || !response || loadingNext || analyzing}
                  className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="animate-spin" size={18} /> Analyzing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Analyze Intent <ArrowRight size={18} />
                    </span>
                  )}
                </button>
              </div>
            </motion.div>
          ) : (
            /* Analysis Screen (Mockup Data) */
            <motion.div 
              layoutId="main-content"
              key="result"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="space-y-12"
            >
               <div className="grid grid-cols-3 gap-4">
                 {['Empathy', 'Honesty', 'Wisdom'].map((trait, i) => (
                   <motion.div 
                     key={trait}
                     initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30, delay: i * 0.1 }}
                     className="glass-panel p-8 rounded-[24px] flex flex-col items-center justify-center relative overflow-hidden"
                   >
                     <span className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2">{trait}</span>
                     <span className="text-4xl font-light text-white">{analysis[trait.toLowerCase() as keyof AnalysisResult]}</span>
                     <motion.div 
                       initial={{ width: 0 }} animate={{ width: `${analysis[trait.toLowerCase() as keyof AnalysisResult]}%` }}
                       transition={{ type: 'spring', stiffness: 300, damping: 30, delay: (i * 0.1) + 0.3 }}
                       className="absolute bottom-0 left-0 h-0.5 bg-cyan-400 shadow-[0_0_10px_cyan,0_0_20px_cyan,0_0_30px_cyan]"
                     />
                     {showScoreExplanations && (
                       <motion.div 
                         initial={{ opacity: 0, y: 10 }} 
                         animate={{ opacity: 1, y: 0 }} 
                         transition={{ delay: (i * 0.1) + 0.5 }}
                         className="mt-4 text-center"
                       >
                         <p className="text-xs text-zinc-400 leading-tight">
                           {trait === 'Empathy' && `${analysis.empathy >= 70 ? 'High empathy indicates strong emotional intelligence and concern for others.' : analysis.empathy >= 40 ? 'Moderate empathy shows balanced emotional awareness.' : 'Low empathy suggests focus on logic over emotional considerations.'}`}
                           {trait === 'Honesty' && `${analysis.honesty >= 70 ? 'High honesty reflects strong moral integrity and truthfulness.' : analysis.honesty >= 40 ? 'Moderate honesty indicates situational ethical reasoning.' : 'Low honesty suggests pragmatic or self-serving decision making.'}`}
                           {trait === 'Wisdom' && `${analysis.wisdom >= 70 ? 'High wisdom demonstrates mature judgment and long-term thinking.' : analysis.wisdom >= 40 ? 'Moderate wisdom shows developing judgment capabilities.' : 'Low wisdom indicates impulsive or short-term focused decisions.'}`}
                         </p>
                       </motion.div>
                     )}
                   </motion.div>
                 ))}
               </div>
               
               <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.5 }}
                 className="p-10 border-l-2 border-white/20 bg-white/5 rounded-r-[24px]"
               >
                  <h3 className="text-xs uppercase tracking-widest text-zinc-400 mb-4">The Verdict</h3>
                  <p className="text-3xl md:text-4xl italic font-['Playfair_Display'] text-white/90 leading-relaxed">
                    &ldquo;{analysis.verdict}&rdquo;
                  </p>
               </motion.div>

               <div className="flex justify-center">
                 <button 
                   onClick={handleNext}
                   disabled={loadingNext}
                   className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white flex items-center gap-2 text-sm uppercase tracking-widest transition-all rounded-full border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   {loadingNext ? (
                     <span className="flex items-center gap-2">
                       <RefreshCw className="animate-spin" size={14} />
                       Loading...
                     </span>
                   ) : (
                     <span className="flex items-center gap-2">
                       Next Challenge <ArrowRight size={14} />
                     </span>
                   )}
                 </button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>

      {/* Settings Button - Outside centered container */}
      <button 
        onClick={() => setShowSettings(true)}
        className="fixed top-8 right-8 z-[60] p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full hover:bg-white/10 transition-all hover:scale-105"
      >
        <SettingsIcon size={20} className="text-white/80" />
      </button>

      {/* Settings Overlay */}
      <AnimatePresence>
        {showSettings && (
          <Settings 
            apiKey={apiKey}
            history={history}
            currentAnalysis={analysis}
            onClose={() => setShowSettings(false)}
            onApiKeyChange={setApiKey}
            showScoreExplanations={showScoreExplanations}
            onShowScoreExplanationsChange={setShowScoreExplanations}
            apiProvider={apiProvider}
            onApiProviderChange={handleProviderChange}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
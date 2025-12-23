import React, { useState, useEffect, useMemo, useRef } from 'react';
import { InfoCard, ToggleSwitch } from './Shared';

// ============================================
// LEVEL 1: THE PREDICTION GAME
// ============================================
const PredictionGame = () => {
  const [guess, setGuess] = useState("");
  const [showResult, setShowResult] = useState(false);

  const context = "The cat sat on the";
  const predictions = [
    { word: "mat", prob: 0.65 },
    { word: "floor", prob: 0.15 },
    { word: "couch", prob: 0.10 },
    { word: "bed", prob: 0.05 },
    { word: "roof", prob: 0.02 },
  ];

  const handleGuess = () => {
    setShowResult(true);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-surface p-8 rounded-xl border border-border shadow-card flex flex-col items-center gap-6">
        <div className="text-2xl font-display text-primary text-center">
          "{context} <span className="border-b-2 border-warning min-w-[100px] inline-block text-center text-warning font-semibold">{guess || "___"}</span>"
        </div>

        <div className="flex gap-4 w-full max-w-md">
          <input 
            type="text" 
            value={guess}
            onChange={(e) => { setGuess(e.target.value); setShowResult(false); }}
            placeholder="What comes next?"
            className="flex-1 bg-depth text-primary px-4 py-3 rounded-lg border border-border focus:border-warning outline-none placeholder-tertiary"
          />
          <button 
            onClick={handleGuess}
            className="px-6 py-3 bg-op hover:bg-warning text-white font-bold rounded-lg shadow-lg transition-colors"
          >
            Predict
          </button>
        </div>

        {showResult && (
          <div className="w-full max-w-lg mt-4 space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-xs text-tertiary uppercase font-bold tracking-widest mb-2">Model Probabilities</div>
            {predictions.map((p) => {
              const isMatch = guess.toLowerCase().trim() === p.word;
              return (
                <div key={p.word} className="flex items-center gap-4">
                  <div className="w-16 text-right text-sm font-bold text-secondary">{p.word}</div>
                  <div className="flex-1 h-4 bg-depth rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${isMatch ? 'bg-success' : 'bg-active'}`} 
                      style={{ width: `${p.prob * 100}%` }}
                    />
                  </div>
                  <div className="w-12 text-xs font-mono text-tertiary">{(p.prob * 100).toFixed(0)}%</div>
                </div>
              );
            })}
            {!predictions.some(p => p.word === guess.toLowerCase().trim()) && guess && (
               <div className="text-center text-xs text-secondary mt-2">
                 Your guess "{guess}" is theoretically possible but has &lt;1% probability in the training data.
               </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// LEVEL 2: THE TOKENIZER
// ============================================
const TokenizerDemo = () => {
  const [text, setText] = useState("Unbelievable! The café served 3.14159 flavors.");
  
  // Simple heuristic tokenizer for visualization
  // In reality, this would use a BPE vocabulary
  const tokenize = (input: string) => {
    const tokens: { id: number, text: string, color: string }[] = [];
    let remaining = input;
    let idCounter = 1000;

    // Regex for basic token splitting (simulating BPE)
    // Matches: common words, suffixes, punctuation, numbers
    const patterns = [
      /^Un/i, /^believ/i, /^able/i, /^The/i, /^café/i, /^served/i, /^\d+/i, /^\./i, /^\w+/i, /^\s+/i, /^./
    ];

    const colors = [
      'bg-blue-500/10 text-blue-600 dark:text-blue-300 border-blue-500/20',
      'bg-purple-500/10 text-purple-600 dark:text-purple-300 border-purple-500/20', 
      'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20',
      'bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20',
      'bg-pink-500/10 text-pink-600 dark:text-pink-300 border-pink-500/20',
    ];

    while (remaining.length > 0) {
      let match = null;
      for (const p of patterns) {
        const m = remaining.match(p);
        if (m) {
          match = m[0];
          break;
        }
      }
      
      if (!match) match = remaining[0]; // Fallback char

      tokens.push({
        id: idCounter++,
        text: match,
        color: colors[tokens.length % colors.length]
      });
      remaining = remaining.slice(match.length);
    }
    return tokens;
  };

  const tokens = tokenize(text);

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-surface p-6 rounded-xl border border-border shadow-card">
        <label className="text-xs text-tertiary font-bold uppercase mb-2 block">Input Text</label>
        <textarea 
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full bg-depth text-primary p-4 rounded-lg border border-border focus:border-active outline-none font-mono text-sm h-24 resize-none"
        />

        <div className="mt-6">
          <div className="flex justify-between items-end mb-3">
            <div className="text-xs text-tertiary font-bold uppercase">Token Stream</div>
            <div className="text-xs font-mono text-secondary">
              {text.length} chars → {tokens.length} tokens (Ratio: {(text.length / Math.max(1, tokens.length)).toFixed(1)})
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 bg-depth p-4 rounded-xl border border-border min-h-[100px] content-start">
            {tokens.map((t, i) => (
              <div 
                key={i}
                className={`px-2 py-1 rounded border text-sm font-mono transition-transform hover:scale-105 cursor-default relative group ${t.color}`}
              >
                {t.text === ' ' ? '␣' : t.text}
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-surface text-primary text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10 border border-border shadow-sm">
                  ID: {t.id}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// LEVEL 3: EMBEDDING SPACE
// ============================================
const EmbeddingViz = () => {
  // Simplified 2D projections
  const words = [
    { text: 'king', x: 20, y: 20, type: 'royal' },
    { text: 'queen', x: 20, y: 80, type: 'royal' },
    { text: 'man', x: 80, y: 20, type: 'common' },
    { text: 'woman', x: 80, y: 80, type: 'common' },
    { text: 'prince', x: 30, y: 30, type: 'royal' },
    { text: 'princess', x: 30, y: 70, type: 'royal' },
    { text: 'boy', x: 70, y: 30, type: 'common' },
    { text: 'girl', x: 70, y: 70, type: 'common' },
  ];

  const [equation, setEquation] = useState<{result: {x:number, y:number} | null, label: string}>({ result: null, label: '' });

  const calculate = () => {
    // King - Man + Woman
    const king = words.find(w => w.text === 'king')!;
    const man = words.find(w => w.text === 'man')!;
    const woman = words.find(w => w.text === 'woman')!;
    
    // Vector arithmetic
    const resX = king.x - man.x + woman.x; // 20 - 80 + 80 = 20
    const resY = king.y - man.y + woman.y; // 20 - 20 + 80 = 80
    
    setEquation({ 
      result: { x: resX, y: resY }, 
      label: 'king - man + woman' 
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-surface p-6 rounded-xl border border-border shadow-card flex flex-col md:flex-row gap-8 items-center">
        
        <div className="relative w-64 h-64 bg-depth rounded-lg border border-border shadow-inner">
          <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(128,128,128,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(128,128,128,0.2)_1px,transparent_1px)] bg-[length:20px_20px]" />
          
          {/* Axis Labels */}
          <div className="absolute top-2 left-2 text-[9px] text-tertiary font-mono">Gender Axis ↓</div>
          <div className="absolute bottom-2 right-2 text-[9px] text-tertiary font-mono">Status Axis ←</div>

          {words.map((w, i) => (
            <div 
              key={i}
              className={`absolute flex flex-col items-center justify-center transition-all duration-500`}
              style={{ left: `${w.x}%`, top: `${w.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              <div className={`w-2 h-2 rounded-full ${w.type === 'royal' ? 'bg-amber-500' : 'bg-blue-500'}`} />
              <div className="text-xs text-secondary mt-1 font-mono">{w.text}</div>
            </div>
          ))}

          {/* Visualization of operation */}
          {equation.result && (
            <div 
              className="absolute w-4 h-4 border-2 border-emerald-400 rounded-full animate-ping"
              style={{ left: `${equation.result.x}%`, top: `${equation.result.y}%`, transform: 'translate(-50%, -50%)' }}
            />
          )}
        </div>

        <div className="flex flex-col gap-4 items-center md:items-start">
          <div className="bg-depth p-4 rounded-lg border border-border">
            <div className="text-xs text-tertiary uppercase font-bold mb-2">Vector Arithmetic</div>
            <div className="font-mono text-sm text-primary mb-4">
              <span className="text-warning">king</span> - <span className="text-active">man</span> + <span className="text-active">woman</span> = <span className="text-success font-bold">?</span>
            </div>
            <button 
              onClick={calculate}
              className="w-full px-4 py-2 bg-white dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 text-primary border border-border rounded text-sm font-bold shadow-sm"
            >
              Calculate Position
            </button>
          </div>
          <p className="text-sm text-secondary max-w-xs">
            Words are points in space. Semantic relationships are geometric distances and directions.
          </p>
        </div>

      </div>
    </div>
  );
};

// ============================================
// LEVEL 4: ATTENTION VISUALIZER
// ============================================
const AttentionViz = () => {
  const sentence = "The animal didn't cross the street because it was too tired".split(" ");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Simplified attention matrix (hardcoded for demo logic)
  const getAttention = (idx: number) => {
    if (idx === -1) return {};
    const word = sentence[idx].toLowerCase();
    const weights: Record<number, number> = {};
    
    if (word === "it") {
      weights[1] = 0.8; // animal
      weights[5] = 0.1; // street
    } else if (word === "tired") {
      weights[10] = 0.9; // it
      weights[1] = 0.5; // animal
    } else if (word === "cross") {
      weights[2] = 0.6; // didn't
      weights[5] = 0.4; // street
    }
    
    // Self-attention (always attends to self a bit)
    weights[idx] = 0.2;
    return weights;
  };

  const weights = hoveredIndex !== null ? getAttention(hoveredIndex) : {};

  return (
    <div className="bg-surface p-8 rounded-xl border border-border shadow-card">
      <div className="text-xs text-tertiary font-bold uppercase mb-6 text-center">
        Hover over a word to see its attention (what it "looks at")
      </div>
      
      <div className="flex flex-wrap gap-3 justify-center relative">
        {sentence.map((word, i) => {
          const weight = weights[i] || 0;
          const isSource = i === hoveredIndex;
          
          return (
            <div 
              key={i}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`
                relative px-3 py-2 rounded cursor-pointer transition-all duration-300 z-10
                ${isSource 
                  ? 'bg-op text-white font-bold scale-110 shadow-lg ring-2 ring-warning' 
                  : 'bg-depth text-secondary hover:bg-gray-200 dark:hover:bg-slate-700'
                }
              `}
              style={{
                // Visualize weight via opacity/border if another word is hovered
                opacity: hoveredIndex !== null && !isSource ? 0.3 + weight : 1,
                borderColor: weight > 0 ? '#10B981' : 'transparent',
                borderWidth: weight > 0 ? '2px' : '0px',
                transform: weight > 0.5 ? 'scale(1.05)' : 'scale(1)'
              }}
            >
              {word}
              
              {/* Attention Score Label */}
              {weight > 0 && !isSource && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-success text-white text-[9px] px-1 rounded font-bold">
                  {(weight * 100).toFixed(0)}%
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="h-8 mt-4 text-center text-sm text-secondary italic">
        {hoveredIndex !== null && sentence[hoveredIndex] === "it" && "Notice 'it' attends strongly to 'animal' because 'tired' applies to animals."}
        {hoveredIndex === null && "Attention allows the model to connect distant words to understand context."}
      </div>
    </div>
  );
};

// ============================================
// LEVEL 5: TEMPERATURE (ENTROPY)
// ============================================
const TemperatureDemo = () => {
  const [temp, setTemp] = useState(1.0);
  
  // Base logits for "The quick brown fox jumps over the ___"
  const logits = {
    "lazy": 10,
    "fence": 8,
    "dog": 9.5,
    "log": 5,
    "moon": 2
  };

  // Calculate Softmax with Temperature
  const entries = Object.entries(logits);
  const exps = entries.map(([word, val]) => ({ word, val: Math.exp(val / temp) }));
  const sum = exps.reduce((acc, curr) => acc + curr.val, 0);
  const probs = exps.map(item => ({ ...item, prob: item.val / sum }));

  // Sort by prob desc
  probs.sort((a, b) => b.prob - a.prob);

  return (
    <div className="flex flex-col gap-8 bg-surface p-6 rounded-xl border border-border shadow-card">
      <div className="flex justify-between items-center">
        <div className="text-sm font-bold text-primary">Prompt: "The quick brown fox jumps over the..."</div>
        <div className="flex items-center gap-4">
          <div className="text-xs font-bold text-tertiary uppercase">Temperature</div>
          <input 
            type="range" min="0.1" max="2.0" step="0.1" 
            value={temp} onChange={(e) => setTemp(parseFloat(e.target.value))}
            className="w-32 h-2 bg-depth rounded-lg appearance-none cursor-pointer accent-warning"
          />
          <div className="w-8 font-mono text-warning font-bold">{temp.toFixed(1)}</div>
        </div>
      </div>

      <div className="relative h-40 flex items-end gap-2 justify-center border-b border-border pb-2">
        {probs.map((p) => (
          <div key={p.word} className="flex flex-col items-center flex-1 max-w-[60px] group">
            <div className="text-xs text-primary mb-1 opacity-0 group-hover:opacity-100 transition-opacity">{(p.prob*100).toFixed(0)}%</div>
            <div 
              className="w-full bg-active rounded-t transition-all duration-300 hover:opacity-80"
              style={{ height: `${Math.max(2, p.prob * 140)}px` }}
            />
            <div className="text-[10px] text-tertiary mt-2 font-mono truncate w-full text-center">{p.word}</div>
          </div>
        ))}
      </div>

      <div className="text-center text-sm text-secondary">
        {temp < 0.5 && "Low Temp: Deterministic, repetitive, safe. (Greedy)"}
        {temp >= 0.5 && temp <= 1.2 && "Medium Temp: Balanced creativity and coherence."}
        {temp > 1.2 && "High Temp: Chaotic, creative, potentially random."}
      </div>
    </div>
  );
};

// ============================================
// LEVEL 6: SCALE SIMULATOR
// ============================================
const ScaleSimulator = () => {
  const [params, setParams] = useState(1); // Log scale 1 (1B) to 1000 (1T)
  
  // Power laws (simplified for demo)
  // Performance ~ Params^0.5
  // Cost ~ Params * Data
  
  const displayParams = params < 1000 ? `${params}B` : `${(params/1000).toFixed(1)}T`;
  const performance = Math.min(100, Math.log10(params) * 33 + 10);
  const cost = params * 10000; // Fake $ unit
  const hardware = Math.ceil(params / 10); // Fake GPU count

  return (
    <div className="bg-surface p-6 rounded-xl border border-border shadow-card flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <label className="text-xs text-tertiary font-bold uppercase flex justify-between">
          <span>Model Size (Parameters)</span>
          <span className="text-warning font-mono">{displayParams}</span>
        </label>
        <input 
          type="range" min="1" max="1000" step="10" 
          value={params} onChange={(e) => setParams(parseInt(e.target.value))}
          className="w-full h-2 bg-depth rounded-lg appearance-none cursor-pointer accent-active"
        />
        <div className="flex justify-between text-[10px] text-secondary font-mono">
          <span>GPT-2 (1.5B)</span>
          <span>GPT-3 (175B)</span>
          <span>GPT-4 (~1T+)</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-depth p-4 rounded-lg text-center border border-border">
          <div className="text-xs text-secondary mb-1">Performance</div>
          <div className="h-2 w-full bg-slate-300 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-success transition-all duration-300" style={{ width: `${performance}%` }} />
          </div>
          <div className="text-xs text-success mt-1 font-bold">{performance.toFixed(0)}/100 IQ</div>
        </div>

        <div className="bg-depth p-4 rounded-lg text-center border border-border">
          <div className="text-xs text-secondary mb-1">Training Cost</div>
          <div className="text-lg font-mono font-bold text-error">${(cost / 1000).toFixed(1)}M</div>
        </div>

        <div className="bg-depth p-4 rounded-lg text-center border border-border">
          <div className="text-xs text-secondary mb-1">Hardware</div>
          <div className="text-lg font-mono font-bold text-active">{hardware} <span className="text-xs text-blue-300">GPUs</span></div>
        </div>
      </div>
      
      <p className="text-xs text-center text-tertiary italic">
        Scaling follows power laws. Increasing parameters predictably improves performance, but cost grows linearly (or worse).
      </p>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
export const Pillar11: React.FC = () => {
  return (
    <div className="space-y-16 animate-in fade-in duration-500">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-2xl font-bold text-primary mb-4">Pillar 11: Large Language Models</h2>
        <p className="text-secondary text-lg leading-relaxed">
          The synthesis of all foundations. How <strong className="text-warning">Prediction</strong> becomes <strong className="text-success">Understanding</strong>.
        </p>
      </div>

      <InfoCard title="Level 1: The Prediction Engine" icon="🔮">
        <p>
          At its core, an LLM is a machine that predicts the next word. 
          Try to predict the next word yourself. You'll see that good prediction requires understanding context, grammar, and the world.
        </p>
      </InfoCard>

      <PredictionGame />

      <div className="w-full h-px bg-border" />

      <InfoCard title="Level 2: How Machines Read" icon="🔡">
        <p>
          Computers don't see words; they see <strong className="text-active">Tokens</strong>. 
          A token is a chunk of text—a word, part of a word, or punctuation.
        </p>
      </InfoCard>

      <TokenizerDemo />

      <div className="w-full h-px bg-border" />

      <InfoCard title="Level 3: Meaning is Geometry" icon="📐">
        <p>
          Words are converted into numbers (Embeddings) which represent points in a high-dimensional space.
          Similar concepts are close together. We can even do math with meaning: <span className="font-mono text-xs bg-depth px-1 rounded text-primary">King - Man + Woman = Queen</span>.
        </p>
      </InfoCard>

      <EmbeddingViz />

      <div className="w-full h-px bg-border" />

      <InfoCard title="Level 4: Attention Mechanism" icon="👀">
        <p>
          How does the model connect "it" to "animal"? <strong className="text-warning">Attention</strong> allows the model to look back at previous words to resolve context.
        </p>
      </InfoCard>

      <AttentionViz />

      <div className="w-full h-px bg-border" />

      <InfoCard title="Level 5: Controlling Creativity" icon="🌡️">
        <p>
          <strong className="text-error">Temperature</strong> controls the entropy of the output. 
          Low temperature makes the model precise and deterministic. High temperature makes it creative and chaotic.
        </p>
      </InfoCard>

      <TemperatureDemo />

      <div className="w-full h-px bg-border" />

      <InfoCard title="Level 6: The Laws of Scale" icon="📈">
        <p>
          Performance isn't random—it follows predictable <strong className="text-success">Scaling Laws</strong>. 
          More parameters and more data equal smarter models, at the cost of massive compute.
        </p>
      </InfoCard>

      <ScaleSimulator />
      
      <div className="bg-depth p-8 rounded-2xl border border-border text-center max-w-3xl mx-auto mt-12">
         <div className="text-4xl mb-4">🏛️</div>
         <h3 className="text-xl font-bold text-primary mb-4">The Cathedral of Computation</h3>
         <p className="text-secondary leading-relaxed mb-6">
           LLMs aren't magic. They are the convergence of:
         </p>
         <div className="flex flex-wrap justify-center gap-2 mb-6">
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-xs border border-blue-200 dark:border-blue-500/30">Information Theory</span>
            <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 rounded-full text-xs border border-amber-200 dark:border-amber-500/30">Boolean Logic</span>
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-xs border border-purple-200 dark:border-purple-500/30">Memory Hierarchy</span>
            <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-full text-xs border border-emerald-200 dark:border-emerald-500/30">Parallel Execution</span>
            <span className="px-3 py-1 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-full text-xs border border-red-200 dark:border-red-500/30">Computability Limits</span>
         </div>
         <p className="text-tertiary italic">
           "The next word is yours to predict."
         </p>
      </div>
    </div>
  );
};

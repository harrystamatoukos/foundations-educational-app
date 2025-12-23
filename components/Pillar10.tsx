import React, { useState, useEffect, useMemo, useRef } from 'react';
import { InfoCard, ToggleSwitch, LED } from './Shared';

// ============================================
// LEVEL 1: THE GUESSING GAME (INTUITION)
// ============================================
const GuessingGame = () => {
  const [target, setTarget] = useState<number | null>(null);
  const [candidates, setCandidates] = useState<boolean[]>(new Array(16).fill(true));
  const [questions, setQuestions] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("Pick a number between 0-15 in your head (or click Start to hide one).");

  const startGame = () => {
    const t = Math.floor(Math.random() * 16);
    setTarget(t);
    setCandidates(new Array(16).fill(true));
    setQuestions(0);
    setGameOver(false);
    setMessage("Target hidden. Ask questions to find it.");
  };

  const ask = (predicate: (i: number) => boolean, desc: string) => {
    if (gameOver || target === null) return;
    
    setQuestions(q => q + 1);
    
    // Check if target matches
    const yes = predicate(target);
    
    // Eliminate
    const newCandidates = candidates.map((c, i) => c && (yes ? predicate(i) : !predicate(i)));
    setCandidates(newCandidates);
    
    const remaining = newCandidates.filter(c => c).length;
    
    if (remaining === 1) {
      setGameOver(true);
      setMessage(`Found it! The number is ${target}. Total questions: ${questions + 1}`);
    } else {
      setMessage(`Answer: ${yes ? 'YES' : 'NO'}. Remaining possibilities: ${remaining}`);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center bg-slate-900 p-4 rounded-xl border border-slate-700">
        <button 
          onClick={startGame}
          className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-lg"
        >
          {target === null ? "Start Game" : "Restart"}
        </button>
        <div className="text-right">
          <div className="text-xs text-slate-400 uppercase font-bold">Questions Asked</div>
          <div className="text-2xl font-mono text-amber-400 font-bold">{questions} <span className="text-sm text-slate-600">/ 4 (Ideal)</span></div>
        </div>
      </div>

      {/* The Grid */}
      <div className="grid grid-cols-4 gap-2 bg-black/20 p-4 rounded-xl border border-white/5">
        {candidates.map((isPossible, i) => (
          <div 
            key={i}
            className={`
              h-16 rounded-lg flex items-center justify-center text-2xl font-mono font-bold transition-all duration-500
              ${isPossible 
                ? (gameOver && i === target ? 'bg-emerald-500 text-white scale-110 shadow-[0_0_20px_#10b981]' : 'bg-slate-700 text-white') 
                : 'bg-slate-900/50 text-slate-700 scale-90 opacity-50'
              }
            `}
          >
            {i}
          </div>
        ))}
      </div>

      <div className="bg-slate-800 p-4 rounded-xl text-center text-slate-300 font-medium">
        {message}
      </div>

      {/* Question Controls */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <button 
          onClick={() => ask(i => i < 8, "Is it < 8?")} 
          disabled={gameOver || target === null}
          className="p-3 bg-blue-600/20 border border-blue-500/50 hover:bg-blue-600/40 text-blue-300 rounded-lg disabled:opacity-30"
        >
          Is it &lt; 8?
        </button>
        <button 
          onClick={() => ask(i => i % 2 === 0, "Is it Even?")} 
          disabled={gameOver || target === null}
          className="p-3 bg-purple-600/20 border border-purple-500/50 hover:bg-purple-600/40 text-purple-300 rounded-lg disabled:opacity-30"
        >
          Is it Even?
        </button>
        <button 
          onClick={() => ask(i => (i & 4) !== 0, "Bit 2 set?")} 
          disabled={gameOver || target === null}
          className="p-3 bg-amber-600/20 border border-amber-500/50 hover:bg-amber-600/40 text-amber-300 rounded-lg disabled:opacity-30"
        >
          Is it 4,5,6,7,12,13,14,15?
        </button>
        <button 
          onClick={() => ask(i => [0,1,2,3,8,9,10,11].includes(i), "Is it Top Row?")} 
          disabled={gameOver || target === null}
          className="p-3 bg-pink-600/20 border border-pink-500/50 hover:bg-pink-600/40 text-pink-300 rounded-lg disabled:opacity-30"
        >
          Is it in {`{0..3, 8..11}`}?
        </button>
      </div>
      
      <div className="text-xs text-center text-slate-500">
        To find 1 in N items requires log₂(N) bits of information. <br/>
        log₂(16) = 4 bits. 4 Yes/No questions.
      </div>
    </div>
  );
};

// ============================================
// LEVEL 2: THE ENTROPY METER
// ============================================
const EntropyMeter = () => {
  // Weights for A, B, C, D
  const [weights, setWeights] = useState({ A: 50, B: 30, C: 15, D: 5 });
  
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  
  const stats = useMemo(() => {
    let h = 0;
    const probs: Record<string, number> = {};
    
    Object.entries(weights).forEach(([key, w]) => {
      const p = w / total;
      probs[key] = p;
      if (p > 0) h -= p * Math.log2(p);
    });
    
    return { h, probs };
  }, [weights, total]);

  const updateWeight = (key: string, val: number) => {
    setWeights(prev => ({ ...prev, [key]: parseInt(val.toString()) }));
  };

  // Visualize the distribution
  const colors: Record<string, string> = { A: 'bg-blue-500', B: 'bg-purple-500', C: 'bg-emerald-500', D: 'bg-amber-500' };

  return (
    <div className="flex flex-col gap-8 bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-xl">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sliders */}
        <div className="flex-1 space-y-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Symbol Probabilities</div>
          {Object.entries(weights).map(([key, val]) => (
            <div key={key} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-bold text-white">{key}</span>
                <span className="font-mono text-slate-400">{(stats.probs[key] * 100).toFixed(1)}%</span>
              </div>
              <input 
                type="range" min="0" max="100" value={val} 
                onChange={(e) => updateWeight(key, Number(e.target.value))}
                className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${colors[key].replace('bg-', 'accent-')}`}
              />
            </div>
          ))}
        </div>

        {/* Visualizer */}
        <div className="flex-1 flex flex-col items-center justify-center bg-black/30 rounded-xl p-6 border border-white/5">
           <div className="w-full h-12 flex rounded-lg overflow-hidden mb-6">
             {Object.entries(stats.probs).map(([key, p]) => (
               <div 
                 key={key} 
                 style={{ width: `${p * 100}%` }} 
                 className={`${colors[key]} flex items-center justify-center text-xs font-bold text-white/90 shadow-inner transition-all duration-300`}
               >
                 {p > 0.1 && key}
               </div>
             ))}
           </div>

           <div className="text-center">
             <div className="text-sm text-slate-400 mb-1">Shannon Entropy</div>
             <div className="text-4xl font-mono font-bold text-white mb-1">
               {stats.h.toFixed(3)} <span className="text-lg text-slate-500">bits</span>
             </div>
             <div className="text-xs text-slate-500 max-w-[200px] mx-auto mt-2">
               {stats.h.toFixed(2) === "2.00" 
                 ? "Maximum unpredictability. Every symbol is equally likely." 
                 : stats.h < 0.5 
                   ? "Very predictable. Low information content." 
                   : "Average information per symbol."}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// LEVEL 3: HUFFMAN CODING
// ============================================
const HuffmanDemo = () => {
  const [input, setInput] = useState("banana");
  
  const stats = useMemo(() => {
    if (!input) return { codes: {} as Record<string, string>, ratio: 0, originalBits: 0, compressedBits: 0, freq: {} as Record<string, number> };
    
    // 1. Frequencies
    const freq: Record<string, number> = {};
    for (const char of input) freq[char] = (freq[char] || 0) + 1;
    
    // 2. Build Tree (Simplified for display - pseudo-Huffman)
    // Actually just sort by freq to assign hypothetical variable length codes for demo
    // Real Huffman requires a tree, but for this visual we can approximate the *effect*
    // by assigning shorter codes to more frequent chars manually or building a simple tree object.
    
    type Node = { char?: string, freq: number, left?: Node, right?: Node };
    const queue: Node[] = Object.entries(freq).map(([char, f]) => ({ char, freq: f })).sort((a,b) => a.freq - b.freq);
    
    while(queue.length > 1) {
       const l = queue.shift()!;
       const r = queue.shift()!;
       const parent = { freq: l.freq + r.freq, left: l, right: r };
       // Insert sorted
       const idx = queue.findIndex(n => n.freq >= parent.freq);
       if (idx === -1) queue.push(parent);
       else queue.splice(idx, 0, parent);
    }
    
    const root = queue[0];
    const codes: Record<string, string> = {};
    const traverse = (n: Node, code: string) => {
       if (n.char) codes[n.char] = code || "0"; 
       if (n.left) traverse(n.left, code + "0");
       if (n.right) traverse(n.right, code + "1");
    };
    if (root) traverse(root, "");
    
    const originalBits = input.length * 8;
    let compressedBits = 0;
    for (const char of input) compressedBits += codes[char]?.length || 0;
    
    return { codes, ratio: originalBits / compressedBits, originalBits, compressedBits, freq };
  }, [input]);

  const encodedString = input.split('').map(c => stats.codes[c]).join(' ');

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-xl">
        <label className="text-xs text-slate-400 font-bold uppercase mb-2 block">Message to Compress</label>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={30}
          className="w-full bg-black text-white font-mono p-3 rounded border border-slate-600 focus:border-emerald-500 outline-none mb-6"
          placeholder="Type something..."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* Code Table */}
           <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-600">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-700 text-slate-300 font-mono text-xs uppercase">
                  <tr>
                    <th className="p-2">Char</th>
                    <th className="p-2">Freq</th>
                    <th className="p-2">Code</th>
                    <th className="p-2">Bits</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(stats.codes).sort((a,b) => a[1].length - b[1].length).map(([char, code]) => (
                    <tr key={char} className="border-t border-slate-700 font-mono">
                      <td className="p-2 text-white font-bold">{char === ' ' ? 'SPC' : char}</td>
                      <td className="p-2 text-slate-400">{stats.freq[char]}</td>
                      <td className="p-2 text-emerald-400">{code}</td>
                      <td className="p-2 text-slate-500">{code.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>

           {/* Stats */}
           <div className="flex flex-col gap-4 justify-center">
              <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                 <div className="text-xs text-red-300 uppercase font-bold">Original Size</div>
                 <div className="text-2xl font-mono text-white">{stats.originalBits} <span className="text-sm text-slate-400">bits</span></div>
                 <div className="text-[10px] text-slate-500">8 bits per char (ASCII)</div>
              </div>
              
              <div className="p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-lg">
                 <div className="text-xs text-emerald-300 uppercase font-bold">Compressed Size</div>
                 <div className="text-2xl font-mono text-white">{stats.compressedBits} <span className="text-sm text-slate-400">bits</span></div>
                 <div className="text-[10px] text-slate-500">Variable length codes</div>
              </div>

              <div className="text-center">
                 <div className="text-slate-400 text-xs uppercase font-bold">Compression Ratio</div>
                 <div className="text-3xl font-bold text-amber-400">{isFinite(stats.ratio) ? stats.ratio.toFixed(2) : 0}x</div>
              </div>
           </div>
        </div>

        <div className="mt-6">
           <div className="text-xs text-slate-400 font-bold uppercase mb-2">Bitstream</div>
           <div className="bg-black p-3 rounded border border-slate-700 font-mono text-emerald-500 text-sm break-all">
             {encodedString || "..."}
           </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// LEVEL 4: CHANNEL CAPACITY (WAVEFORM)
// ============================================
const ChannelCapacityDemo = () => {
  const [signalPower, setSignalPower] = useState(50);
  const [noisePower, setNoisePower] = useState(10);
  const [bandwidth, setBandwidth] = useState(20);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Shannon-Hartley: C = B * log2(1 + S/N)
  // We'll normalize S/N slightly for the display to be reasonable
  // Assume input values are roughly linear power for formula, but amplitude for drawing.
  // Power ~ Amplitude^2. 
  const snr = (signalPower * signalPower) / (Math.max(1, noisePower * noisePower));
  const capacity = bandwidth * Math.log2(1 + snr);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameId: number;
    let t = 0;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      const mid = h / 2;
      
      ctx.clearRect(0, 0, w, h);
      
      // Draw Grid
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, mid);
      ctx.lineTo(w, mid);
      ctx.stroke();

      // Draw Signal (Combined)
      ctx.beginPath();
      ctx.strokeStyle = '#60a5fa'; // Blue for signal
      ctx.lineWidth = 2;
      
      // Show digital signal (Square wave) + Noise
      // Or Analog Sine + Noise? Sine is easier to understand bandwidth.
      
      for (let x = 0; x < w; x++) {
        // Signal: Sine wave based on bandwidth
        const signalY = Math.sin((x + t) * 0.05 * (bandwidth / 10)) * signalPower;
        
        // Noise: Random
        const noiseY = (Math.random() - 0.5) * noisePower * 2;
        
        const y = mid + signalY + noiseY;
        
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      
      // Draw "Clean" Signal shadow for comparison
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      for (let x = 0; x < w; x++) {
        const signalY = Math.sin((x + t) * 0.05 * (bandwidth / 10)) * signalPower;
        if (x === 0) ctx.moveTo(x, mid + signalY);
        else ctx.lineTo(x, mid + signalY);
      }
      ctx.stroke();

      t += 2;
      frameId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(frameId);
  }, [signalPower, noisePower, bandwidth]);

  return (
    <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-xl flex flex-col gap-8">
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Controls */}
        <div className="w-full md:w-64 flex flex-col gap-6">
           <div>
             <div className="flex justify-between text-sm text-slate-300 mb-2 font-bold">
               <span>Signal Amplitude</span>
             </div>
             <input 
                type="range" min="0" max="100" step="1" 
                value={signalPower} onChange={e => setSignalPower(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
             />
           </div>

           <div>
             <div className="flex justify-between text-sm text-slate-300 mb-2 font-bold">
               <span>Noise Amplitude</span>
             </div>
             <input 
                type="range" min="0" max="100" step="1" 
                value={noisePower} onChange={e => setNoisePower(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
             />
           </div>

           <div>
             <div className="flex justify-between text-sm text-slate-300 mb-2 font-bold">
               <span>Bandwidth (Hz)</span>
             </div>
             <input 
                type="range" min="1" max="50" step="1" 
                value={bandwidth} onChange={e => setBandwidth(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
             />
           </div>
        </div>

        {/* Visuals */}
        <div className="flex-1 flex flex-col gap-4">
           <canvas 
             ref={canvasRef} 
             width={400} 
             height={200} 
             className="w-full h-48 bg-black rounded-lg border border-slate-700 shadow-inner"
           />
           
           <div className="flex justify-between items-center bg-black/20 p-4 rounded-lg border border-white/5">
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-widest">SNR</div>
                <div className="text-xl font-mono text-slate-300">{snr.toFixed(2)}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500 uppercase tracking-widest">Channel Capacity</div>
                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                  {capacity.toFixed(1)} <span className="text-sm text-slate-500 font-normal">Mbps</span>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// LEVEL 5: ERROR CORRECTION (HAMMING)
// ============================================
const HammingDemo = () => {
  const [data, setData] = useState([1, 0, 1, 1]); // 4 data bits
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);

  // Calculate Parity
  // Positions (1-7): P1 P2 D1 P4 D2 D3 D4
  // Indices (0-6):   0  1  2  3  4  5  6
  // Data Mapping:    -  -  d0 -  d1 d2 d3
  
  const d = data;
  const p1 = d[0] ^ d[1] ^ d[3]; // Checks 3,5,7 -> D1, D2, D4 -> indices 2, 4, 6
  const p2 = d[0] ^ d[2] ^ d[3]; // Checks 3,6,7 -> D1, D3, D4 -> indices 2, 5, 6
  const p4 = d[1] ^ d[2] ^ d[3]; // Checks 5,6,7 -> D2, D3, D4 -> indices 4, 5, 6
  
  // Construct 7-bit word
  const cleanBits = [p1, p2, d[0], p4, d[1], d[2], d[3]];
  
  // Apply error
  const finalBits = [...cleanBits];
  if (flippedIndex !== null) {
    finalBits[flippedIndex] = finalBits[flippedIndex] === 0 ? 1 : 0;
  }

  // Receiver Logic (Syndrome Calculation)
  const s1 = finalBits[0] ^ finalBits[2] ^ finalBits[4] ^ finalBits[6];
  const s2 = finalBits[1] ^ finalBits[2] ^ finalBits[5] ^ finalBits[6];
  const s4 = finalBits[3] ^ finalBits[4] ^ finalBits[5] ^ finalBits[6];
  
  const errorPos = (s4 * 4) + (s2 * 2) + (s1 * 1); // 0 means no error

  const toggleData = (idx: number) => {
    const newData = [...data];
    newData[idx] = newData[idx] ? 0 : 1;
    setData(newData);
    setFlippedIndex(null);
  };

  const toggleError = (idx: number) => {
    if (flippedIndex === idx) setFlippedIndex(null);
    else setFlippedIndex(idx);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-xl">
        {/* Input Data */}
        <div className="flex justify-center gap-8 mb-8">
           <div className="flex flex-col items-center gap-2">
             <div className="text-xs text-slate-400 font-bold uppercase">Data Input (4 bits)</div>
             <div className="flex gap-2">
                {data.map((bit, i) => (
                  <button 
                    key={i} 
                    onClick={() => toggleData(i)}
                    className={`w-10 h-10 rounded border font-mono font-bold text-lg transition-all
                      ${bit ? 'bg-blue-600 border-blue-400 text-white' : 'bg-slate-800 border-slate-600 text-slate-500'}
                    `}
                  >
                    {bit}
                  </button>
                ))}
             </div>
           </div>
        </div>

        {/* Transmission Line */}
        <div className="relative p-6 bg-black/30 rounded-xl border border-slate-700 mb-8">
           <div className="text-xs text-slate-400 font-bold uppercase mb-4 text-center">
             Transmitted Word (7 bits) - Click to Flip Bit (Simulate Noise)
           </div>
           
           <div className="flex justify-center gap-2">
              {finalBits.map((bit, i) => {
                const isParity = i === 0 || i === 1 || i === 3;
                const isFlipped = i === flippedIndex;
                
                return (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className="text-[9px] font-mono text-slate-500">
                      {isParity ? 'P' : 'D'}{isParity ? Math.pow(2, [0,1,3].indexOf(i)) : ''}
                    </div>
                    <button
                      onClick={() => toggleError(i)}
                      className={`w-12 h-14 rounded font-mono font-bold text-xl flex items-center justify-center border-2 transition-all hover:scale-105
                        ${isFlipped 
                           ? 'bg-red-500 border-red-300 text-white shadow-[0_0_15px_red]' 
                           : isParity 
                             ? 'bg-emerald-900/40 border-emerald-500/50 text-emerald-400' 
                             : 'bg-blue-900/40 border-blue-500/50 text-blue-400'
                        }
                      `}
                    >
                      {bit}
                    </button>
                    <div className="text-[9px] font-mono text-slate-600">{i + 1}</div>
                  </div>
                );
              })}
           </div>
        </div>

        {/* Receiver Status */}
        <div className={`p-4 rounded-xl border transition-all flex justify-between items-center
           ${errorPos === 0 
             ? 'bg-emerald-900/20 border-emerald-500/30' 
             : 'bg-amber-900/20 border-amber-500/30'
           }
        `}>
           <div>
             <div className="text-xs font-bold uppercase mb-1">
               {errorPos === 0 ? <span className="text-emerald-400">Transmission Valid</span> : <span className="text-amber-400">Error Detected!</span>}
             </div>
             <div className="text-sm text-slate-300">
               Syndrome: <span className="font-mono">{s4}{s2}{s1}</span> (Binary) = <span className="font-mono">{errorPos}</span> (Decimal)
             </div>
           </div>
           
           {errorPos > 0 && (
             <div className="text-right">
               <div className="text-xs font-bold text-amber-400 uppercase">Correction</div>
               <div className="text-sm text-slate-300">
                 Flipping bit at position <span className="font-bold text-white bg-amber-600 px-1.5 rounded">{errorPos}</span> fixes the data.
               </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
export const Pillar10: React.FC = () => {
  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-2">Pillar 10: Information Theory</h2>
        <p className="text-slate-400">The fundamental limits of communication and storage.</p>
      </div>

      <InfoCard title="Level 1: The Guessing Game" icon="🎲">
        <p>
          How much information is in a question? To find 1 item in 16, you need <strong className="text-emerald-400">4 bits</strong> (Yes/No questions). 
          Trying to beat this limit is impossible.
        </p>
      </InfoCard>

      <GuessingGame />

      <div className="w-full h-px bg-slate-800" />

      <InfoCard title="Level 2: The Entropy Meter" icon="📊">
        <p>
          Information is the resolution of uncertainty. Rare symbols carry <strong className="text-emerald-400">more information</strong> than common ones. 
          When everything is equally likely, entropy is maximized.
        </p>
      </InfoCard>

      <EntropyMeter />

      <div className="w-full h-px bg-slate-800" />

      <InfoCard title="Level 3: Compression (Huffman)" icon="📦">
        <p>
          Since predictable data carries less information, we can compress it. 
          <strong className="text-amber-400">Huffman Coding</strong> uses short codes for common symbols and long codes for rare ones.
        </p>
      </InfoCard>

      <HuffmanDemo />

      <div className="w-full h-px bg-slate-800" />

      <InfoCard title="Level 4: The Speed Limit" icon="🚦">
        <p>
          Shannon proved there is a maximum speed for any communication channel, determined by bandwidth and noise. 
          If noise is too high, the signal is lost.
        </p>
      </InfoCard>

      <ChannelCapacityDemo />

      <div className="w-full h-px bg-slate-800" />

      <InfoCard title="Level 5: Error Correction" icon="🩹">
        <p>
          By adding redundancy (parity bits), we can detect and even correct errors. 
          <strong className="text-blue-400">Hamming Code</strong> adds 3 bits to 4 data bits to make them bulletproof against single flips.
        </p>
      </InfoCard>

      <HammingDemo />
    </div>
  );
};

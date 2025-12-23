import React, { useState, useEffect, useRef } from 'react';
import { InfoCard, ToggleSwitch } from './Shared';

// ============================================
// LEVEL 1: THE TOWER OF ABSTRACTION
// ============================================
const AbstractionTower = () => {
  const [level, setLevel] = useState(0);
  const [inputA, setInputA] = useState(false);
  const [inputB, setInputB] = useState(false);
  
  const output = !(inputA && inputB); // NAND Logic

  const levels = [
    { name: 'Physics (Transistors)', desc: 'The physical reality. Electrons flowing through silicon channels.' },
    { name: 'Logic (Gates)', desc: 'The schematic map. Hides physics, shows boolean relationships.' },
    { name: 'Hardware (Integrated Circuits)', desc: 'The package. Hides individual gates, exposes pins.' },
    { name: 'Software (Functions)', desc: 'The interface. Hides hardware completely.' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-slate-900 p-4 rounded-xl border border-slate-700">
        <div className="flex gap-8">
          <ToggleSwitch on={inputA} onChange={setInputA} label="Input A" orientation="horizontal" />
          <ToggleSwitch on={inputB} onChange={setInputB} label="Input B" orientation="horizontal" />
        </div>
        
        <div className="flex flex-col items-end gap-2 mt-4 md:mt-0">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-widest">Abstraction Level</div>
          <input 
            type="range" 
            min="0" 
            max="3" 
            value={level} 
            onChange={(e) => setLevel(parseInt(e.target.value))}
            className="w-48 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="text-sm font-bold text-indigo-400">{levels[level].name}</div>
        </div>
      </div>

      {/* Visualization Area */}
      <div className="relative h-64 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden shadow-inner">
        <div className="absolute top-2 left-0 right-0 text-center text-xs text-slate-500 italic px-4">
          {levels[level].desc}
        </div>

        {/* LEVEL 0: TRANSISTORS */}
        {level === 0 && (
          <svg viewBox="0 0 300 200" className="w-full max-w-md h-full">
            {/* VCC */}
            <text x="150" y="20" fill="#ef4444" textAnchor="middle" fontSize="10">5V</text>
            <line x1="150" y1="25" x2="150" y2="40" stroke="#ef4444" strokeWidth="2" />
            
            {/* PMOS Network (Parallel) */}
            <circle cx="120" cy="50" r="3" stroke="#475569" fill="none" />
            <path d="M 150 40 L 120 40 L 120 70 L 150 70" stroke="#475569" strokeWidth="2" fill="none" />
            <line x1="100" y1="50" x2="117" y2="50" stroke={inputA ? "#fbbf24" : "#475569"} strokeWidth="2" /> {/* Gate A */}
            
            <circle cx="180" cy="50" r="3" stroke="#475569" fill="none" />
            <path d="M 150 40 L 180 40 L 180 70 L 150 70" stroke="#475569" strokeWidth="2" fill="none" />
            <line x1="200" y1="50" x2="183" y2="50" stroke={inputB ? "#fbbf24" : "#475569"} strokeWidth="2" /> {/* Gate B */}

            <line x1="150" y1="70" x2="150" y2="100" stroke={output ? "#34d399" : "#475569"} strokeWidth="2" />
            
            {/* Output Line */}
            <circle cx="250" cy="100" r="5" fill={output ? "#34d399" : "#334155"} />
            <line x1="150" y1="100" x2="245" y2="100" stroke={output ? "#34d399" : "#475569"} strokeWidth="2" />

            {/* NMOS Network (Series) */}
            <line x1="150" y1="100" x2="150" y2="120" stroke="#475569" strokeWidth="2" />
            <line x1="130" y1="130" x2="150" y2="130" stroke={inputA ? "#fbbf24" : "#475569"} strokeWidth="2" /> {/* Gate A */}
            <line x1="150" y1="120" x2="150" y2="150" stroke="#475569" strokeWidth="2" />
            
            <line x1="130" y1="160" x2="150" y2="160" stroke={inputB ? "#fbbf24" : "#475569"} strokeWidth="2" /> {/* Gate B */}
            <line x1="150" y1="150" x2="150" y2="180" stroke="#475569" strokeWidth="2" />
            
            {/* GND */}
            <line x1="140" y1="180" x2="160" y2="180" stroke="#475569" strokeWidth="2" />
            <line x1="145" y1="185" x2="155" y2="185" stroke="#475569" strokeWidth="2" />
          </svg>
        )}

        {/* LEVEL 1: LOGIC GATES */}
        {level === 1 && (
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-8">
              <div className={`px-2 py-1 rounded text-xs font-mono ${inputA ? 'bg-amber-500 text-black' : 'bg-slate-800 text-slate-500'}`}>A={inputA ? '1' : '0'}</div>
              <div className={`px-2 py-1 rounded text-xs font-mono ${inputB ? 'bg-amber-500 text-black' : 'bg-slate-800 text-slate-500'}`}>B={inputB ? '1' : '0'}</div>
            </div>
            
            <svg width="120" height="80" viewBox="0 0 120 80">
              <path d="M 10 20 L 40 20" stroke={inputA ? "#fbbf24" : "#475569"} strokeWidth="3" />
              <path d="M 10 60 L 40 60" stroke={inputB ? "#fbbf24" : "#475569"} strokeWidth="3" />
              
              {/* NAND Symbol */}
              <path d="M 40 10 L 70 10 C 90 10 90 70 70 70 L 40 70 Z" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2" />
              <circle cx="96" cy="40" r="4" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2" />
              
              <path d="M 102 40 L 120 40" stroke={output ? "#34d399" : "#475569"} strokeWidth="3" />
            </svg>

            <div className={`px-2 py-1 rounded text-xs font-mono ${output ? 'bg-emerald-500 text-black' : 'bg-slate-800 text-slate-500'}`}>OUT={output ? '1' : '0'}</div>
          </div>
        )}

        {/* LEVEL 2: IC CHIP */}
        {level === 2 && (
          <div className="relative w-64 h-24 bg-[#111] rounded shadow-2xl flex items-center justify-center border border-gray-800">
            <div className="text-gray-400 font-mono text-xs flex flex-col items-center">
              <span className="text-xl font-bold tracking-widest text-gray-200">7400</span>
              <span className="text-[9px] text-gray-600">QUAD 2-INPUT NAND</span>
            </div>
            {/* Pins Visualization */}
            <div className="absolute bottom-2 left-4 flex gap-3 text-[8px] font-mono text-gray-500">
              <span className={inputA ? 'text-amber-500 font-bold' : ''}>1A</span>
              <span className={inputB ? 'text-amber-500 font-bold' : ''}>1B</span>
              <span className={output ? 'text-emerald-500 font-bold' : ''}>1Y</span>
            </div>
          </div>
        )}

        {/* LEVEL 3: CODE */}
        {level === 3 && (
          <div className="bg-[#1e1e1e] p-4 rounded-lg font-mono text-sm border border-slate-700 shadow-xl w-full max-w-md">
            <div className="text-pink-400">def <span className="text-blue-400">nand</span>(a, b):</div>
            <div className="pl-4 text-slate-300">
              return <span className="text-pink-400">not</span> (a <span className="text-pink-400">and</span> b)
            </div>
            <div className="mt-4 pt-4 border-t border-slate-700 text-slate-400">
              {">>>"} nand(<span className={inputA ? "text-amber-400" : "text-slate-500"}>{String(inputA)}</span>, <span className={inputB ? "text-amber-400" : "text-slate-500"}>{String(inputB)}</span>)
            </div>
            <div className={`mt-1 font-bold ${output ? "text-emerald-400" : "text-slate-500"}`}>
              {String(output)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// LEVEL 2: COMPOSITION WORKSHOP
// ============================================
const CompositionWorkshop = () => {
  const [inputs, setInputs] = useState([1, 2, 3, 4, 5, 6]);
  const [ops, setOps] = useState({
    op1: 'double', // double, add1, square
    op2: 'filterOdd', // filterOdd, filterEven, pass
    op3: 'format', // format
  });

  // Calculate Result
  const process = (arr: number[]) => {
    let step1 = arr;
    // Step 1: Transform
    if (ops.op1 === 'double') step1 = arr.map(x => x * 2);
    if (ops.op1 === 'add1') step1 = arr.map(x => x + 1);
    if (ops.op1 === 'square') step1 = arr.map(x => x * x);

    let step2 = step1;
    // Step 2: Filter
    if (ops.op2 === 'filterOdd') step2 = step1.filter(x => x % 2 !== 0);
    if (ops.op2 === 'filterEven') step2 = step1.filter(x => x % 2 === 0);
    
    // Step 3: Format
    return step2.map(x => `[${x}]`);
  };

  const output = process(inputs);

  return (
    <div className="flex flex-col gap-8 items-center">
      {/* Pipeline Visual */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full">
        
        {/* Input */}
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-600 text-center min-w-[100px]">
          <div className="text-xs text-slate-400 uppercase font-bold mb-2">Input</div>
          <div className="font-mono text-sm text-white">[{inputs.join(', ')}]</div>
        </div>

        <div className="text-2xl text-slate-600">→</div>

        {/* Blocks */}
        <div className="flex flex-col md:flex-row gap-2 bg-black/20 p-4 rounded-xl border border-dashed border-slate-600">
           
           {/* Block 1: Map */}
           <div className="flex flex-col gap-2">
             <select 
               value={ops.op1}
               onChange={(e) => setOps({...ops, op1: e.target.value})}
               className="bg-blue-900 text-white p-2 rounded text-sm border border-blue-500 outline-none"
             >
               <option value="double">Map: x * 2</option>
               <option value="add1">Map: x + 1</option>
               <option value="square">Map: x²</option>
             </select>
           </div>

           <div className="text-slate-500 self-center">→</div>

           {/* Block 2: Filter */}
           <div className="flex flex-col gap-2">
             <select 
               value={ops.op2}
               onChange={(e) => setOps({...ops, op2: e.target.value})}
               className="bg-purple-900 text-white p-2 rounded text-sm border border-purple-500 outline-none"
             >
               <option value="pass">Filter: None</option>
               <option value="filterOdd">Filter: Keep Odd</option>
               <option value="filterEven">Filter: Keep Even</option>
             </select>
           </div>

           <div className="text-slate-500 self-center">→</div>

           {/* Block 3: Format */}
           <div className="bg-emerald-900 text-white p-2 rounded text-sm border border-emerald-500 opacity-80 cursor-not-allowed">
             Format: "[x]"
           </div>

        </div>

        <div className="text-2xl text-slate-600">→</div>

        {/* Output */}
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-600 text-center min-w-[100px]">
          <div className="text-xs text-slate-400 uppercase font-bold mb-2">Output</div>
          <div className="font-mono text-sm text-emerald-400">
            {output.length > 0 ? output.join(' ') : 'Empty'}
          </div>
        </div>

      </div>

      <div className="text-sm text-slate-400 max-w-lg text-center">
        We built a complex data pipeline by composing simple, reusable blocks. 
        Each block hides its implementation logic behind a standard interface.
      </div>
    </div>
  );
};

// ============================================
// LEVEL 3: THE INTERPRETER (LAYERS)
// ============================================
const ExpressionParser = () => {
  const [expr, setExpr] = useState("3 + 5 * 2");
  
  // Simple Parsing Logic for Demo
  const tokenize = (str: string) => str.match(/\d+|[+*/()-]/g) || [];
  
  const tokens = tokenize(expr);
  
  // Fake AST for visuals (simplified)
  // 3 + 5 * 2 -> (+ 3 (* 5 2))
  let result = "Error";
  try {
    // eslint-disable-next-line no-eval
    result = eval(expr); 
  } catch (e) {
    result = "?";
  }

  return (
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700 shadow-xl space-y-6">
      <div className="flex flex-col gap-2">
        <label className="text-xs text-slate-400 uppercase font-bold">Source Code (Input)</label>
        <input 
          type="text" 
          value={expr}
          onChange={(e) => setExpr(e.target.value)}
          className="w-full bg-black text-white font-mono p-3 rounded border border-slate-600 focus:border-indigo-500 outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Layer 1: Tokens */}
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-600">
          <div className="text-xs text-slate-400 uppercase font-bold mb-2">1. Tokenizer</div>
          <div className="flex flex-wrap gap-2">
            {tokens.map((t, i) => (
              <span key={i} className="px-2 py-1 bg-indigo-900/50 text-indigo-300 rounded font-mono text-sm border border-indigo-500/30">
                '{t}'
              </span>
            ))}
          </div>
        </div>

        {/* Layer 2: AST */}
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-600">
          <div className="text-xs text-slate-400 uppercase font-bold mb-2">2. Parser (AST)</div>
          <div className="flex flex-col items-center">
             <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold border border-slate-500 mb-1">+</div>
                <div className="flex gap-4">
                   <div className="flex flex-col items-center">
                      <div className="h-4 w-px bg-slate-500"></div>
                      <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center text-xs border border-slate-700">3</div>
                   </div>
                   <div className="flex flex-col items-center">
                      <div className="h-4 w-px bg-slate-500"></div>
                      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold border border-slate-500 mb-1">*</div>
                      <div className="flex gap-2">
                         <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center text-xs border border-slate-700 mt-1">5</div>
                         <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center text-xs border border-slate-700 mt-1">2</div>
                      </div>
                   </div>
                </div>
             </div>
             <div className="text-[10px] text-slate-500 mt-2 italic">(Simplified Tree)</div>
          </div>
        </div>

        {/* Layer 3: Evaluation */}
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-600">
          <div className="text-xs text-slate-400 uppercase font-bold mb-2">3. Evaluator</div>
          <div className="flex items-center justify-center h-20">
             <span className="text-4xl font-mono font-bold text-emerald-400">{result}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// LEVEL 4: INTERFACE VS IMPLEMENTATION
// ============================================
const StorageDemo = () => {
  const [backend, setBackend] = useState<'ram' | 'disk' | 'cloud'>('ram');
  const [data, setData] = useState<string>("");
  const [storedData, setStoredData] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const save = async () => {
    setLoading(true);
    // Simulate latency based on backend
    const delay = backend === 'ram' ? 100 : backend === 'disk' ? 800 : 2000;
    await new Promise(r => setTimeout(r, delay));
    setStoredData(data);
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* The Interface (What the User Sees) */}
      <div className="bg-indigo-900/20 p-6 rounded-2xl border border-indigo-500/30 flex flex-col items-center">
        <div className="text-xs text-indigo-300 uppercase font-bold mb-4 tracking-widest">Public Interface (API)</div>
        
        <div className="flex gap-4 w-full max-w-md">
          <input 
            type="text" 
            placeholder="Enter data..." 
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="flex-1 bg-slate-900 text-white px-4 py-2 rounded border border-slate-700 focus:border-indigo-500 outline-none"
          />
          <button 
            onClick={save}
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save()'}
          </button>
        </div>
      </div>

      {/* The Implementation Switcher */}
      <div className="flex justify-center gap-4">
        {[
          { id: 'ram', icon: '🧠', label: 'Memory (RAM)' },
          { id: 'disk', icon: '💾', label: 'File System' },
          { id: 'cloud', icon: '☁️', label: 'Cloud API' }
        ].map((b) => (
          <button
            key={b.id}
            onClick={() => setBackend(b.id as any)}
            className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all w-32
              ${backend === b.id 
                ? 'bg-slate-800 border-amber-500 shadow-lg scale-105' 
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:bg-slate-800'
              }
            `}
          >
            <span className="text-2xl mb-2">{b.icon}</span>
            <span className="text-xs font-bold">{b.label}</span>
          </button>
        ))}
      </div>

      {/* The Backend Visualization (Hidden Implementation Details) */}
      <div className="bg-black/30 p-6 rounded-xl border border-white/5 relative min-h-[120px] flex items-center justify-center">
        <div className="absolute top-2 left-2 text-[10px] text-slate-500 uppercase tracking-widest">Private Implementation</div>
        
        {backend === 'ram' && (
          <div className="font-mono text-emerald-400">
            Variable _data = <span className="bg-slate-800 px-2 py-1 rounded">"{storedData}"</span>
            <div className="text-xs text-slate-500 mt-1">Access Time: ~0.1ms</div>
          </div>
        )}

        {backend === 'disk' && (
          <div className="flex items-center gap-3">
            <span className="text-4xl">📄</span>
            <div className="font-mono text-slate-300">
              Writing bytes to /var/data.txt...<br/>
              Content: <span className="text-amber-400">"{storedData}"</span>
            </div>
          </div>
        )}

        {backend === 'cloud' && (
          <div className="flex flex-col items-center w-full">
             <div className="flex items-center gap-4 w-full justify-center">
               <div className="text-xs font-mono">Client</div>
               <div className={`h-1 flex-1 bg-slate-700 relative max-w-[200px] overflow-hidden rounded`}>
                 {loading && <div className="absolute inset-0 bg-blue-500 animate-[progress_1s_infinite_linear]" />}
               </div>
               <div className="text-xs font-mono">Server</div>
             </div>
             {!loading && storedData && <div className="text-xs text-green-400 mt-2">HTTP 200 OK: Saved "{storedData}"</div>}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
export const Pillar7: React.FC = () => {
  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-2">Pillar 7: Abstraction & Composition</h2>
        <p className="text-slate-400">How we manage complexity. Hiding details to build bigger things.</p>
      </div>

      <InfoCard title="Level 1: The Tower of Abstraction" icon="🗼">
        <p>
          Every computer is a tower of lies. The code lies about the hardware, the hardware lies about the physics.
          <strong className="text-amber-400"> Abstraction</strong> is selective ignorance. We ignore the details below to focus on the level above.
        </p>
      </InfoCard>

      <AbstractionTower />

      <div className="w-full h-px bg-slate-800" />

      <InfoCard title="Level 2: Composition" icon="🧱">
        <p>
          How do we build complex systems? By snapping together simpler blocks.
          The pipe operator (<code className="bg-slate-800 px-1 rounded">|</code>) in Unix or function composition in code allows us to chain operations without knowing their internals.
        </p>
      </InfoCard>

      <CompositionWorkshop />

      <div className="w-full h-px bg-slate-800" />

      <InfoCard title="Level 3: Layers of Interpretation" icon="🗣️">
        <p>
          How does <code className="bg-slate-800 text-pink-400 px-1 rounded">3 + 5</code> become <code className="bg-slate-800 text-emerald-400 px-1 rounded">8</code>?
          It passes through layers: Source Code -> Tokens -> Abstract Syntax Tree -> Result.
        </p>
      </InfoCard>

      <ExpressionParser />

      <div className="w-full h-px bg-slate-800" />

      <InfoCard title="Level 4: Interface vs Implementation" icon="🔌">
        <p>
          The <strong className="text-indigo-400">Interface</strong> is the buttons you press. The <strong className="text-slate-400">Implementation</strong> is the machinery inside.
          You can change the machinery without changing the buttons.
        </p>
      </InfoCard>

      <StorageDemo />
    </div>
  );
};

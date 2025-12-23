import React, { useState, useEffect } from 'react';
import { InfoCard, ToggleSwitch, LED, Breadboard } from './Shared';
import { LightSwitchDemo, SeriesCircuitDemo, ParallelCircuitDemo, TransistorDemo, NotGateDemo, ICChipDemo } from './Lessons';

// ============================================
// TRUTH TABLE BUILDER
// ============================================
const TruthTableBuilder = () => {
  const [gateType, setGateType] = useState<'AND' | 'OR' | 'XOR' | 'NAND'>('AND');
  const [inputA, setInputA] = useState(false);
  const [inputB, setInputB] = useState(false);
  
  // Track which rows user has "discovered"
  const [discoveredRows, setDiscoveredRows] = useState<Record<string, boolean>>({});

  const checkLogic = (a: boolean, b: boolean, type: string) => {
    if (type === 'AND') return a && b;
    if (type === 'OR') return a || b;
    if (type === 'XOR') return a !== b;
    if (type === 'NAND') return !(a && b);
    return false;
  };

  const output = checkLogic(inputA, inputB, gateType);
  const rowKey = `${inputA ? 1 : 0}${inputB ? 1 : 0}`;

  // Automatically mark current row as discovered
  useEffect(() => {
    setDiscoveredRows(prev => {
      // If the row is already discovered and matches output, don't update (prevents loop)
      if (prev[rowKey] === output) return prev;
      // Otherwise mark it
      return { ...prev, [rowKey]: output };
    });
  }, [inputA, inputB, gateType, output, rowKey]);

  const handleGateChange = (type: any) => {
    setGateType(type);
    setDiscoveredRows({}); // Reset discovery for new gate
  };

  const progress = Object.keys(discoveredRows).length;

  return (
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700 shadow-xl flex flex-col md:flex-row gap-8">
      
      {/* Left: Interactive Gate */}
      <div className="flex-1 flex flex-col items-center gap-8">
        <div className="flex gap-2 mb-4">
          {['AND', 'OR', 'XOR', 'NAND'].map(g => (
            <button 
              key={g} 
              onClick={() => handleGateChange(g)}
              className={`px-3 py-1 rounded text-xs font-bold border transition-colors ${gateType === g ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-slate-800 text-slate-400 border-slate-600'}`}
            >
              {g}
            </button>
          ))}
        </div>

        <div className="bg-black/30 p-8 rounded-xl border border-white/5 flex items-center gap-8">
           <div className="flex flex-col gap-6">
             <ToggleSwitch on={inputA} onChange={setInputA} label="A" />
             <ToggleSwitch on={inputB} onChange={setInputB} label="B" />
           </div>
           
           <div className="flex flex-col items-center justify-center w-24 h-24 bg-slate-800 rounded-lg border-2 border-slate-600 shadow-lg">
              <span className="text-2xl font-bold text-slate-300">{gateType}</span>
           </div>

           <div className="flex flex-col items-center gap-2">
             <LED on={output} color="green" size="large" />
             <span className="text-xs font-mono text-gray-500">OUT</span>
           </div>
        </div>
      </div>

      {/* Right: Truth Table */}
      <div className="flex-1 bg-slate-800 rounded-xl border border-slate-600 overflow-hidden flex flex-col">
        <div className="bg-slate-700 p-3 text-center text-xs font-bold text-slate-300 uppercase tracking-widest">
          Truth Table ({progress}/4 Discovered)
        </div>
        <div className="grid grid-cols-3 gap-px bg-slate-600 flex-1">
           {/* Header */}
           <div className="bg-slate-800 p-2 text-center text-slate-400 font-bold text-sm">A</div>
           <div className="bg-slate-800 p-2 text-center text-slate-400 font-bold text-sm">B</div>
           <div className="bg-slate-800 p-2 text-center text-emerald-400 font-bold text-sm">OUT</div>

           {/* Rows */}
           {['00', '01', '10', '11'].map(key => {
             const isDiscovered = discoveredRows[key] !== undefined;
             const isCurrent = rowKey === key;
             
             return (
               <React.Fragment key={key}>
                 <div className={`p-3 text-center font-mono ${isCurrent ? 'bg-blue-900/30 text-white' : 'bg-slate-900 text-slate-500'}`}>
                   {key[0]}
                 </div>
                 <div className={`p-3 text-center font-mono ${isCurrent ? 'bg-blue-900/30 text-white' : 'bg-slate-900 text-slate-500'}`}>
                   {key[1]}
                 </div>
                 <div className={`p-3 text-center font-mono font-bold transition-all duration-500
                   ${isDiscovered 
                     ? (discoveredRows[key] ? 'bg-emerald-900/30 text-emerald-400' : 'bg-slate-900 text-slate-400') 
                     : 'bg-slate-950 text-transparent'}
                   ${isCurrent ? 'ring-inset ring-2 ring-blue-500' : ''}
                 `}>
                   {isDiscovered ? (discoveredRows[key] ? '1' : '0') : '?'}
                 </div>
               </React.Fragment>
             );
           })}
        </div>
      </div>
    </div>
  );
};

// ============================================
// ADDER LAB
// ============================================
const HalfAdder = () => {
  const [a, setA] = useState(false);
  const [b, setB] = useState(false);
  
  const sum = a !== b; // XOR
  const carry = a && b; // AND

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-8">
        <ToggleSwitch on={a} onChange={setA} label="A" />
        <ToggleSwitch on={b} onChange={setB} label="B" />
      </div>
      
      <div className="relative w-full max-w-md h-48 bg-[#1e293b] rounded-xl border border-slate-700 p-4 shadow-inner overflow-hidden">
        {/* Wires */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {/* A Inputs */}
          <path d="M 80 40 L 150 40 L 150 80" stroke={a ? '#fbbf24' : '#334155'} strokeWidth="3" fill="none" />
          <path d="M 80 40 L 120 40 L 120 140 L 150 140" stroke={a ? '#fbbf24' : '#334155'} strokeWidth="3" fill="none" />
          
          {/* B Inputs */}
          <path d="M 80 160 L 150 160 L 150 120" stroke={b ? '#fbbf24' : '#334155'} strokeWidth="3" fill="none" />
          <path d="M 80 160 L 120 160 L 120 60 L 150 60" stroke={b ? '#fbbf24' : '#334155'} strokeWidth="3" fill="none" />

          {/* Logic Gates (Visualized as boxes for simplicity in SVG lines) */}
          
          {/* XOR Out (Sum) */}
          <path d="M 230 100 L 320 100" stroke={sum ? '#34d399' : '#334155'} strokeWidth="3" />
          
          {/* AND Out (Carry) */}
          <path d="M 230 150 L 320 150" stroke={carry ? '#34d399' : '#334155'} strokeWidth="3" />
        </svg>

        {/* Gate Nodes */}
        <div className="absolute top-[70px] left-[150px] w-20 h-16 bg-slate-800 border border-amber-500/50 rounded flex items-center justify-center z-10 shadow-lg">
          <span className="font-bold text-amber-500 text-xs">XOR</span>
        </div>
        <div className="absolute top-[130px] left-[150px] w-20 h-10 bg-slate-800 border border-blue-500/50 rounded flex items-center justify-center z-10 shadow-lg">
          <span className="font-bold text-blue-500 text-xs">AND</span>
        </div>

        {/* Outputs */}
        <div className="absolute right-10 top-[85px] flex flex-col items-center">
          <LED on={sum} color="green" />
          <span className="text-[10px] text-slate-400 mt-1">SUM</span>
        </div>
        <div className="absolute right-10 top-[135px] flex flex-col items-center">
          <LED on={carry} color="red" />
          <span className="text-[10px] text-slate-400 mt-1">CARRY</span>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
export const Pillar2: React.FC = () => {
  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-2">Pillar 2: Boolean Logic & Gates</h2>
        <p className="text-slate-400">How do we compute with true/false? Building the atoms of reasoning.</p>
      </div>

      <InfoCard title="Level 1: Intuition" icon="🤔">
        <p>Logic is made of switches. <strong className="text-emerald-400">AND</strong> is series, <strong className="text-emerald-400">OR</strong> is parallel, <strong className="text-emerald-400">NOT</strong> is an inverter.</p>
      </InfoCard>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LightSwitchDemo />
        <NotGateDemo />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SeriesCircuitDemo />
        <ParallelCircuitDemo />
      </div>

      <div className="w-full h-px bg-slate-800" />

      <InfoCard title="Level 2: The Rules of Reasoning" icon="📐">
        <p>
          We don't memorize logic; we discover it. 
          Use the <strong className="text-blue-400">Truth Table Builder</strong> to map out the behavior of different gates by testing all possible inputs.
        </p>
      </InfoCard>

      <TruthTableBuilder />

      <div className="w-full h-px bg-slate-800" />

      <InfoCard title="Level 3: Physical Reality" icon="🔬">
        <p>In modern chips, these gates are built from <strong className="text-amber-400">Transistors</strong> (MOSFETs) and packaged into ICs.</p>
      </InfoCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TransistorDemo />
        <ICChipDemo />
      </div>

      <div className="w-full h-px bg-slate-800" />

      <InfoCard title="Level 4: From Logic to Arithmetic" icon="🧮">
        <p>We can use logic to do math. A <strong className="text-emerald-400">Half Adder</strong> uses XOR for the sum and AND for the carry.</p>
      </InfoCard>

      <HalfAdder />
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { InfoCard, ToggleSwitch, LED } from './Shared';

// ============================================
// SR LATCH VISUALIZER
// ============================================
const SRLatch = () => {
  const [s, setS] = useState(false);
  const [r, setR] = useState(false);
  const [q, setQ] = useState(false); // Initial state 0
  
  // Logic: NOR-based SR Latch
  // If S=1, R=0 -> Q=1
  // If S=0, R=1 -> Q=0
  // If S=0, R=0 -> Hold Q
  // If S=1, R=1 -> Invalid (Simulate 0 for safety)
  
  useEffect(() => {
    if (s && !r) setQ(true);
    else if (!s && r) setQ(false);
    else if (s && r) setQ(false); // Invalid state handling
  }, [s, r]);

  const qBar = !q;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-16">
        <ToggleSwitch on={s} onChange={setS} label="SET (S)" />
        <ToggleSwitch on={r} onChange={setR} label="RESET (R)" />
      </div>

      <div className="relative w-full max-w-lg h-64 bg-[#1e293b] rounded-xl border border-slate-700 shadow-xl overflow-hidden">
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,6 L9,3 z" fill="#475569" />
            </marker>
          </defs>
          
          {/* Top NOR (Q) */}
          <rect x="200" y="40" width="60" height="40" rx="4" fill="#334155" stroke="#475569" strokeWidth="2" />
          <text x="230" y="65" fill="white" textAnchor="middle" fontSize="12" fontWeight="bold">NOR</text>
          
          {/* Bottom NOR (QBar) */}
          <rect x="200" y="160" width="60" height="40" rx="4" fill="#334155" stroke="#475569" strokeWidth="2" />
          <text x="230" y="185" fill="white" textAnchor="middle" fontSize="12" fontWeight="bold">NOR</text>

          {/* S Input Line */}
          <path d="M 50 50 L 200 50" stroke={s ? '#fbbf24' : '#475569'} strokeWidth="3" />
          
          {/* R Input Line */}
          <path d="M 50 190 L 200 190" stroke={r ? '#fbbf24' : '#475569'} strokeWidth="3" />

          {/* Feedback Lines (The Magic) */}
          {/* From Q output to Bottom Input */}
          <path d="M 260 60 L 350 60 L 350 120 L 160 120 L 160 170 L 200 170" 
            stroke={q ? '#34d399' : '#475569'} strokeWidth="3" fill="none" 
            strokeDasharray={q ? "0" : "5,5"} 
            className="transition-all duration-300"
          />
          
          {/* From QBar output to Top Input */}
          <path d="M 260 180 L 320 180 L 320 110 L 180 110 L 180 70 L 200 70" 
            stroke={qBar ? '#34d399' : '#475569'} strokeWidth="3" fill="none"
            strokeDasharray={qBar ? "0" : "5,5"}
            className="transition-all duration-300"
          />

          {/* Outputs */}
          <path d="M 350 60 L 450 60" stroke={q ? '#34d399' : '#475569'} strokeWidth="3" />
          <path d="M 320 180 L 450 180" stroke={qBar ? '#34d399' : '#475569'} strokeWidth="3" />
        </svg>

        {/* Labels */}
        <div className="absolute top-[50px] right-[20px] flex items-center gap-2">
          <span className={`text-xl font-mono font-bold ${q ? 'text-emerald-400' : 'text-slate-600'}`}>Q</span>
          <LED on={q} color="green" />
        </div>
        <div className="absolute bottom-[50px] right-[20px] flex items-center gap-2">
          <span className={`text-xl font-mono font-bold ${qBar ? 'text-emerald-400' : 'text-slate-600'}`}>Q̅</span>
          <LED on={qBar} color="red" />
        </div>
      </div>
      
      <div className="text-sm text-slate-400 max-w-md text-center">
        The feedback loops (crossing wires) allow the circuit to <strong className="text-amber-300">hold</strong> its state when inputs are off.
      </div>
    </div>
  );
};

// ============================================
// D FLIP FLOP
// ============================================
const DFlipFlop = () => {
  const [d, setD] = useState(false);
  const [clk, setClk] = useState(false);
  const [q, setQ] = useState(false);
  
  // Edge detection requires referencing previous clock state, 
  // but in React event handlers, we just check if we are toggling TO true.
  const handleClockToggle = () => {
    const nextClk = !clk;
    setClk(nextClk);
    if (nextClk === true) {
      // Rising Edge! Capture D.
      setQ(d);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 bg-black/20 p-6 rounded-2xl border border-white/5">
      <div className="flex gap-12 items-end">
        <ToggleSwitch on={d} onChange={setD} label="DATA (D)" />
        
        <div className="flex flex-col items-center gap-2">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">CLOCK</div>
          <button 
            onMouseDown={() => { if (!clk) handleClockToggle(); }}
            onMouseUp={() => { if (clk) handleClockToggle(); }}
            className={`w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all active:scale-95
              ${clk 
                ? 'bg-amber-500 border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.5)]' 
                : 'bg-slate-800 border-slate-600'
              }
            `}
          >
            <span className="text-2xl font-black text-white/90">CLK</span>
          </button>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">OUTPUT (Q)</div>
          <div className={`w-20 h-20 rounded-xl flex items-center justify-center border-2 transition-all duration-200
            ${q 
              ? 'bg-emerald-900/50 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)]' 
              : 'bg-slate-900 border-slate-700'
            }
          `}>
            <span className={`text-4xl font-mono font-bold ${q ? 'text-emerald-400' : 'text-slate-600'}`}>
              {q ? '1' : '0'}
            </span>
          </div>
        </div>
      </div>

      <div className="w-full bg-[#111] h-24 rounded-lg border border-slate-800 relative overflow-hidden flex items-center">
        {/* Signal Visualization */}
        <div className="absolute left-4 text-xs font-mono text-gray-500">
          <div>D: {d ? '1' : '0'}</div>
          <div className="mt-2">C: {clk ? '1' : '0'}</div>
        </div>
        
        {/* Abstract timing diagram */}
        <svg className="w-full h-full" preserveAspectRatio="none">
           <path d="M 0 30 L 100 30 L 100 10 L 200 10 L 200 30 L 300 30" stroke="#334155" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" />
           <path d="M 0 70 L 50 70 L 50 50 L 150 50 L 150 70 L 250 70" stroke="#334155" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" />
           
           {/* Active Edge Indicator */}
           {clk && (
             <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4,4" className="opacity-50" />
           )}
        </svg>
        
        {clk && <div className="absolute inset-0 flex items-center justify-center text-amber-500 font-bold text-sm bg-black/50 backdrop-blur-sm">RISING EDGE DETECTED</div>}
      </div>
    </div>
  );
};

// ============================================
// 8-BIT REGISTER
// ============================================
const Register8Bit = () => {
  const [data, setData] = useState<number>(0); // Input switches
  const [stored, setStored] = useState<number>(0); // Stored value
  const [clk, setClk] = useState(false);

  const toggleInputBit = (idx: number) => {
    setData(prev => prev ^ (1 << idx));
  };

  const pulseClock = () => {
    setClk(true);
    setStored(data); // Capture immediately on "rising edge" simulation
    setTimeout(() => setClk(false), 200);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row items-center gap-8 justify-center bg-slate-900 p-6 rounded-xl border border-slate-700">
        
        {/* Input Bus */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-xs text-gray-500 font-mono tracking-widest">DATA BUS (INPUT)</div>
          <div className="flex gap-1">
            {[7,6,5,4,3,2,1,0].map(i => {
              const bit = (data >> i) & 1;
              return (
                <button 
                  key={i} 
                  onClick={() => toggleInputBit(i)}
                  className={`w-8 h-12 rounded border transition-all
                    ${bit ? 'bg-amber-500 border-amber-300' : 'bg-slate-800 border-slate-600'}
                  `}
                >
                  <span className="text-xs font-mono font-bold text-black/50">{bit}</span>
                </button>
              )
            })}
          </div>
          <div className="font-mono text-amber-500">{data}</div>
        </div>

        {/* Control Logic */}
        <div className="flex flex-col items-center justify-center">
           <button 
             onClick={pulseClock}
             className={`w-16 h-16 rounded-full border-4 flex items-col items-center justify-center transition-all active:scale-95 shadow-lg
               ${clk ? 'bg-red-500 border-red-300 scale-95' : 'bg-slate-700 border-slate-500'}
             `}
           >
             <div className="text-center leading-none">
               <div className="text-xs font-bold text-white/50">WRITE</div>
               <div className="text-lg font-black text-white">CLK</div>
             </div>
           </button>
           <div className={`h-1 w-full mt-4 transition-colors ${clk ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-slate-800'}`} />
        </div>

        {/* Output Register */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-xs text-gray-500 font-mono tracking-widest">REGISTER (STORED)</div>
          <div className="flex gap-1">
            {[7,6,5,4,3,2,1,0].map(i => {
              const bit = (stored >> i) & 1;
              return (
                <div 
                  key={i} 
                  className={`w-8 h-12 rounded border transition-all flex items-center justify-center
                    ${bit 
                      ? 'bg-emerald-500 border-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.4)]' 
                      : 'bg-slate-900 border-slate-700 opacity-50'
                    }
                  `}
                >
                  <span className={`text-xs font-mono font-bold ${bit ? 'text-black/50' : 'text-white/20'}`}>{bit}</span>
                </div>
              )
            })}
          </div>
          <div className="font-mono text-emerald-500">{stored}</div>
        </div>

      </div>
    </div>
  );
};

// ============================================
// RAM VISUALIZER
// ============================================
const RAMVisualizer = () => {
  const [memory, setMemory] = useState<number[]>(new Array(16).fill(0));
  const [address, setAddress] = useState(0); // 4-bit Address
  const [dataIn, setDataIn] = useState(0);   // 8-bit Data
  
  const toggleAddressBit = (idx: number) => setAddress(prev => prev ^ (1 << idx));
  const toggleDataBit = (idx: number) => setDataIn(prev => prev ^ (1 << idx));
  
  const write = () => {
    const newMem = [...memory];
    newMem[address] = dataIn;
    setMemory(newMem);
  };

  const readVal = memory[address];

  return (
    <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-xl flex flex-col md:flex-row gap-8">
      
      {/* Controls */}
      <div className="flex flex-col gap-6 items-center">
        {/* Address Selection */}
        <div className="flex flex-col items-center gap-2 p-4 bg-slate-800 rounded-lg border border-slate-600">
          <div className="text-xs font-mono text-purple-400 uppercase tracking-widest">Address Bus (4-bit)</div>
          <div className="flex gap-2">
            {[3,2,1,0].map(i => {
              const bit = (address >> i) & 1;
              return (
                <button key={i} onClick={() => toggleAddressBit(i)} className={`w-8 h-10 rounded border text-sm font-bold ${bit ? 'bg-purple-500 border-purple-300 text-white' : 'bg-slate-900 border-slate-700 text-slate-500'}`}>
                  {bit}
                </button>
              );
            })}
          </div>
          <div className="font-mono text-purple-300">Addr: {address} (0x{address.toString(16).toUpperCase()})</div>
        </div>

        {/* Data Input */}
        <div className="flex flex-col items-center gap-2 p-4 bg-slate-800 rounded-lg border border-slate-600">
          <div className="text-xs font-mono text-blue-400 uppercase tracking-widest">Data Input (8-bit)</div>
          <div className="flex gap-1">
            {[7,6,5,4,3,2,1,0].map(i => {
              const bit = (dataIn >> i) & 1;
              return (
                <button key={i} onClick={() => toggleDataBit(i)} className={`w-6 h-8 rounded border text-xs font-bold ${bit ? 'bg-blue-500 border-blue-300 text-white' : 'bg-slate-900 border-slate-700 text-slate-500'}`}>
                  {bit}
                </button>
              );
            })}
          </div>
          <div className="font-mono text-blue-300">Val: {dataIn}</div>
        </div>

        <button onClick={write} className="w-full py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-500 active:scale-95 transition-all shadow-lg border-b-4 border-red-800 active:border-b-0 active:translate-y-1">
          WRITE to Memory
        </button>
      </div>

      {/* Memory Grid */}
      <div className="flex-1 bg-black p-4 rounded-lg border border-slate-700 grid grid-cols-4 gap-2 content-start">
        {memory.map((val, idx) => {
          const isActive = idx === address;
          return (
            <div key={idx} className={`p-2 rounded border flex flex-col items-center transition-all ${isActive ? 'bg-purple-900/50 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)] scale-105 z-10' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
              <div className="text-[9px] font-mono opacity-50 mb-1">0x{idx.toString(16).toUpperCase()}</div>
              <div className={`font-mono font-bold text-lg ${isActive ? 'text-white' : ''}`}>
                {val.toString(16).toUpperCase().padStart(2,'0')}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Readout */}
      <div className="flex flex-col items-center justify-center p-4 bg-slate-800 rounded-lg border border-slate-600 min-w-[120px]">
         <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest mb-2">Read Output</div>
         <div className="text-4xl font-mono text-emerald-400 font-bold">{readVal.toString(16).toUpperCase().padStart(2,'0')}</div>
         <div className="text-xs text-emerald-600 mt-1">Decimal: {readVal}</div>
      </div>

    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
export const Pillar3: React.FC = () => {
  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-2">Pillar 3: State & Memory</h2>
        <p className="text-slate-400">How do we remember? From feedback loops to RAM.</p>
      </div>

      <InfoCard title="Level 1: Intuition" icon="💡">
        <p>Memory is <strong className="text-amber-300">feedback</strong>. Like a light switch, it stays in its last state. We build this by feeding a gate's output back into itself.</p>
      </InfoCard>

      <InfoCard title="Level 2: The SR Latch" icon="🔁">
        <p>The simplest memory. Two stable states. <strong className="text-emerald-400">Set</strong> forces 1, <strong className="text-red-400">Reset</strong> forces 0.</p>
      </InfoCard>

      <SRLatch />

      <div className="w-full h-px bg-slate-800" />

      <InfoCard title="Level 3: Synchronous Logic" icon="⏱️">
        <p>We need control. The <strong className="text-amber-300">D Flip-Flop</strong> only updates exactly when the clock signal rises (0 → 1). This synchronizes the whole computer.</p>
      </InfoCard>

      <DFlipFlop />

      <div className="w-full h-px bg-slate-800" />

      <InfoCard title="Level 4: Registers" icon="💾">
        <p>Group flip-flops together to store numbers. An 8-bit register stores a byte. This is how the CPU holds data.</p>
      </InfoCard>

      <Register8Bit />

      <div className="w-full h-px bg-slate-800" />

      <InfoCard title="Level 5: RAM (Random Access Memory)" icon="🏢">
        <p>
          By arranging memory cells in a grid, we can access any piece of data by its <strong className="text-purple-400">Address</strong>. 
          This is the "Warehouse" of the computer.
        </p>
      </InfoCard>

      <RAMVisualizer />
    </div>
  );
};

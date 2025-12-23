import React, { useState, useEffect, useRef } from 'react';
import { InfoCard, LED } from './Shared';

// ============================================
// LEVEL 1: THE MUSIC BOX (INTUITION)
// ============================================
const MusicBoxDemo = () => {
  const [playing, setPlaying] = useState(false);
  const [tick, setTick] = useState(0);
  
  // A simple "program" encoded as bumps
  // 1 = note, 0 = silence
  // Rows are time steps, Cols are notes (C, E, G, High C)
  const cylinder = [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
    [0, 0, 1, 0],
    [0, 1, 0, 0],
    [1, 0, 0, 1], // Chord
    [0, 0, 0, 0],
  ];

  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setTick(t => (t + 1) % cylinder.length);
    }, 500);
    return () => clearInterval(interval);
  }, [playing]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-4">
        <button 
          onClick={() => setPlaying(!playing)}
          className={`px-6 py-2 rounded-full font-bold transition-all ${playing ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}
        >
          {playing ? 'STOP CRANKING' : 'TURN CRANK'}
        </button>
      </div>

      <div className="relative p-8 bg-[#2a1b12] rounded-xl border-4 border-[#5c3a21] shadow-2xl flex flex-col items-center">
        {/* The Comb */}
        <div className="flex gap-4 mb-2 z-20">
          {['C', 'E', 'G', 'C'].map((note, i) => {
            const isActive = cylinder[tick][i] === 1;
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div 
                  className={`w-4 h-16 rounded-b transition-all duration-100 border border-slate-400
                    ${isActive 
                      ? 'bg-amber-300 translate-y-1 shadow-[0_0_15px_gold]' 
                      : 'bg-slate-300'
                    }`} 
                />
                <span className="text-xs font-mono text-[#d4a574] font-bold">{note}</span>
              </div>
            );
          })}
        </div>

        {/* The Cylinder */}
        <div className="relative w-64 h-32 bg-gradient-to-r from-[#4d331f] via-[#8b5e3c] to-[#4d331f] rounded-lg overflow-hidden border-y-4 border-[#3e2716] shadow-inner">
           {/* Rows of bumps */}
           <div 
             className="absolute top-0 left-0 w-full transition-transform duration-500 ease-linear"
             style={{ transform: `translateY(${-tick * 32 + 40}px)` }}
           >
             {[...cylinder, ...cylinder, ...cylinder].map((row, rIdx) => (
                <div key={rIdx} className="h-8 flex justify-center gap-8 items-center border-b border-white/5">
                  {row.map((bit, cIdx) => (
                    <div key={cIdx} className={`w-2 h-2 rounded-full ${bit ? 'bg-amber-200 shadow-sm' : 'bg-transparent opacity-20'}`} />
                  ))}
                </div>
             ))}
           </div>
           
           {/* Read Head Line */}
           <div className="absolute top-[46px] left-0 w-full h-px bg-red-500/50 z-10" />
        </div>
        
        <div className="absolute -right-4 top-1/2 w-8 h-24 border-4 border-[#8b5e3c] bg-[#2a1b12] rounded-r-lg" />
        {playing && <div className="absolute -right-8 top-1/2 w-2 h-24 bg-white/20 animate-spin" />}
      </div>
      
      <p className="text-slate-400 text-sm italic max-w-md text-center">
        The mechanism doesn't know the song. The <strong className="text-amber-400">program</strong> (bumps) controls the machine.
      </p>
    </div>
  );
};

// ============================================
// LEVEL 2-3: CPU SIMULATOR
// ============================================

// Instruction Set Architecture definitions
const OPCODES = {
  0x0: { name: 'HALT', desc: 'Stop' },
  0x1: { name: 'LOAD', desc: 'Reg[A] = Mem[addr]' }, // LOAD R_A, [Addr] (Addr = B<<4 | C)
  0x2: { name: 'STORE', desc: 'Mem[addr] = Reg[A]' }, // STORE R_A, [Addr]
  0x3: { name: 'ADD', desc: 'Reg[A] = Reg[B] + Reg[C]' },
  0x4: { name: 'SUB', desc: 'Reg[A] = Reg[B] - Reg[C]' },
  0x5: { name: 'JUMP', desc: 'PC = addr' },
  0x6: { name: 'JZ', desc: 'If Z=1, PC = addr' },
  0x7: { name: 'JNZ', desc: 'If Z=0, PC = addr' },
};

const PROGRAMS = {
  'addition': {
    name: "Simple Addition",
    desc: "Load two numbers from memory, add them, store result.",
    code: [
      0x1080, // LOAD R0, [0x80]
      0x1181, // LOAD R1, [0x81]
      0x3201, // ADD R2, R0, R1
      0x2282, // STORE R2, [0x82]
      0x0000, // HALT
    ],
    data: { 0x80: 25, 0x81: 17 }
  },
  'loop': {
    name: "Count Down Loop",
    desc: "Start at 5, subtract 1 until zero. (Looping)",
    code: [
      0x1080, // LOAD R0, [0x80]  (Counter = 5)
      0x1181, // LOAD R1, [0x81]  (Constant 1)
      // Loop Label: Addr 0x04
      0x4001, // SUB R0, R0, R1   (Counter -= 1)
      0x2082, // STORE R0, [0x82] (Update memory to see it)
      0x7004, // JNZ 0x04         (If not zero, jump back to SUB)
      0x0000, // HALT
    ],
    data: { 0x80: 5, 0x81: 1 }
  }
};

const CPUSimulator = () => {
  const [registers, setRegisters] = useState([0, 0, 0, 0]);
  const [pc, setPc] = useState(0);
  const [memory, setMemory] = useState<number[]>(new Array(256).fill(0));
  const [ir, setIr] = useState(0); // Instruction Register
  const [phase, setPhase] = useState<'IDLE' | 'FETCH' | 'DECODE' | 'EXECUTE'>('IDLE');
  const [zeroFlag, setZeroFlag] = useState(false);
  const [activeProg, setActiveProg] = useState('addition');
  const [msg, setMsg] = useState("Ready.");

  // Helper to load program
  const loadProgram = (progKey: string) => {
    const prog = PROGRAMS[progKey as keyof typeof PROGRAMS];
    const newMem = new Array(256).fill(0);
    
    // Load code
    prog.code.forEach((inst, i) => {
      newMem[i * 2] = (inst >> 8) & 0xFF;
      newMem[i * 2 + 1] = inst & 0xFF;
    });
    
    // Load data
    Object.entries(prog.data).forEach(([addr, val]) => {
      newMem[parseInt(addr)] = val;
    });

    setMemory(newMem);
    setPc(0);
    setRegisters([0, 0, 0, 0]);
    setZeroFlag(false);
    setPhase('IDLE');
    setMsg("Program Loaded. Click Step.");
    setIr(0);
  };

  useEffect(() => loadProgram('addition'), []);

  const step = () => {
    if (phase === 'IDLE' || phase === 'EXECUTE') {
      // FETCH STAGE
      setPhase('FETCH');
      const high = memory[pc];
      const low = memory[pc + 1];
      const inst = (high << 8) | low;
      setIr(inst);
      setMsg(`Fetching from 0x${pc.toString(16).toUpperCase().padStart(2,'0')}...`);
    } 
    else if (phase === 'FETCH') {
      // DECODE STAGE
      setPhase('DECODE');
      setPc(prev => prev + 2); // Increment PC
      const opcode = (ir >> 12) & 0xF;
      const opName = OPCODES[opcode as keyof typeof OPCODES]?.name || "UNKNOWN";
      setMsg(`Decoding: ${opName} (Op: ${opcode})`);
    }
    else if (phase === 'DECODE') {
      // EXECUTE STAGE
      setPhase('EXECUTE');
      const opcode = (ir >> 12) & 0xF;
      const a = (ir >> 8) & 0xF;
      const b = (ir >> 4) & 0xF;
      const c = ir & 0xF;
      
      let newRegs = [...registers];
      let newMem = [...memory];
      let newZ = zeroFlag;
      let newPc = pc;
      let log = "";

      switch(opcode) {
        case 0x0: // HALT
          log = "Halted.";
          setPhase('IDLE'); // Stop cycling
          break;
        case 0x1: // LOAD
          const addrL = (b << 4) | c;
          newRegs[a] = newMem[addrL];
          log = `Loaded ${newMem[addrL]} from [0x${addrL.toString(16)}] into R${a}`;
          break;
        case 0x2: // STORE
          const addrS = (b << 4) | c;
          newMem[addrS] = newRegs[a];
          log = `Stored R${a} (${newRegs[a]}) into [0x${addrS.toString(16)}]`;
          break;
        case 0x3: // ADD
          newRegs[a] = (newRegs[b] + newRegs[c]) & 0xFF; // 8-bit wrap
          newZ = newRegs[a] === 0;
          log = `R${a} = R${b} + R${c} = ${newRegs[a]}`;
          break;
        case 0x4: // SUB
          newRegs[a] = (newRegs[b] - newRegs[c]) & 0xFF;
          newZ = newRegs[a] === 0;
          log = `R${a} = R${b} - R${c} = ${newRegs[a]}`;
          break;
        case 0x5: // JUMP
          const jumpAddr = (a << 8) | (b << 4) | c; // 12-bit address possible
          newPc = jumpAddr;
          log = `Jumped to 0x${jumpAddr.toString(16)}`;
          break;
        case 0x6: // JZ
          if (zeroFlag) {
             const jzAddr = (a << 8) | (b << 4) | c;
             newPc = jzAddr;
             log = "Zero flag is SET. Jumping.";
          } else {
             log = "Zero flag NOT set. No jump.";
          }
          break;
        case 0x7: // JNZ
          if (!zeroFlag) {
             const jnzAddr = (a << 8) | (b << 4) | c;
             newPc = jnzAddr;
             log = "Zero flag NOT set. Jumping.";
          } else {
             log = "Zero flag is SET. No jump.";
          }
          break;
        default:
          log = "Unknown Opcode";
      }

      setRegisters(newRegs);
      setMemory(newMem);
      setZeroFlag(newZ);
      setPc(newPc);
      setMsg(log);
    }
  };

  return (
    <div className="bg-[#1e1e1e] p-6 rounded-2xl border border-slate-700 shadow-2xl font-mono text-sm max-w-4xl mx-auto">
      
      {/* Controls Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 border-b border-slate-700 pb-4">
        <div className="flex gap-2">
          {Object.entries(PROGRAMS).map(([key, prog]) => (
            <button
              key={key}
              onClick={() => { setActiveProg(key); loadProgram(key); }}
              className={`px-3 py-1 rounded text-xs uppercase font-bold border ${activeProg === key ? 'bg-amber-500 text-black border-amber-400' : 'bg-slate-800 text-slate-400 border-slate-600'}`}
            >
              {prog.name}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={() => loadProgram(activeProg)} className="px-4 py-2 bg-red-900/50 text-red-200 border border-red-800 rounded hover:bg-red-800/50">RESET</button>
          <button onClick={step} className="px-6 py-2 bg-emerald-600 text-white border-b-4 border-emerald-800 rounded hover:bg-emerald-500 active:border-b-0 active:translate-y-1">
            STEP 
            <span className="ml-2 text-[10px] opacity-70 block sm:inline">
              {phase === 'FETCH' ? '(Decode)' : phase === 'DECODE' ? '(Execute)' : '(Fetch)'}
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: CPU Internals */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Status Display */}
          <div className="bg-black/50 p-4 rounded-lg border border-slate-600 flex justify-between items-center h-16">
             <div className="text-amber-400 font-bold text-lg">{msg}</div>
             <div className="flex gap-2">
               <div className={`px-2 py-1 rounded text-xs ${phase === 'FETCH' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500'}`}>FETCH</div>
               <div className={`px-2 py-1 rounded text-xs ${phase === 'DECODE' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-500'}`}>DECODE</div>
               <div className={`px-2 py-1 rounded text-xs ${phase === 'EXECUTE' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-500'}`}>EXECUTE</div>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Registers */}
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-600 relative">
              <div className="text-xs text-slate-400 mb-2 uppercase tracking-widest">Registers</div>
              {registers.map((val, i) => (
                <div key={i} className="flex justify-between items-center border-b border-slate-700 py-1 last:border-0">
                  <span className="text-slate-500">R{i}</span>
                  <span className={`font-bold text-lg transition-colors ${phase === 'EXECUTE' ? 'text-white' : 'text-emerald-400'}`}>{val}</span>
                </div>
              ))}
              {/* Flags */}
              <div className="mt-4 pt-2 border-t border-slate-700 flex justify-between">
                <span className="text-xs text-slate-400">ZERO FLAG (Z)</span>
                <LED on={zeroFlag} color="red" size="small" />
              </div>
            </div>

            {/* Control Unit / PC / IR */}
            <div className="space-y-4">
               <div className={`bg-slate-800 p-4 rounded-lg border transition-all ${phase === 'FETCH' ? 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'border-slate-600'}`}>
                 <div className="text-xs text-slate-400 mb-1">PROGRAM COUNTER (PC)</div>
                 <div className="text-2xl font-bold text-blue-400">0x{pc.toString(16).toUpperCase().padStart(2,'0')}</div>
               </div>

               <div className={`bg-slate-800 p-4 rounded-lg border transition-all ${phase === 'DECODE' ? 'border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'border-slate-600'}`}>
                 <div className="text-xs text-slate-400 mb-1">INSTRUCTION REGISTER (IR)</div>
                 <div className="text-xl font-bold text-purple-400 mb-1">
                   {ir.toString(16).toUpperCase().padStart(4,'0')}
                 </div>
                 <div className="text-xs text-slate-500">
                   Op:{((ir >> 12) & 0xF).toString(16)} A:{((ir >> 8) & 0xF).toString(16)} B:{((ir >> 4) & 0xF).toString(16)} C:{(ir & 0xF).toString(16)}
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Right Column: Memory View */}
        <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden flex flex-col h-[400px]">
          <div className="bg-slate-800 p-2 text-xs font-bold text-slate-400 text-center uppercase tracking-widest border-b border-slate-700">Main Memory</div>
          <div className="overflow-y-auto flex-1 p-2 space-y-0.5 custom-scrollbar">
            {Array.from({length: 132}).map((_, i) => { // Only showing first chunk for performance/UI
               const isPC = i === pc || i === pc + 1;
               const isDataRegion = i >= 0x80;
               // Render lines of 2 bytes to match instruction width loosely
               if (i % 2 !== 0) return null;
               
               const val1 = memory[i];
               const val2 = memory[i+1];
               const isPcRow = (i === pc);

               return (
                 <div key={i} className={`flex items-center text-xs p-1 rounded ${isPcRow ? 'bg-blue-900/50 border border-blue-500/50' : 'hover:bg-white/5'}`}>
                   <span className="w-10 text-slate-500 opacity-70">{i.toString(16).toUpperCase().padStart(2,'0')}</span>
                   <span className={`w-8 text-center ${isPcRow ? 'text-white font-bold' : 'text-slate-300'}`}>{val1.toString(16).toUpperCase().padStart(2,'0')}</span>
                   <span className={`w-8 text-center ${isPcRow ? 'text-white font-bold' : 'text-slate-300'}`}>{val2.toString(16).toUpperCase().padStart(2,'0')}</span>
                   
                   {isDataRegion && (val1 !== 0 || val2 !== 0) && <span className="ml-2 text-[10px] text-amber-500 opacity-70">DATA</span>}
                   {i < 0x20 && (val1 !== 0 || val2 !== 0) && <span className="ml-2 text-[10px] text-emerald-500 opacity-70">CODE</span>}
                 </div>
               )
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

// ============================================
// LEVEL 4: THE STACK VISUALIZER
// ============================================
const StackVisualizer = () => {
  const [stack, setStack] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  const push = () => {
    if (stack.length >= 8) {
      setMessage("Stack Overflow! (Too full)");
      return;
    }
    const items = ['🍎', '🍌', '🍒', '💎', '📦', '💿', '💾', '📄'];
    const newItem = items[Math.floor(Math.random() * items.length)];
    setStack(prev => [...prev, newItem]);
    setMessage(`Pushed ${newItem}`);
  };

  const pop = () => {
    if (stack.length === 0) {
      setMessage("Stack Underflow! (Empty)");
      return;
    }
    const popped = stack[stack.length - 1];
    setStack(prev => prev.slice(0, -1));
    setMessage(`Popped ${popped}`);
  };

  const peek = () => {
    if (stack.length === 0) {
      setMessage("Stack is Empty");
      return;
    }
    setMessage(`Peeked: ${stack[stack.length - 1]}`);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-12">
      <div className="flex flex-col gap-4">
        <button onClick={push} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow-lg flex items-center justify-center gap-2">
          <span>⬇️</span> Push
        </button>
        <button onClick={pop} className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold shadow-lg flex items-center justify-center gap-2">
          <span>⬆️</span> Pop
        </button>
        <button onClick={peek} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-lg flex items-center justify-center gap-2">
          <span>👁️</span> Peek
        </button>
        <div className="mt-2 h-8 text-sm text-center text-slate-400 italic bg-black/20 rounded flex items-center justify-center px-2">
          {message}
        </div>
      </div>

      {/* The Stack Container */}
      <div className="relative w-32 h-64 border-x-4 border-b-4 border-slate-600 rounded-b-xl bg-black/20 flex flex-col-reverse items-center p-2 gap-1 overflow-hidden">
        {stack.map((item, index) => (
          <div key={index} className="w-full h-10 bg-slate-800 border border-slate-500 rounded flex items-center justify-center text-2xl shadow-md animate-[slideDown_0.2s_ease-out]">
            {item}
          </div>
        ))}
        {stack.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-600 font-bold uppercase tracking-widest text-xs pointer-events-none">
            Empty
          </div>
        )}
      </div>
      
      <div className="w-48 text-sm text-slate-400">
        <h4 className="text-white font-bold mb-2">LIFO Rule</h4>
        <p>The last item you put in is the <em>only</em> one you can take out. This abstraction powers function calls: when <code className="bg-slate-800 px-1 rounded">main()</code> calls <code className="bg-slate-800 px-1 rounded">add()</code>, we push context. When <code className="bg-slate-800 px-1 rounded">add()</code> finishes, we pop back to <code className="bg-slate-800 px-1 rounded">main()</code>.</p>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
export const Pillar4: React.FC = () => {
  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-2">Pillar 4: The Stored Program</h2>
        <p className="text-slate-400">The machine that changes itself. How instructions become action.</p>
      </div>

      <InfoCard title="Level 1: The Music Box" icon="🎼">
        <p>
          A computer is like a programmable music box. The <strong className="text-amber-300">hardware</strong> (the comb) never changes. 
          The <strong className="text-emerald-400">software</strong> (the cylinder) tells it what to do. Change the cylinder, change the song.
        </p>
      </InfoCard>

      <MusicBoxDemo />

      <div className="w-full h-px bg-slate-800" />

      <InfoCard title="Level 2-3: The CPU" icon="⚙️">
        <p>
          The <strong className="text-blue-400">Fetch-Decode-Execute</strong> cycle is the heartbeat of the computer. 
          Step through the simulator below to see how bits in memory drive the processor.
        </p>
      </InfoCard>

      <CPUSimulator />

      <div className="w-full h-px bg-slate-800" />

      <InfoCard title="Level 4: The Stack" icon="🥞">
        <p>
          How do functions know where to return? The <strong className="text-emerald-400">Stack</strong> remembers for them.
          It's a simple LIFO (Last-In, First-Out) memory structure.
        </p>
      </InfoCard>

      <StackVisualizer />
    </div>
  );
};

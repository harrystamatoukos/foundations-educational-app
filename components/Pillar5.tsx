import React, { useState, useEffect, useRef } from 'react';
import { InfoCard, LED } from './Shared';

// ============================================
// LEVEL 1: THE TURING MACHINE
// ============================================

type Direction = 'L' | 'R';
type Transition = { write: string; move: Direction; next: string };
type Rules = Record<string, Record<string, Transition>>;

const TM_PROGRAMS = {
  incrementer: {
    name: "Binary Incrementer",
    desc: "Adds 1 to a binary number.",
    initialTape: "_1011_",
    startState: "start",
    rules: {
      "start": {
        "0": { write: "0", move: "R", next: "start" },
        "1": { write: "1", move: "R", next: "start" },
        "_": { write: "_", move: "L", next: "add" }
      },
      "add": {
        "0": { write: "1", move: "L", next: "done" },
        "1": { write: "0", move: "L", next: "add" }, // Carry
        "_": { write: "1", move: "L", next: "done" }  // New digit
      },
      "done": {
        "0": { write: "0", move: "L", next: "done" },
        "1": { write: "1", move: "L", next: "done" },
        "_": { write: "_", move: "R", next: "halt" }
      }
    } as Rules
  },
  beaver: {
    name: "Busy Beaver (3-State)",
    desc: "Writes as many 1s as possible and halts. Complex behavior from simple rules.",
    initialTape: "_______",
    startState: "A",
    rules: {
      "A": {
        "0": { write: "1", move: "R", next: "B" },
        "1": { write: "1", move: "R", next: "H" }
      },
      "B": {
        "0": { write: "0", move: "R", next: "C" },
        "1": { write: "1", move: "R", next: "B" }
      },
      "C": {
        "0": { write: "1", move: "L", next: "C" },
        "1": { write: "1", move: "L", next: "A" }
      }
    } as Rules
  }
};

const TuringMachineViz = () => {
  const [activeProg, setActiveProg] = useState<keyof typeof TM_PROGRAMS>('incrementer');
  const [tape, setTape] = useState<Record<number, string>>({});
  const [head, setHead] = useState(0);
  const [state, setState] = useState("");
  const [stepCount, setStepCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState("Ready");

  // Load program
  useEffect(() => {
    reset(activeProg);
  }, [activeProg]);

  const reset = (progKey: keyof typeof TM_PROGRAMS) => {
    const prog = TM_PROGRAMS[progKey];
    const initialTape: Record<number, string> = {};
    prog.initialTape.split('').forEach((char, i) => {
      initialTape[i] = char;
    });
    setTape(initialTape);
    setHead(0);
    setState(prog.startState);
    setStepCount(0);
    setIsRunning(false);
    setStatus("Ready");
  };

  // Run loop
  useEffect(() => {
    let interval: number;
    if (isRunning) {
      interval = window.setInterval(step, 100);
    }
    return () => clearInterval(interval);
  }, [isRunning, tape, head, state]);

  const step = () => {
    const prog = TM_PROGRAMS[activeProg];
    
    // Check halt
    if (state === 'halt' || state === 'H') {
      setIsRunning(false);
      setStatus("Halted.");
      return;
    }

    const currentSymbol = tape[head] || "_";
    const transition = prog.rules[state]?.[currentSymbol];

    if (!transition) {
      setIsRunning(false);
      setStatus(`Crashed: No transition for State '${state}', Symbol '${currentSymbol}'`);
      return;
    }

    // Apply transition
    const newTape = { ...tape };
    newTape[head] = transition.write;
    setTape(newTape);
    setHead(prev => prev + (transition.move === 'R' ? 1 : -1));
    setState(transition.next);
    setStepCount(prev => prev + 1);
    setStatus("Running...");
  };

  // Render Tape Helper
  const renderTape = () => {
    const cells = [];
    const windowRadius = 6;
    for (let i = head - windowRadius; i <= head + windowRadius; i++) {
      const val = tape[i] || "_";
      cells.push(
        <div key={i} className={`
          w-10 h-12 flex items-center justify-center border border-slate-600 font-mono text-lg
          ${i === head ? 'bg-amber-500 text-black font-bold shadow-[0_0_15px_rgba(245,158,11,0.5)] z-10 scale-110' : 'bg-slate-800 text-slate-400'}
        `}>
          {val}
        </div>
      );
    }
    return cells;
  };

  return (
    <div className="bg-[#1e1e2e] p-6 rounded-2xl border border-slate-700 shadow-xl max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 border-b border-slate-700 pb-4">
        <div className="flex gap-2">
          {Object.entries(TM_PROGRAMS).map(([key, prog]) => (
            <button
              key={key}
              onClick={() => setActiveProg(key as any)}
              className={`px-3 py-1 rounded text-xs uppercase font-bold border ${activeProg === key ? 'bg-indigo-500 text-white border-indigo-400' : 'bg-slate-800 text-slate-400 border-slate-600'}`}
            >
              {prog.name}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={() => reset(activeProg)} className="px-4 py-2 bg-slate-700 text-slate-300 border border-slate-600 rounded hover:bg-slate-600">RESET</button>
          <button onClick={step} className="px-4 py-2 bg-emerald-600 text-white border border-emerald-500 rounded hover:bg-emerald-500">STEP</button>
          <button onClick={() => setIsRunning(!isRunning)} className={`px-4 py-2 rounded border font-bold ${isRunning ? 'bg-red-500 border-red-400' : 'bg-blue-600 border-blue-500'}`}>
            {isRunning ? 'STOP' : 'RUN'}
          </button>
        </div>
      </div>

      {/* Machine Display */}
      <div className="flex flex-col gap-6">
        
        {/* Status */}
        <div className="flex justify-between items-center text-mono bg-black/30 p-3 rounded border border-white/5">
           <div className="flex gap-4">
             <div>STATE: <span className="text-amber-400 font-bold">{state}</span></div>
             <div>STEPS: <span className="text-emerald-400">{stepCount}</span></div>
           </div>
           <div className="text-slate-400 text-xs italic">{status}</div>
        </div>

        {/* Tape */}
        <div className="relative h-20 bg-black/50 rounded-lg border-y-4 border-slate-600 flex items-center justify-center overflow-hidden">
           <div className="flex gap-1">
             {renderTape()}
           </div>
           {/* Head Pointer */}
           <div className="absolute top-0 bottom-0 left-1/2 w-0.5 -translate-x-1/2 bg-red-500/50 pointer-events-none" />
           <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-amber-500" />
        </div>

        {/* Description */}
        <div className="text-center text-slate-400 text-sm italic">
          {TM_PROGRAMS[activeProg].desc}
        </div>

      </div>
    </div>
  );
};

// ============================================
// LEVEL 2: DIAGONALIZATION (HALTING PROBLEM)
// ============================================

const DiagonalizationViz = () => {
  // 5x5 Grid of random Halt/Loop
  const [grid, setGrid] = useState<boolean[][]>([]);
  
  useEffect(() => {
    // Generate random grid
    const newGrid = Array(5).fill(0).map(() => 
      Array(5).fill(0).map(() => Math.random() > 0.5)
    );
    setGrid(newGrid);
  }, []);

  const regenerate = () => {
    setGrid(grid.map(row => row.map(() => Math.random() > 0.5)));
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="grid grid-cols-6 gap-2 text-sm font-mono">
        {/* Header Row */}
        <div className="flex items-center justify-center text-slate-500 italic">M \ I</div>
        {[1,2,3,4,5].map(i => <div key={i} className="flex items-center justify-center text-slate-400 font-bold">In {i}</div>)}

        {/* Rows */}
        {grid.map((row, rIdx) => (
          <React.Fragment key={rIdx}>
            <div className="flex items-center justify-end pr-2 text-slate-400 font-bold">Mach {rIdx + 1}</div>
            {row.map((halts, cIdx) => {
              const isDiagonal = rIdx === cIdx;
              return (
                <div key={cIdx} className={`
                  w-12 h-12 flex items-center justify-center border rounded transition-all duration-500
                  ${halts 
                    ? 'bg-emerald-900/30 border-emerald-500/30 text-emerald-400' 
                    : 'bg-red-900/30 border-red-500/30 text-red-400'
                  }
                  ${isDiagonal ? 'ring-2 ring-amber-400 z-10 scale-105 font-bold shadow-lg' : ''}
                `}>
                  {halts ? 'H' : 'L'}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      <div className="relative p-6 bg-slate-900 rounded-xl border border-dashed border-amber-500/50 max-w-lg w-full">
        <div className="absolute -top-3 left-4 bg-slate-900 px-2 text-amber-500 text-xs font-bold uppercase tracking-widest">The Nemesis Machine</div>
        
        <div className="flex justify-between items-center mb-4">
           <span className="text-slate-400 text-sm">Action: <strong className="text-white">Flip the Diagonal</strong></span>
           <button onClick={regenerate} className="text-xs text-blue-400 hover:text-blue-300">Randomize Grid</button>
        </div>

        <div className="flex gap-2 justify-center">
           <div className="w-16 flex items-center justify-end text-slate-500 font-mono text-sm pr-2">???</div>
           {grid.map((row, i) => {
             const diagonalVal = row[i];
             const flipped = !diagonalVal;
             return (
                <div key={i} className={`
                  w-12 h-12 flex items-center justify-center border rounded font-bold shadow-[0_0_15px_rgba(0,0,0,0.5)]
                  ${flipped
                    ? 'bg-emerald-500 text-black border-emerald-400' 
                    : 'bg-red-500 text-black border-red-400'
                  }
                `}>
                  {flipped ? 'H' : 'L'}
                </div>
             );
           })}
        </div>

        <p className="mt-6 text-xs text-slate-400 leading-relaxed text-center">
          The machine "???" behaves differently from <strong className="text-white">Machine 1</strong> on Input 1.<br/>
          It differs from <strong className="text-white">Machine 2</strong> on Input 2.<br/>
          It differs from <strong className="text-white">Machine N</strong> on Input N.<br/>
          <span className="text-amber-400 block mt-2 font-bold">Therefore, "???" cannot be any machine in the list.</span>
        </p>
      </div>
    </div>
  );
};

// ============================================
// LEVEL 3: DECIDABILITY MAP
// ============================================
const DecidabilityMap = () => {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [placements, setPlacements] = useState<Record<string, 'green' | 'yellow' | 'red' | null>>({});

  const problems = [
    { id: 'sort', label: 'Sorting List', correct: 'green' },
    { id: 'prime', label: 'Is Prime?', correct: 'green' },
    { id: 'halt', label: 'Halting Problem', correct: 'red' },
    { id: 'chess', label: 'Perfect Chess', correct: 'green' }, // Finite game, technically decidable
    { id: 'tm_acc', label: 'TM Acceptance', correct: 'yellow' }, // Semi-decidable
    { id: 'equiv', label: 'Program Equivalence', correct: 'red' },
  ];

  const handleDragStart = (id: string) => setDraggedItem(id);
  
  const handleDrop = (zone: 'green' | 'yellow' | 'red') => {
    if (draggedItem) {
      setPlacements(prev => ({ ...prev, [draggedItem]: zone }));
      setDraggedItem(null);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-4 justify-center flex-wrap min-h-[60px]">
        {problems.map(p => {
          if (placements[p.id]) return null; // Already placed
          return (
            <div 
              key={p.id}
              draggable
              onDragStart={() => handleDragStart(p.id)}
              className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg cursor-grab active:cursor-grabbing border border-slate-500 shadow-lg"
            >
              {p.label}
            </div>
          );
        })}
        {Object.keys(placements).length === problems.length && (
          <button onClick={() => setPlacements({})} className="text-sm text-slate-400 hover:text-white underline">
            Reset Game
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-64">
        {/* Decidable Zone */}
        <div 
          className="bg-emerald-900/20 border-2 border-emerald-500/30 rounded-xl p-4 flex flex-col items-center gap-2 transition-colors hover:bg-emerald-900/30"
          onDragOver={e => e.preventDefault()}
          onDrop={() => handleDrop('green')}
        >
          <div className="text-emerald-400 font-bold uppercase tracking-widest text-xs mb-2">Decidable (Green)</div>
          <div className="text-center text-[10px] text-emerald-600 mb-4">Algorithm always finishes with Yes/No.</div>
          {problems.filter(p => placements[p.id] === 'green').map(p => (
            <div key={p.id} className={`px-3 py-1 rounded text-sm w-full text-center ${p.correct === 'green' ? 'bg-emerald-600 text-white' : 'bg-red-500 text-white line-through'}`}>
              {p.label}
            </div>
          ))}
        </div>

        {/* Semi-Decidable Zone */}
        <div 
          className="bg-yellow-900/20 border-2 border-yellow-500/30 rounded-xl p-4 flex flex-col items-center gap-2 transition-colors hover:bg-yellow-900/30"
          onDragOver={e => e.preventDefault()}
          onDrop={() => handleDrop('yellow')}
        >
          <div className="text-yellow-400 font-bold uppercase tracking-widest text-xs mb-2">Semi-Decidable (Yellow)</div>
          <div className="text-center text-[10px] text-yellow-600 mb-4">Halts on 'Yes', but might loop forever on 'No'.</div>
          {problems.filter(p => placements[p.id] === 'yellow').map(p => (
            <div key={p.id} className={`px-3 py-1 rounded text-sm w-full text-center ${p.correct === 'yellow' ? 'bg-yellow-600 text-black' : 'bg-red-500 text-white line-through'}`}>
              {p.label}
            </div>
          ))}
        </div>

        {/* Undecidable Zone */}
        <div 
          className="bg-red-900/20 border-2 border-red-500/30 rounded-xl p-4 flex flex-col items-center gap-2 transition-colors hover:bg-red-900/30"
          onDragOver={e => e.preventDefault()}
          onDrop={() => handleDrop('red')}
        >
          <div className="text-red-400 font-bold uppercase tracking-widest text-xs mb-2">Undecidable (Red)</div>
          <div className="text-center text-[10px] text-red-600 mb-4">Impossible. No algorithm can exist.</div>
          {problems.filter(p => placements[p.id] === 'red').map(p => (
            <div key={p.id} className={`px-3 py-1 rounded text-sm w-full text-center ${p.correct === 'red' ? 'bg-red-600 text-white' : 'bg-red-500 text-white line-through'}`}>
              {p.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
export const Pillar5: React.FC = () => {
  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-2">Pillar 5: Computability & Limits</h2>
        <p className="text-slate-400">The boundary of the possible. What can be computed?</p>
      </div>

      <InfoCard title="Level 1: The Turing Machine" icon="📼">
        <p>
          In 1936, Alan Turing defined the <strong className="text-amber-300">Turing Machine</strong>: an infinite tape, a read/write head, and a state register. 
          Surprisingly, this simple machine can compute <em className="text-emerald-400">anything</em> that any modern supercomputer can.
        </p>
      </InfoCard>

      <TuringMachineViz />

      <div className="w-full h-px bg-slate-800" />

      <InfoCard title="Level 2: The Halting Problem" icon="🛑">
        <p>
          Can we write a program that checks if <em>any</em> program halts? <strong className="text-red-400">No.</strong> 
          Using a technique called <strong className="text-amber-300">Diagonalization</strong>, we can prove some problems are unsolvable.
        </p>
      </InfoCard>

      <DiagonalizationViz />
      
      <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 text-center max-w-2xl mx-auto">
         <div className="text-4xl mb-4">🤯</div>
         <h3 className="text-lg font-bold text-white mb-2">The Perfect Debugger is Impossible</h3>
         <p className="text-slate-400 text-sm">
           If a program existed that could solve the Halting Problem, we could feed it to itself and create a paradox. 
           Thus, there are fundamental limits to what can be computed.
         </p>
      </div>

      <div className="w-full h-px bg-slate-800" />

      <InfoCard title="Level 3: The Landscape of Solvability" icon="🗺️">
        <p>
          Not all problems are created equal. Some are easy, some are hard, and some are impossible. 
          Drag the problems below to categorize them.
        </p>
      </InfoCard>

      <DecidabilityMap />
    </div>
  );
};

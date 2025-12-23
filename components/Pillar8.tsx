import React, { useState, useEffect, useRef } from 'react';
import { InfoCard, ToggleSwitch, LED } from './Shared';

// ============================================
// LEVEL 1: THE RACE CONDITION (BANK)
// ============================================
const RaceConditionDemo = () => {
  const [balance, setBalance] = useState(100);
  const [history, setHistory] = useState<string[]>([]);
  const [atm1State, setAtm1State] = useState<{ step: number, local: number | null, status: string }>({ step: 0, local: null, status: 'Idle' });
  const [atm2State, setAtm2State] = useState<{ step: number, local: number | null, status: string }>({ step: 0, local: null, status: 'Idle' });
  const [running, setRunning] = useState(false);
  const [useLock, setUseLock] = useState(false);
  const [lockHolder, setLockHolder] = useState<string | null>(null);

  const reset = () => {
    setBalance(100);
    setHistory([]);
    setAtm1State({ step: 0, local: null, status: 'Idle' });
    setAtm2State({ step: 0, local: null, status: 'Idle' });
    setRunning(false);
    setLockHolder(null);
  };

  const runScenario = async () => {
    if (running) return;
    setRunning(true);
    setHistory([]);
    setAtm1State({ step: 0, local: null, status: 'Ready' });
    setAtm2State({ step: 0, local: null, status: 'Ready' });
    
    // We will interleave operations artificially to demonstrate the concepts
    
    const log = (msg: string) => setHistory(prev => [...prev, msg]);

    // Scenario Sequence (steps)
    // Safe Mode: T1 runs fully, then T2
    // Unsafe Mode: T1 Read, T2 Read, T1 Write, T2 Write
    
    if (useLock) {
      // SAFE EXECUTION
      // T1
      setLockHolder('ATM 1');
      setAtm1State({ step: 1, local: null, status: 'Acquired Lock' }); await wait(800);
      
      const bal1 = balance; 
      setAtm1State({ step: 2, local: bal1, status: `Read Balance: $${bal1}` }); await wait(800);
      
      const newBal1 = bal1 - 50;
      setAtm1State({ step: 3, local: newBal1, status: `Calc: $${bal1} - 50 = $${newBal1}` }); await wait(800);
      
      setBalance(newBal1);
      setAtm1State({ step: 4, local: newBal1, status: `Write Balance: $${newBal1}` }); 
      log(`ATM 1 withdrew $50. Balance: $${newBal1}`); await wait(800);
      
      setLockHolder(null);
      setAtm1State({ step: 5, local: null, status: 'Released Lock' }); await wait(800);

      // T2
      setLockHolder('ATM 2');
      setAtm2State({ step: 1, local: null, status: 'Acquired Lock' }); await wait(800);
      
      const bal2 = newBal1; // Actually reads current state
      setAtm2State({ step: 2, local: bal2, status: `Read Balance: $${bal2}` }); await wait(800);
      
      const newBal2 = bal2 - 30;
      setAtm2State({ step: 3, local: newBal2, status: `Calc: $${bal2} - 30 = $${newBal2}` }); await wait(800);
      
      setBalance(newBal2);
      setAtm2State({ step: 4, local: newBal2, status: `Write Balance: $${newBal2}` }); 
      log(`ATM 2 withdrew $30. Balance: $${newBal2}`); await wait(800);
      
      setLockHolder(null);
      setAtm2State({ step: 5, local: null, status: 'Released Lock' });

    } else {
      // RACE CONDITION EXECUTION
      // 1. T1 Read
      const startBal = balance;
      setAtm1State({ step: 1, local: startBal, status: `Read Balance: $${startBal}` }); await wait(800);
      
      // 2. T2 Read (Interleaved!)
      setAtm2State({ step: 1, local: startBal, status: `Read Balance: $${startBal}` }); await wait(800);
      
      // 3. T1 Calc
      const t1Calc = startBal - 50;
      setAtm1State({ step: 2, local: t1Calc, status: `Calc: $${startBal} - 50 = $${t1Calc}` }); await wait(800);
      
      // 4. T2 Calc
      const t2Calc = startBal - 30;
      setAtm2State({ step: 2, local: t2Calc, status: `Calc: $${startBal} - 30 = $${t2Calc}` }); await wait(800);
      
      // 5. T1 Write
      setBalance(t1Calc);
      log(`ATM 1 withdrew $50. Balance: $${t1Calc}`);
      setAtm1State({ step: 3, local: t1Calc, status: `Write: $${t1Calc}` }); await wait(800);
      
      // 6. T2 Write (Overwrites!)
      setBalance(t2Calc);
      log(`ATM 2 withdrew $30. Balance: $${t2Calc}`);
      setAtm2State({ step: 3, local: t2Calc, status: `Write: $${t2Calc}` }); 
      
      log("❌ LOST UPDATE DETECTED!");
    }
    
    setRunning(false);
  };

  const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-xl">
        {/* Central State */}
        <div className="flex justify-center mb-8">
          <div className="bg-black/40 p-4 rounded-xl border border-slate-600 flex flex-col items-center min-w-[200px]">
            <div className="text-xs text-slate-400 font-mono uppercase tracking-widest mb-1">SHARED MEMORY</div>
            <div className={`text-4xl font-mono font-bold ${balance < 0 ? 'text-red-500' : 'text-emerald-400'}`}>
              ${balance}
            </div>
            {lockHolder && <div className="mt-2 text-xs bg-red-900/50 text-red-200 px-2 py-1 rounded border border-red-500/50">🔒 Locked by {lockHolder}</div>}
          </div>
        </div>

        {/* Threads */}
        <div className="grid grid-cols-2 gap-8">
          {/* ATM 1 */}
          <div className={`p-4 rounded-xl border-2 transition-all ${atm1State.step > 0 ? 'bg-slate-800 border-blue-500' : 'bg-slate-800/50 border-slate-700'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-blue-400">ATM 1 (-$50)</span>
              {atm1State.local !== null && <span className="text-xs font-mono bg-blue-900/50 px-2 py-1 rounded">Local: {atm1State.local}</span>}
            </div>
            <div className="text-sm text-slate-300 font-mono h-6">{atm1State.status}</div>
            {/* Steps Visual */}
            <div className="flex gap-1 mt-3">
              {[1,2,3,4].map(s => (
                <div key={s} className={`h-1 flex-1 rounded ${atm1State.step >= s ? 'bg-blue-500' : 'bg-slate-700'}`} />
              ))}
            </div>
          </div>

          {/* ATM 2 */}
          <div className={`p-4 rounded-xl border-2 transition-all ${atm2State.step > 0 ? 'bg-slate-800 border-purple-500' : 'bg-slate-800/50 border-slate-700'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-purple-400">ATM 2 (-$30)</span>
              {atm2State.local !== null && <span className="text-xs font-mono bg-purple-900/50 px-2 py-1 rounded">Local: {atm2State.local}</span>}
            </div>
            <div className="text-sm text-slate-300 font-mono h-6">{atm2State.status}</div>
            {/* Steps Visual */}
            <div className="flex gap-1 mt-3">
              {[1,2,3,4].map(s => (
                <div key={s} className={`h-1 flex-1 rounded ${atm2State.step >= s ? 'bg-purple-500' : 'bg-slate-700'}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mt-8 border-t border-slate-700 pt-4">
          <div className="flex items-center gap-4">
            <ToggleSwitch on={useLock} onChange={setUseLock} label="USE LOCKS (MUTEX)" orientation="horizontal" />
          </div>
          <div className="flex gap-3">
            <button onClick={reset} disabled={running} className="px-4 py-2 text-slate-400 hover:text-white disabled:opacity-50">Reset</button>
            <button 
              onClick={runScenario} 
              disabled={running}
              className={`px-6 py-2 rounded font-bold text-white shadow-lg transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                ${useLock ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-red-600 hover:bg-red-500'}
              `}
            >
              {running ? 'Processing...' : 'Run Transaction'}
            </button>
          </div>
        </div>
        
        {/* Log */}
        {history.length > 0 && (
          <div className="mt-4 bg-black/50 p-3 rounded font-mono text-xs text-slate-400">
            {history.map((h, i) => <div key={i}>{h}</div>)}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// LEVEL 2: DEADLOCK (CHEFS)
// ============================================
const DeadlockDemo = () => {
  const [chef1, setChef1] = useState<{ hasSalt: boolean, hasPepper: boolean, status: string }>({ hasSalt: false, hasPepper: false, status: 'Thinking' });
  const [chef2, setChef2] = useState<{ hasSalt: boolean, hasPepper: boolean, status: string }>({ hasSalt: false, hasPepper: false, status: 'Thinking' });
  const [saltAvailable, setSaltAvailable] = useState(true);
  const [pepperAvailable, setPepperAvailable] = useState(true);
  const [isDeadlocked, setIsDeadlocked] = useState(false);
  const [solved, setSolved] = useState(false); // Ordered locking fix

  const reset = () => {
    setChef1({ hasSalt: false, hasPepper: false, status: 'Thinking' });
    setChef2({ hasSalt: false, hasPepper: false, status: 'Thinking' });
    setSaltAvailable(true);
    setPepperAvailable(true);
    setIsDeadlocked(false);
  };

  // React State is async, so "Step" above is tricky to write perfectly cleanly in one function body for both.
  // Let's execute specific distinct steps based on a counter to force the scenario.
  const [sequenceStep, setSequenceStep] = useState(0);

  const advance = () => {
    if (isDeadlocked) return;
    
    // SCENARIO: DEADLOCK
    if (!solved) {
      if (sequenceStep === 0) {
        // Chef 1 takes Salt
        setSaltAvailable(false);
        setChef1({ hasSalt: true, hasPepper: false, status: 'Took Salt. Needs Pepper.' });
        setSequenceStep(1);
      } else if (sequenceStep === 1) {
        // Chef 2 takes Pepper
        setPepperAvailable(false);
        setChef2({ hasSalt: false, hasPepper: true, status: 'Took Pepper. Needs Salt.' });
        setSequenceStep(2);
      } else if (sequenceStep === 2) {
        // Both try to take the other
        setChef1(p => ({ ...p, status: 'WAITING for Pepper (Held by Chef 2)' }));
        setChef2(p => ({ ...p, status: 'WAITING for Salt (Held by Chef 1)' }));
        setIsDeadlocked(true);
      }
    } 
    // SCENARIO: ORDERED LOCKING (FIX)
    else {
      if (sequenceStep === 0) {
        // Chef 1 takes Salt (Resource 1)
        setSaltAvailable(false);
        setChef1({ hasSalt: true, hasPepper: false, status: 'Took Salt. Needs Pepper.' });
        setSequenceStep(1);
      } else if (sequenceStep === 1) {
        // Chef 2 tries to take Salt (Resource 1) -- BLOCKED
        setChef2({ hasSalt: false, hasPepper: false, status: 'Wants Salt. Blocked by Chef 1.' });
        setSequenceStep(2);
      } else if (sequenceStep === 2) {
        // Chef 1 takes Pepper (Resource 2) -- SUCCESS
        setPepperAvailable(false);
        setChef1({ hasSalt: true, hasPepper: true, status: 'COOKING! (Has both)' });
        setSequenceStep(3);
      } else if (sequenceStep === 3) {
        // Chef 1 Finishes, Releases
        setSaltAvailable(true);
        setPepperAvailable(true);
        setChef1({ hasSalt: false, hasPepper: false, status: 'Done.' });
        setSequenceStep(4);
      } else if (sequenceStep === 4) {
        // Chef 2 can now proceed
        setSaltAvailable(false);
        setChef2({ hasSalt: true, hasPepper: false, status: 'Took Salt. Needs Pepper.' });
        setSequenceStep(5);
      } else if (sequenceStep === 5) {
        setPepperAvailable(false);
        setChef2({ hasSalt: true, hasPepper: true, status: 'COOKING! (Has both)' });
        setSequenceStep(6);
      }
    }
  };

  const resetSim = () => {
    reset();
    setSequenceStep(0);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center bg-slate-900 p-4 rounded-xl border border-slate-700">
        <div className="flex gap-4">
          <button 
            onClick={() => { setSolved(false); resetSim(); }}
            className={`px-4 py-2 rounded text-sm font-bold border transition-colors ${!solved ? 'bg-red-900/30 border-red-500 text-red-400' : 'bg-slate-800 border-slate-600 text-slate-400'}`}
          >
            Scenario A: Deadlock
          </button>
          <button 
            onClick={() => { setSolved(true); resetSim(); }}
            className={`px-4 py-2 rounded text-sm font-bold border transition-colors ${solved ? 'bg-emerald-900/30 border-emerald-500 text-emerald-400' : 'bg-slate-800 border-slate-600 text-slate-400'}`}
          >
            Scenario B: Ordering Fix
          </button>
        </div>
        <button 
          onClick={advance}
          disabled={isDeadlocked || sequenceStep > 5}
          className="px-6 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDeadlocked ? 'DEADLOCKED' : sequenceStep > 5 ? 'FINISHED' : 'Step Simulation'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-8 relative min-h-[200px]">
        {/* Resources in the middle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-4 z-10">
          <div className={`w-16 h-16 rounded-full bg-slate-800 border-2 flex items-center justify-center text-3xl shadow-xl transition-all ${saltAvailable ? 'border-white opacity-100 scale-100' : 'border-slate-600 opacity-20 scale-75'}`}>
            🧂
          </div>
          <div className={`w-16 h-16 rounded-full bg-slate-800 border-2 flex items-center justify-center text-3xl shadow-xl transition-all ${pepperAvailable ? 'border-white opacity-100 scale-100' : 'border-slate-600 opacity-20 scale-75'}`}>
            🌶️
          </div>
        </div>

        {/* Chef 1 */}
        <div className={`p-6 rounded-xl border-2 flex flex-col items-center gap-4 transition-colors ${chef1.status.includes('COOKING') ? 'bg-emerald-900/20 border-emerald-500' : 'bg-slate-900 border-slate-700'}`}>
          <div className="text-5xl">👨‍🍳</div>
          <div className="font-bold text-slate-300">Chef 1</div>
          <div className="flex gap-2 min-h-[32px]">
            {chef1.hasSalt && <span className="text-2xl">🧂</span>}
            {chef1.hasPepper && <span className="text-2xl">🌶️</span>}
          </div>
          <div className={`text-xs font-mono text-center p-2 rounded w-full ${chef1.status.includes('WAITING') ? 'bg-red-900/50 text-red-200 animate-pulse' : 'bg-black/30 text-slate-400'}`}>
            {chef1.status}
          </div>
        </div>

        {/* Chef 2 */}
        <div className={`p-6 rounded-xl border-2 flex flex-col items-center gap-4 transition-colors ${chef2.status.includes('COOKING') ? 'bg-emerald-900/20 border-emerald-500' : 'bg-slate-900 border-slate-700'}`}>
          <div className="text-5xl">👩‍🍳</div>
          <div className="font-bold text-slate-300">Chef 2</div>
          <div className="flex gap-2 min-h-[32px]">
            {chef2.hasSalt && <span className="text-2xl">🧂</span>}
            {chef2.hasPepper && <span className="text-2xl">🌶️</span>}
          </div>
          <div className={`text-xs font-mono text-center p-2 rounded w-full ${chef2.status.includes('WAITING') ? 'bg-red-900/50 text-red-200 animate-pulse' : 'bg-black/30 text-slate-400'}`}>
            {chef2.status}
          </div>
        </div>
      </div>
      
      {isDeadlocked && (
        <div className="bg-red-500 text-white p-3 rounded font-bold text-center animate-bounce">
          ⚠️ DEADLOCK! Both hold one, waiting for the other. Neither can proceed.
        </div>
      )}
    </div>
  );
};

// ============================================
// LEVEL 3: PRODUCER - CONSUMER (QUEUE)
// ============================================
const ProducerConsumerDemo = () => {
  const [queue, setQueue] = useState<string[]>([]);
  const capacity = 5;
  const [producerState, setProducerState] = useState('Idle');
  const [consumerState, setConsumerState] = useState('Idle');
  
  // Simulation Loop
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly decide if producer tries to act
      if (Math.random() > 0.5) {
        setQueue(prev => {
          if (prev.length < capacity) {
            setProducerState('Produced 🍣');
            return [...prev, '🍣'];
          } else {
            setProducerState('Blocked (Full)');
            return prev;
          }
        });
      } else {
        setProducerState('Working...');
      }

      // Randomly decide if consumer tries to act
      if (Math.random() > 0.5) {
        setQueue(prev => {
          if (prev.length > 0) {
            setConsumerState('Ate 🍣');
            return prev.slice(1);
          } else {
            setConsumerState('Blocked (Empty)');
            return prev;
          }
        });
      } else {
        setConsumerState('Digesting...');
      }
    }, 800); // Slow tick

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex w-full items-center justify-between gap-4">
        {/* Producer */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-4xl">👨‍🍳</div>
          <div className="font-bold text-slate-300 text-sm">Producer</div>
          <div className={`text-xs px-2 py-1 rounded font-mono ${producerState.includes('Blocked') ? 'bg-red-900/50 text-red-200' : 'bg-slate-800 text-emerald-400'}`}>
            {producerState}
          </div>
        </div>

        {/* The Queue (Conveyor Belt) */}
        <div className="flex-1 h-24 bg-slate-900 rounded-lg border-y-4 border-slate-700 flex items-center px-4 gap-2 overflow-hidden relative">
          {/* Belt texture */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(90deg,transparent_50%,#000_50%)] bg-[length:20px_100%] animate-[moveRight_1s_linear_infinite]" />
          
          {queue.map((item, i) => (
            <div key={i} className="text-3xl animate-[popIn_0.3s_ease-out] relative z-10">
              {item}
            </div>
          ))}
          
          {/* Capacity markers */}
          <div className="absolute bottom-1 right-2 text-[10px] text-slate-500 font-mono">
            {queue.length}/{capacity}
          </div>
        </div>

        {/* Consumer */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-4xl">😋</div>
          <div className="font-bold text-slate-300 text-sm">Consumer</div>
          <div className={`text-xs px-2 py-1 rounded font-mono ${consumerState.includes('Blocked') ? 'bg-amber-900/50 text-amber-200' : 'bg-slate-800 text-blue-400'}`}>
            {consumerState}
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes moveRight { from { background-position: 0 0; } to { background-position: 20px 0; } }
        @keyframes popIn { from { transform: scale(0); } to { transform: scale(1); } }
      `}</style>
      
      <p className="text-sm text-slate-400 max-w-lg text-center">
        The queue acts as a buffer. The Chef doesn't need to hand sushi directly to the Customer. 
        They only wait if the belt is completely full or completely empty.
      </p>
    </div>
  );
};

// ============================================
// LEVEL 4: PARALLEL SPEEDUP
// ============================================
const ParallelSpeedup = () => {
  const [workers, setWorkers] = useState(1);
  const [tasks, setTasks] = useState<boolean[]>(new Array(100).fill(false));
  const [running, setRunning] = useState(false);
  const [time, setTime] = useState(0);
  
  // Theoretical Amdahl curve data
  const amdahlPoints = Array.from({length: 20}, (_, i) => {
    const w = i + 1;
    // Assuming 5% serial portion
    const p = 0.95;
    const speedup = 1 / ((1-p) + (p/w));
    return { w, s: speedup };
  });

  useEffect(() => {
    if (running) {
      const interval = setInterval(() => {
        setTime(t => t + 1);
        setTasks(prev => {
          // Process 'workers' number of tasks per tick
          let done = 0;
          const next = [...prev];
          for (let i = 0; i < next.length; i++) {
            if (!next[i]) {
              next[i] = true;
              done++;
              if (done >= workers) break;
            }
          }
          if (next.every(t => t)) setRunning(false);
          return next;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [running, workers]);

  const start = () => {
    setTasks(new Array(100).fill(false));
    setTime(0);
    setRunning(true);
  };

  return (
    <div className="flex flex-col gap-8 bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-xl">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <label className="text-sm font-bold text-slate-400">Workers:</label>
          <input 
            type="range" min="1" max="16" value={workers} onChange={e => setWorkers(parseInt(e.target.value))}
            className="w-32 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <span className="text-xl font-mono text-white">{workers}</span>
        </div>
        <button 
          onClick={start} 
          disabled={running}
          className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold disabled:opacity-50"
        >
          {running ? 'Processing...' : 'Start Job'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Task Grid */}
        <div className="flex flex-col gap-2">
          <div className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">100 Tasks</div>
          <div className="grid grid-cols-10 gap-1 bg-black/40 p-2 rounded-lg border border-slate-700 h-48 content-start">
            {tasks.map((done, i) => (
              <div key={i} className={`w-full h-3 rounded-sm transition-colors duration-200 ${done ? 'bg-emerald-500' : 'bg-slate-800'}`} />
            ))}
          </div>
          <div className="text-right text-mono text-xl font-bold text-white">Time: {time} ticks</div>
        </div>

        {/* Amdahl's Graph */}
        <div className="flex flex-col gap-2">
          <div className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">Theoretical Speedup (Amdahl's Law)</div>
          <div className="relative w-full h-48 bg-black/40 rounded-lg border border-slate-700 flex items-end px-4 pb-4">
             {amdahlPoints.map((pt, i) => (
               <div key={i} className="flex-1 flex flex-col justify-end items-center group relative">
                 <div 
                   className={`w-2 rounded-t ${pt.w === workers ? 'bg-blue-500' : 'bg-slate-700'}`} 
                   style={{ height: `${(pt.s / 16) * 100}%` }}
                 />
                 <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-slate-800 text-xs px-2 py-1 rounded text-white pointer-events-none whitespace-nowrap z-10">
                   {pt.w} workers: {pt.s.toFixed(1)}x
                 </div>
               </div>
             ))}
             {/* Curve line approx */}
             <svg className="absolute inset-0 pointer-events-none" preserveAspectRatio="none">
               <path 
                 d={`M 0 100 ${amdahlPoints.map((pt, i) => `L ${(i/19)*100}% ${100 - (pt.s/16)*100}%`).join(' ')}`}
                 stroke="#475569" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke"
               />
             </svg>
          </div>
          <p className="text-xs text-slate-500 text-center">
            Adding workers helps, but diminishing returns kick in due to serial parts of the code.
          </p>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
export const Pillar8: React.FC = () => {
  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-2">Pillar 8: Concurrency & Coordination</h2>
        <p className="text-slate-400">Managing chaos when multiple things happen at once.</p>
      </div>

      <InfoCard title="Level 1: The Race Condition" icon="🏎️">
        <p>
          When two processes share memory without coordination, data gets corrupted. 
          Here, two ATMs try to withdraw from the same account. Without a <strong className="text-amber-400">Lock</strong>, the bank loses money.
        </p>
      </InfoCard>

      <RaceConditionDemo />

      <div className="w-full h-px bg-slate-800" />

      <InfoCard title="Level 2: The Deadlock" icon="🔒">
        <p>
          Coordination is dangerous. If everyone waits for a resource someone else holds, the system freezes.
          <strong className="text-red-400"> Deadlock</strong> happens when there is a cycle of dependency.
        </p>
      </InfoCard>

      <DeadlockDemo />

      <div className="w-full h-px bg-slate-800" />

      <InfoCard title="Level 3: Producer-Consumer" icon="🍣">
        <p>
          Instead of direct handoffs, we can use a <strong className="text-blue-400">Queue</strong> to decouple workers.
          The producer fills the buffer; the consumer empties it. They only wait when the buffer hits its limits.
        </p>
      </InfoCard>

      <ProducerConsumerDemo />

      <div className="w-full h-px bg-slate-800" />

      <InfoCard title="Level 4: Parallelism & Speedup" icon="⚡">
        <p>
          Adding more workers speeds things up, but not infinitely. <strong className="text-purple-400">Amdahl's Law</strong> shows us that the serial part of a task limits the maximum speedup.
        </p>
      </InfoCard>

      <ParallelSpeedup />
    </div>
  );
};

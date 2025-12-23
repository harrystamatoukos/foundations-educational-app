import React, { useState, useEffect, useRef } from 'react';
import { InfoCard, ToggleSwitch, LED } from './Shared';
import { useMastery } from '../contexts/MasteryContext';

// ============================================
// LEVEL 1: INTUITION (THE LIGHTHOUSE)
// ============================================
export const LighthouseDemo: React.FC = () => {
  const [isOn, setIsOn] = useState(false);
  const [toggleCount, setToggleCount] = useState(0);
  const { markComplete } = useMastery();

  const handleToggle = (val: boolean) => {
    setIsOn(val);
    const newCount = toggleCount + 1;
    setToggleCount(newCount);
    
    if (newCount >= 4) {
      markComplete('p1-lighthouse');
    }
  };

  const showHint = toggleCount >= 2;
  const showExplanation = toggleCount >= 5;

  return (
    <div className="space-y-8">
      <div className={`transition-all duration-700 ease-out overflow-hidden ${showExplanation ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <InfoCard title="The Atom of Information" icon="🔦">
          <p>
            You just transmitted a bit. Before you looked, you didn't know the state. 
            Information is the <strong className="text-amber-300">reduction of uncertainty</strong>. 
            The light isn't the information; the <em>distinction</em> between On and Off is.
          </p>
        </InfoCard>
      </div>

      <div className="relative h-80 w-full bg-[#0f172a] rounded-xl overflow-hidden border border-slate-700 shadow-2xl flex flex-col items-center justify-end group">
        {/* Night Sky */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-4 left-10 w-1 h-1 bg-white rounded-full opacity-80" />
          <div className="absolute top-12 right-20 w-1 h-1 bg-white rounded-full opacity-60" />
          <div className="absolute top-20 left-1/3 w-1.5 h-1.5 bg-white rounded-full opacity-90 shadow-[0_0_4px_white]" />
        </div>

        {/* Beam */}
        <div 
          className={`absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] pointer-events-none transition-opacity duration-300 ${isOn ? 'opacity-100' : 'opacity-0'}`}
          style={{
            background: 'conic-gradient(from 225deg at 50% 0%, transparent 0deg, rgba(253, 224, 71, 0.3) 45deg, transparent 90deg)',
            filter: 'blur(20px)',
            transformOrigin: 'top center',
          }}
        />
        
        {/* Glow */}
        <div 
          className={`absolute top-[85px] left-1/2 -translate-x-1/2 w-16 h-16 bg-yellow-300 rounded-full blur-xl transition-opacity duration-200 ${isOn ? 'opacity-80' : 'opacity-0'}`} 
        />

        {/* Lighthouse */}
        <div className="relative z-10 w-48 h-64">
           <svg viewBox="0 0 100 200" className="w-full h-full drop-shadow-2xl">
              <path d="M 20 180 L 80 180 L 70 60 L 30 60 Z" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="2" />
              <path d="M 20 180 L 80 180 L 70 60 L 30 60 Z" fill="url(#stripes)" />
              <defs>
                 <pattern id="stripes" width="10" height="40" patternUnits="userSpaceOnUse">
                    <rect width="100" height="20" fill="#f8fafc" />
                 </pattern>
              </defs>
              <rect x="25" y="55" width="50" height="5" fill="#1e293b" />
              <rect x="35" y="35" width="30" height="20" fill="#94a3b8" opacity="0.5" />
              <rect x="35" y="35" width="30" height="20" stroke="#1e293b" strokeWidth="1" fill="none" />
              <path d="M 30 35 L 50 15 L 70 35 Z" fill="#1e293b" />
              <circle cx="50" cy="45" r="6" fill={isOn ? '#fef08a' : '#475569'} className="transition-colors duration-150" />
           </svg>
        </div>

        {/* Ocean */}
        <div className="absolute bottom-0 w-full h-12 bg-gradient-to-t from-blue-900 to-blue-800 opacity-80 backdrop-blur-sm z-20 flex items-center justify-center border-t border-white/10">
           <div className="flex gap-8">
             <div className="animate-bounce" style={{ animationDuration: '3s' }}>🌊</div>
             <div className="animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>🌊</div>
             <div className="animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}>🌊</div>
           </div>
        </div>
      </div>

      <div className="flex justify-center items-center gap-6 bg-slate-800/50 p-6 rounded-xl border border-slate-700">
        <ToggleSwitch on={isOn} onChange={handleToggle} label="LAMP" />
        <div className="flex flex-col gap-1">
          <div className="text-xs text-gray-400 font-mono uppercase tracking-widest">Information State</div>
          <div className={`text-2xl font-mono font-bold ${isOn ? 'text-amber-400' : 'text-slate-500'}`}>
            {isOn ? '1 (SHIPS)' : '0 (NO SHIPS)'}
          </div>
        </div>
      </div>
      
      {!showExplanation && showHint && (
        <div className="text-center text-slate-500 text-sm italic animate-pulse">
          Click the switch to signal...
        </div>
      )}
    </div>
  );
};

// ============================================
// LEVEL 2: THE TELEGRAPH (ENCODING)
// ============================================
const MORSE_CODE: Record<string, string> = {
  '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E', '..-.': 'F',
  '--.': 'G', '....': 'H', '..': 'I', '.---': 'J', '-.-': 'K', '.-..': 'L',
  '--': 'M', '-.': 'N', '---': 'O', '.--.': 'P', '--.-': 'Q', '.-.': 'R',
  '...': 'S', '-': 'T', '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X',
  '-.--': 'Y', '--..': 'Z',
  '.----': '1', '..---': '2', '...--': '3', '....-': '4', '.....': '5',
  '-....': '6', '--...': '7', '---..': '8', '----.': '9', '-----': '0',
};

export const MorseTelegraph: React.FC = () => {
  const [isPressed, setIsPressed] = useState(false);
  const [buffer, setBuffer] = useState<string>(""); // Current dots/dashes
  const [message, setMessage] = useState<string>(""); // Decoded chars
  const [lastSignalTime, setLastSignalTime] = useState<number>(0);
  const { markComplete } = useMastery();
  
  const pressStartTime = useRef<number>(0);
  const timeoutRef = useRef<number | null>(null);

  const handleMouseDown = () => {
    setIsPressed(true);
    pressStartTime.current = Date.now();
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleMouseUp = () => {
    setIsPressed(false);
    const duration = Date.now() - pressStartTime.current;
    const signal = duration < 250 ? '.' : '-';
    
    setBuffer(prev => prev + signal);
    setLastSignalTime(Date.now());

    // Schedule decode check
    timeoutRef.current = window.setTimeout(() => {
      decodeBuffer();
    }, 800);
  };

  // Helper because setTimeout closure traps state
  const bufferRef = useRef("");
  useEffect(() => { bufferRef.current = buffer; }, [buffer]);

  const decodeBuffer = () => {
    const currentBuffer = bufferRef.current;
    if (!currentBuffer) return;

    const char = MORSE_CODE[currentBuffer] || '?';
    setMessage(prev => (prev + char).slice(-12)); // Keep last 12 chars
    setBuffer("");
    
    // Check mastery condition
    if ((message + char).includes('SOS') || (message + char).includes('HELP')) {
      markComplete('p1-telegraph');
    }
  };

  return (
    <div className="space-y-8">
      <InfoCard title="The Telegraph" icon="📡">
        <p>
          Information needs a <strong className="text-emerald-400">Protocol</strong>. 
          By agreeing that short pulses are dots and long pulses are dashes, we can send complex thoughts over a simple wire.
          <br/><br/>
          <span className="text-xs text-amber-400 font-mono">CHALLENGE: Send "SOS" (... --- ...)</span>
        </p>
      </InfoCard>

      <div className="bg-[#1a1816] p-8 rounded-2xl border-4 border-[#3e2c22] shadow-2xl flex flex-col items-center gap-8 relative overflow-hidden">
        
        {/* Wire Display */}
        <div className="absolute top-8 left-0 w-full flex items-center justify-center pointer-events-none opacity-30">
           <div className={`h-1 w-full transition-all duration-75 ${isPressed ? 'bg-amber-400 shadow-[0_0_20px_orange]' : 'bg-slate-700'}`} />
        </div>

        {/* Receiver Output */}
        <div className="w-full bg-[#eaddcf] text-[#2d2a26] font-mono text-2xl p-4 rounded shadow-inner min-h-[80px] flex flex-col items-center justify-center relative">
           <div className="text-xs text-slate-500 uppercase tracking-widest absolute top-2 left-2">Receiver Tape</div>
           <div className="tracking-[0.5em] font-bold">{message}</div>
           <div className="text-sm text-slate-400 h-6 mt-1">{buffer}</div>
        </div>

        {/* The Key */}
        <button
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => { if (isPressed) handleMouseUp(); }}
          onTouchStart={(e) => { e.preventDefault(); handleMouseDown(); }}
          onTouchEnd={(e) => { e.preventDefault(); handleMouseUp(); }}
          className={`
            relative w-32 h-32 rounded-full border-8 border-[#2a2a2a] shadow-xl transition-transform duration-75 active:scale-95 touch-none
            ${isPressed 
              ? 'bg-gradient-to-br from-amber-600 to-amber-800 shadow-[inset_0_4px_12px_rgba(0,0,0,0.5)] translate-y-1' 
              : 'bg-gradient-to-br from-amber-500 to-amber-700 shadow-[inset_0_2px_8px_rgba(255,255,255,0.2)] -translate-y-1'
            }
          `}
        >
          <div className="absolute inset-0 flex items-center justify-center text-amber-900/40 font-black text-xl select-none pointer-events-none">
            TAP
          </div>
        </button>

        <div className="text-xs text-slate-500 font-mono">
          Short press: Dot (.) • Long press: Dash (-) • Wait: Space
        </div>
      </div>
    </div>
  );
};

// ============================================
// LEVEL 3: BINARY COUNTING
// ============================================
const BitRow = ({ value, onChange, readOnly = false }: { value: number, onChange?: (val: number) => void, readOnly?: boolean }) => {
  const toggleBit = (bitIndex: number) => {
    if (readOnly || !onChange) return;
    const mask = 1 << bitIndex;
    onChange(value ^ mask);
  };

  return (
    <div className="flex gap-2 sm:gap-4 justify-center py-4 bg-slate-900/50 rounded-xl border border-white/5 overflow-x-auto px-4">
      {/* High Nibble */}
      <div className="flex gap-1 sm:gap-2">
        {[7, 6, 5, 4].map(i => {
           const bit = (value >> i) & 1;
           return (
             <div key={i} className="flex flex-col items-center gap-2">
               <span className="text-[9px] text-gray-600 font-mono">{Math.pow(2, i)}</span>
               <div 
                 onClick={() => toggleBit(i)}
                 className={`w-8 h-12 sm:w-10 sm:h-14 rounded cursor-pointer transition-all duration-200 border border-black shadow-lg relative
                   ${bit 
                     ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)] translate-y-0' 
                     : 'bg-slate-800 translate-y-1'
                   }
                 `}
               >
                 <div className={`absolute inset-x-1 top-1 h-[1px] bg-white/20`} />
                 <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-lg text-black/50">
                   {bit}
                 </div>
               </div>
             </div>
           );
        })}
      </div>
      <div className="w-2" />
      {/* Low Nibble */}
      <div className="flex gap-1 sm:gap-2">
        {[3, 2, 1, 0].map(i => {
           const bit = (value >> i) & 1;
           return (
             <div key={i} className="flex flex-col items-center gap-2">
               <span className="text-[9px] text-gray-600 font-mono">{Math.pow(2, i)}</span>
               <div 
                 onClick={() => toggleBit(i)}
                 className={`w-8 h-12 sm:w-10 sm:h-14 rounded cursor-pointer transition-all duration-200 border border-black shadow-lg relative
                   ${bit 
                     ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)] translate-y-0' 
                     : 'bg-slate-800 translate-y-1'
                   }
                 `}
               >
                  <div className={`absolute inset-x-1 top-1 h-[1px] bg-white/20`} />
                  <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-lg text-black/50">
                   {bit}
                 </div>
               </div>
             </div>
           );
        })}
      </div>
    </div>
  );
};

export const BinaryCountingDemo: React.FC = () => {
  const [value, setValue] = useState(0);
  const { markComplete } = useMastery();

  const handleValueChange = (val: number) => {
    setValue(val);
    if (val > 0) markComplete('p1-binary');
  };

  return (
    <div className="space-y-8">
       <InfoCard title="The Binary System" icon="🔢">
        <p>
          We can count anything using just switches. Each position represents a power of 2.
          Toggle the bits below to build larger numbers from simple On/Off states.
        </p>
      </InfoCard>

      <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-700 shadow-xl space-y-6">
        <div className="flex justify-center">
          <div className="bg-[#1a1c1a] p-4 rounded-lg border-4 border-gray-600 shadow-inner">
            <div className="bg-[#9ea792] px-6 py-2 rounded shadow-[inset_0_2px_10px_rgba(0,0,0,0.3)] font-mono text-4xl text-black/80 tracking-widest text-right min-w-[140px] font-bold">
              {value}
            </div>
            <div className="text-center text-[10px] text-gray-500 mt-1 uppercase tracking-widest">Decimal Decoder</div>
          </div>
        </div>

        <BitRow value={value} onChange={handleValueChange} />

        <div className="text-center text-xs text-slate-400 font-mono">
           {Array.from({length: 8}).map((_, i) => {
             const bitIdx = 7 - i;
             const isSet = (value >> bitIdx) & 1;
             const val = Math.pow(2, bitIdx);
             return isSet ? <span key={i} className="mx-1 text-amber-400">+ {val}</span> : null;
           })}
           {value === 0 && <span className="text-slate-600">0 (All bits off)</span>}
           {value > 0 && <span>= {value}</span>}
        </div>
      </div>
    </div>
  );
};

// ============================================
// LEVEL 4: PIXEL ART TRANSMITTER (REPRESENTATION)
// ============================================
export const RepresentationDemo: React.FC = () => {
  // 8x8 Grid flattened to 64 booleans
  const [grid, setGrid] = useState<boolean[]>(new Array(64).fill(false));
  const [rxGrid, setRxGrid] = useState<boolean[]>(new Array(64).fill(false));
  const [transmitting, setTransmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const { markComplete } = useMastery();

  const togglePixel = (idx: number) => {
    if (transmitting) return;
    const newGrid = [...grid];
    newGrid[idx] = !newGrid[idx];
    setGrid(newGrid);
  };

  const transmit = () => {
    setTransmitting(true);
    setProgress(0);
    setRxGrid(new Array(64).fill(false));
  };

  useEffect(() => {
    if (!transmitting) return;

    // Fast transmission simulation
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 64) {
          setTransmitting(false);
          clearInterval(interval);
          markComplete('p1-pixel');
          return 64;
        }
        // "Receive" the bit
        setRxGrid(prev => {
          const next = [...prev];
          next[p] = grid[p];
          return next;
        });
        return p + 1;
      });
    }, 50); // Speed of transmission

    return () => clearInterval(interval);
  }, [transmitting, grid, markComplete]);

  // Helper to get byte value of a row
  const getRowByte = (rowIdx: number) => {
    let byte = 0;
    for (let i = 0; i < 8; i++) {
      if (grid[rowIdx * 8 + i]) byte |= (1 << (7 - i));
    }
    return byte;
  };

  return (
    <div className="space-y-8">
      <InfoCard title="Build Your Own Data" icon="🎨">
        <p>
          Images are just streams of numbers. Draw on the left. The grid is converted into 64 bits (8 bytes) and sent to the receiver.
          <strong className="text-emerald-400"> Data is Representation.</strong>
        </p>
      </InfoCard>

      <div className="flex flex-col xl:flex-row gap-8 items-center justify-center bg-slate-900 p-6 rounded-2xl border border-slate-700 shadow-xl">
        
        {/* SENDER */}
        <div className="flex gap-4">
          {/* Hex/Binary Column */}
          <div className="hidden sm:flex flex-col justify-between py-1 text-[10px] font-mono text-slate-500">
            {[0,1,2,3,4,5,6,7].map(r => (
              <div key={r} className="h-6 flex items-center justify-end">
                {getRowByte(r).toString(2).padStart(8,'0')}
              </div>
            ))}
          </div>

          <div className="bg-black p-1 border border-slate-600 rounded">
            <div className="grid grid-cols-8 gap-px bg-slate-800 border border-slate-800 w-48 h-48">
              {grid.map((on, i) => (
                <div 
                  key={i}
                  onMouseDown={() => togglePixel(i)}
                  onMouseEnter={(e) => { if (e.buttons === 1) togglePixel(i); }}
                  className={`cursor-pointer transition-colors duration-75 ${on ? 'bg-amber-400' : 'bg-[#111] hover:bg-slate-800'}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* WIRE / TRANSMISSION */}
        <div className="flex flex-col items-center gap-4 w-full max-w-[200px]">
          <button 
            onClick={transmit}
            disabled={transmitting}
            className={`px-6 py-2 rounded-full font-bold text-sm shadow-lg transition-all active:scale-95
              ${transmitting 
                ? 'bg-slate-700 text-slate-400 cursor-wait' 
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }
            `}
          >
            {transmitting ? 'SENDING...' : 'TRANSMIT'}
          </button>
          
          <div className="w-full h-8 bg-black/40 rounded border border-slate-700 relative overflow-hidden flex items-center px-2 font-mono text-xs text-green-500">
            {transmitting && (
              <div className="absolute right-0 flex gap-1 animate-[slideLeft_0.2s_linear_infinite]">
                {/* Visual bit stream effect */}
                {Array.from({length: 10}).map((_, i) => (
                  <span key={i} className="opacity-50">{Math.random() > 0.5 ? '1' : '0'}</span>
                ))}
              </div>
            )}
            <div className="relative z-10 w-full text-center text-slate-500">
              {transmitting ? `${Math.round((progress/64)*100)}%` : 'Ready'}
            </div>
          </div>
        </div>

        {/* RECEIVER */}
        <div className="bg-black p-1 border border-slate-600 rounded relative">
          <div className="absolute -top-6 left-0 text-xs text-slate-500 uppercase tracking-widest">Receiver</div>
          <div className="grid grid-cols-8 gap-px bg-slate-800 border border-slate-800 w-48 h-48">
            {rxGrid.map((on, i) => (
              <div 
                key={i}
                className={`transition-colors duration-75 ${on ? 'bg-emerald-400' : 'bg-[#111]'}`}
              />
            ))}
          </div>
          {/* Scanline overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 pointer-events-none bg-[length:100%_4px,6px_100%] opacity-20" />
        </div>

      </div>
    </div>
  );
};

// ============================================
// LEVEL 5: FLOATING POINT
// ============================================
export const FloatingPointDemo: React.FC = () => {
  const a = 0.1;
  const b = 0.2;
  const sum = a + b;
  const expected = 0.3;
  const diff = Math.abs(sum - expected);
  const { markComplete } = useMastery();

  useEffect(() => {
    markComplete('p1-float');
  }, []);

  return (
    <div className="space-y-8">
      <InfoCard title="The Leak in Abstraction" icon="⚠️">
        <p>
          We can't represent <strong className="text-emerald-400">0.1</strong> exactly in binary, just like you can't represent 1/3 in decimal (0.333...). 
          These tiny errors accumulate, causing <strong className="text-amber-400">0.1 + 0.2 ≠ 0.3</strong>.
        </p>
      </InfoCard>

      <div className="bg-slate-900 p-8 rounded-2xl border border-slate-700 shadow-xl font-mono">
        <div className="bg-black/50 p-4 rounded-lg border-l-4 border-amber-500 mb-6">
          <div className="text-gray-500 mb-2">// JavaScript / Python / C++ Console</div>
          <div className="text-blue-400">{">"} 0.1 + 0.2 === 0.3</div>
          <div className="text-red-500 font-bold">false</div>
          <div className="text-blue-400 mt-2">{">"} 0.1 + 0.2</div>
          <div className="text-white">{sum}</div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between border-b border-gray-800 pb-1">
             <span className="text-gray-400">Actual Sum:</span>
             <span className="text-white">0.30000000000000004441...</span>
          </div>
          <div className="flex justify-between border-b border-gray-800 pb-1">
             <span className="text-gray-400">Expected:</span>
             <span className="text-white">0.30000000000000000000...</span>
          </div>
          <div className="flex justify-between pt-2">
             <span className="text-amber-500">Error Gap:</span>
             <span className="text-amber-500">{diff.toExponential()}</span>
          </div>
        </div>

        <div className="mt-6 relative h-12 bg-gray-800 rounded-full overflow-hidden flex items-center px-4">
           <div className="absolute left-10 h-full w-0.5 bg-white z-10" title="0.3 (Target)"></div>
           <div className="absolute left-[42px] h-4 w-4 bg-red-500 rounded-full animate-pulse z-20" title="Result"></div>
           <div className="text-[10px] text-gray-500 absolute bottom-1 w-full text-center">Microscopic Visualization of the Number Line</div>
        </div>
        <p className="text-center text-xs text-gray-400 mt-2">
           The red dot (result) slightly misses the white line (0.3).
        </p>
      </div>
    </div>
  );
};
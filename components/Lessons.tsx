import React, { useState } from 'react';
import { InfoCard, LED, ToggleSwitch, Breadboard } from './Shared';

// ============================================
// SECTION 1: LIGHT SWITCH
// ============================================
export const LightSwitchDemo: React.FC = () => {
  const [lightOn, setLightOn] = useState(false);
  
  return (
    <div className="space-y-8">
      <InfoCard title="The Basics: Boolean States" icon="💡">
        <p>Computers speak in <strong className="text-amber-300">binary</strong>. A single wire is either at high voltage (5V, <span className="text-emerald-400 font-mono">1</span>) or low voltage (0V, <span className="text-gray-400 font-mono">0</span>). Toggle the switch below to change the state.</p>
      </InfoCard>
      
      <div className="flex flex-col md:flex-row items-center justify-center gap-12 bg-black/20 p-8 rounded-2xl border border-white/5">
        <div className="flex flex-col items-center gap-4">
          <ToggleSwitch on={lightOn} onChange={setLightOn} label="INPUT A" />
          <div className="text-xs text-gray-500 font-mono">SWITCH</div>
        </div>

        {/* Wire visualization */}
        <div className="hidden md:flex flex-1 h-2 bg-gray-800 rounded relative max-w-[200px]">
          <div 
            className={`absolute inset-0 rounded transition-all duration-300 ${lightOn ? 'bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]' : 'bg-transparent'}`} 
            style={{ width: lightOn ? '100%' : '0%' }}
          />
        </div>

        <div className="flex flex-col items-center gap-4">
           <div className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 ${lightOn ? 'bg-amber-500/20 shadow-[0_0_50px_rgba(245,158,11,0.3)]' : 'bg-gray-800/50'}`}>
              <LED on={lightOn} color="yellow" size="large" />
           </div>
           <div className="text-xs text-gray-500 font-mono">OUTPUT</div>
        </div>
      </div>
      
      <div className="text-center font-mono text-2xl">
        State: <span className={lightOn ? 'text-emerald-400 font-bold' : 'text-gray-500'}>{lightOn ? '1 (HIGH)' : '0 (LOW)'}</span>
      </div>
    </div>
  );
};

// ============================================
// SECTION 2: SERIES (AND)
// ============================================
export const SeriesCircuitDemo: React.FC = () => {
  const [switch1, setSwitch1] = useState(false);
  const [switch2, setSwitch2] = useState(false);
  const lightOn = switch1 && switch2;
  
  return (
    <div className="space-y-8">
      <InfoCard title="AND Logic (Series Circuit)" icon="🔗">
        <p>In a series circuit, electricity must pass through <strong className="text-emerald-400">BOTH</strong> switches to reach the light. This represents the logical <strong className="text-amber-300">AND</strong> operation.</p>
      </InfoCard>
      
      <div className="relative p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-xl overflow-hidden">
        {/* Circuit Diagram Background */}
        <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid meet">
          <path d="M 100 150 L 250 150 M 350 150 L 450 150 M 550 150 L 700 150" stroke="currentColor" strokeWidth="4" className="text-gray-400" />
          {/* Active Path Animation */}
          <path d="M 100 150 L 250 150" stroke="#34d399" strokeWidth="4" className={switch1 || lightOn ? 'opacity-100' : 'opacity-0'} />
          <path d="M 350 150 L 450 150" stroke="#34d399" strokeWidth="4" className={lightOn ? 'opacity-100' : 'opacity-0'} />
          <path d="M 550 150 L 700 150" stroke="#34d399" strokeWidth="4" className={lightOn ? 'opacity-100' : 'opacity-0'} />
        </svg>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-around gap-8 min-h-[200px]">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 font-mono text-xs">5V</span>
            <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_red]" />
          </div>

          <div className="flex items-center gap-8 md:gap-16">
            <ToggleSwitch on={switch1} onChange={setSwitch1} label="SW 1" orientation="horizontal" />
            <ToggleSwitch on={switch2} onChange={setSwitch2} label="SW 2" orientation="horizontal" />
          </div>

          <div className="flex flex-col items-center gap-2">
            <LED on={lightOn} color="green" size="large" />
            <span className="text-xs font-mono text-gray-400">{lightOn ? 'ON' : 'OFF'}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="bg-black/40 px-6 py-3 rounded-lg border border-white/10 font-mono text-lg text-gray-300">
          <span className={switch1 ? 'text-emerald-400' : 'text-gray-600'}>A=1</span>
          <span className="mx-2 text-gray-500">&</span>
          <span className={switch2 ? 'text-emerald-400' : 'text-gray-600'}>B=1</span>
          <span className="mx-2 text-gray-500">→</span>
          <span className={lightOn ? 'text-emerald-400 font-bold' : 'text-gray-600'}>OUT=1</span>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SECTION 3: PARALLEL (OR)
// ============================================
export const ParallelCircuitDemo: React.FC = () => {
  const [switch1, setSwitch1] = useState(false);
  const [switch2, setSwitch2] = useState(false);
  const lightOn = switch1 || switch2;
  
  return (
    <div className="space-y-8">
      <InfoCard title="OR Logic (Parallel Circuit)" icon="🔀">
        <p>In a parallel circuit, electricity can flow through <strong className="text-emerald-400">EITHER</strong> path. If at least one switch is ON, the output is ON. This is <strong className="text-amber-300">OR logic</strong>.</p>
      </InfoCard>
      
      <div className="relative p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-xl overflow-hidden">
        {/* Interactive SVG Diagram for Parallel */}
        <div className="flex items-center justify-center">
          <svg width="100%" height="220" viewBox="0 0 600 220" className="max-w-2xl">
            {/* Main lines */}
            <path d="M 50 110 L 150 110" stroke="#475569" strokeWidth="4" />
            
            {/* Split */}
            <path d="M 150 110 Q 180 110 180 80 L 180 60 L 220 60" stroke={switch1 ? '#34d399' : '#475569'} strokeWidth="4" fill="none" className="transition-colors duration-300" />
            <path d="M 150 110 Q 180 110 180 140 L 180 160 L 220 160" stroke={switch2 ? '#34d399' : '#475569'} strokeWidth="4" fill="none" className="transition-colors duration-300" />
            
            {/* Rejoin */}
            <path d="M 320 60 L 360 60 L 360 80 Q 360 110 390 110" stroke={switch1 ? '#34d399' : '#475569'} strokeWidth="4" fill="none" className="transition-colors duration-300" />
            <path d="M 320 160 L 360 160 L 360 140 Q 360 110 390 110" stroke={switch2 ? '#34d399' : '#475569'} strokeWidth="4" fill="none" className="transition-colors duration-300" />
            
            {/* Output Line */}
            <path d="M 390 110 L 550 110" stroke={lightOn ? '#34d399' : '#475569'} strokeWidth="4" className="transition-colors duration-300" />

            {/* Switch Objects embedded via foreignObject is tricky in React sometimes, using absolute div overlay is better for interactive components */}
          </svg>
          
          {/* Overlay Interactive Elements positioned absolutely over the SVG area */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[40px] left-[220px] pointer-events-auto">
              <ToggleSwitch on={switch1} onChange={setSwitch1} label="A" orientation="horizontal" />
            </div>
            <div className="absolute top-[140px] left-[220px] pointer-events-auto">
              <ToggleSwitch on={switch2} onChange={setSwitch2} label="B" orientation="horizontal" />
            </div>
            <div className="absolute top-[88px] right-[50px] pointer-events-auto flex flex-col items-center">
              <LED on={lightOn} color="blue" size="large" />
              <span className="text-[10px] text-gray-500 mt-1 font-mono">OUT</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SECTION 4: TRANSISTOR
// ============================================
export const TransistorDemo: React.FC = () => {
  const [gateOn, setGateOn] = useState(false);
  
  return (
    <div className="space-y-8">
      <InfoCard title="MOSFET Transistor" icon="🔬">
        <p>This is how modern CPUs work. The <strong className="text-amber-400">Gate</strong> creates an electric field that allows electrons to flow from Source to Drain. It's a voltage-controlled switch.</p>
      </InfoCard>
      
      <div className="flex flex-col lg:flex-row items-center gap-8 justify-center">
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-2xl relative w-full max-w-md aspect-[4/3]">
           <svg viewBox="0 0 400 300" className="w-full h-full">
              {/* Substrate */}
              <rect x="50" y="150" width="300" height="100" rx="4" fill="#334155" />
              <text x="200" y="200" fill="#64748b" textAnchor="middle" fontSize="14">P-Type Substrate</text>

              {/* N-Wells */}
              <rect x="70" y="150" width="60" height="60" fill="#1e40af" rx="4" />
              <rect x="270" y="150" width="60" height="60" fill="#1e40af" rx="4" />
              <text x="100" y="185" fill="white" textAnchor="middle" fontSize="12">Source</text>
              <text x="300" y="185" fill="white" textAnchor="middle" fontSize="12">Drain</text>

              {/* Channel */}
              <rect x="130" y="150" width="140" height="10" fill={gateOn ? "#60a5fa" : "transparent"} className="transition-colors duration-300" />
              {gateOn && (
                <g>
                  <circle cx="140" cy="155" r="3" fill="white" className="animate-[moveRight_1s_infinite_linear]" />
                  <circle cx="180" cy="155" r="3" fill="white" className="animate-[moveRight_1s_infinite_linear_0.3s]" />
                  <circle cx="220" cy="155" r="3" fill="white" className="animate-[moveRight_1s_infinite_linear_0.6s]" />
                </g>
              )}

              {/* Oxide */}
              <rect x="130" y="135" width="140" height="15" fill="#e2e8f0" opacity="0.5" />
              <text x="200" y="146" fill="#000" textAnchor="middle" fontSize="10">Oxide</text>

              {/* Gate */}
              <rect x="130" y="115" width="140" height="20" fill={gateOn ? "#f59e0b" : "#475569"} className="transition-colors duration-300" />
              <text x="200" y="129" fill={gateOn ? "black" : "white"} textAnchor="middle" fontSize="12" fontWeight="bold">GATE</text>

              {/* Wiring */}
              <path d="M 200 115 L 200 50" stroke={gateOn ? "#f59e0b" : "#475569"} strokeWidth="4" />
              <path d="M 100 150 L 100 80 L 20 80" stroke="#60a5fa" strokeWidth="4" />
              <path d="M 300 150 L 300 80 L 380 80" stroke="#60a5fa" strokeWidth="4" />
           </svg>
           <style>{`
             @keyframes moveRight { from { transform: translateX(0); opacity:1; } to { transform: translateX(120px); opacity:0; } }
           `}</style>
        </div>

        <div className="flex flex-col items-center gap-4 bg-slate-800 p-6 rounded-xl border border-slate-600">
           <ToggleSwitch on={gateOn} onChange={setGateOn} label="GATE VOLTAGE" />
           <div className="h-px w-full bg-slate-600 my-2" />
           <div className="text-center">
             <div className="text-xs text-gray-400 mb-1">Status</div>
             <div className={`text-lg font-bold font-mono ${gateOn ? 'text-emerald-400' : 'text-red-400'}`}>
               {gateOn ? 'CONDUCTING' : 'BLOCKING'}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SECTION 5: NOT GATE
// ============================================
export const NotGateDemo: React.FC = () => {
  const [input, setInput] = useState(false);
  const output = !input;
  
  return (
    <div className="space-y-8">
      <InfoCard title="NOT Gate (Inverter)" icon="🔄">
        <p>A NOT gate flips the bit. If input is <strong className="text-emerald-400">1</strong>, output is <strong className="text-gray-400">0</strong>, and vice versa. It's built using a transistor connected to ground.</p>
      </InfoCard>
      
      <div className="bg-[#1e293b] p-8 rounded-2xl border border-slate-700 flex flex-col items-center gap-8 shadow-inner">
        <div className="flex items-center gap-12">
          {/* Input Side */}
          <div className="flex flex-col items-center gap-3">
            <ToggleSwitch on={input} onChange={setInput} label="IN" />
            <span className={`text-2xl font-mono font-bold ${input ? 'text-amber-400' : 'text-gray-600'}`}>{input ? '1' : '0'}</span>
          </div>

          {/* Logic Symbol */}
          <div className="relative w-32 h-24 flex items-center justify-center">
             {/* Wire In */}
             <div className={`absolute left-0 top-1/2 w-8 h-1 -translate-y-1/2 transition-colors ${input ? 'bg-amber-400' : 'bg-gray-700'}`} />
             
             {/* Triangle */}
             <div className="relative z-10 w-16 h-16 border-l-[20px] border-y-[10px] border-l-slate-200 border-y-transparent ml-6" />
             {/* Circle */}
             <div className="relative z-10 w-4 h-4 rounded-full border-2 border-slate-200 bg-[#1e293b] -ml-1" />
             
             {/* Wire Out */}
             <div className={`absolute right-0 top-1/2 w-8 h-1 -translate-y-1/2 transition-colors ${output ? 'bg-emerald-400' : 'bg-gray-700'}`} />
          </div>

          {/* Output Side */}
          <div className="flex flex-col items-center gap-3">
            <LED on={output} color="green" size="large" />
            <span className={`text-2xl font-mono font-bold ${output ? 'text-emerald-400' : 'text-gray-600'}`}>{output ? '1' : '0'}</span>
          </div>
        </div>
        
        <div className="text-sm text-gray-400 italic bg-black/20 px-4 py-2 rounded">
          "If input is ON, pull output to Ground. Else pull output to 5V."
        </div>
      </div>
    </div>
  );
};

// ============================================
// SECTION 6: IC CHIP
// ============================================
export const ICChipDemo: React.FC = () => {
  const [inputA, setInputA] = useState(false);
  const [inputB, setInputB] = useState(false);
  const nandOut = !(inputA && inputB);
  
  return (
    <div className="space-y-8">
      <InfoCard title="7400 Series Logic" icon="🔲">
        <p>In the real world, gates come packaged in <strong className="text-amber-300">DIP Chips</strong>. The 7400 chip contains four separate NAND gates.</p>
      </InfoCard>
      
      <Breadboard title="PROJECT: NAND LOGIC">
        <div className="flex flex-col items-center gap-8 w-full max-w-md">
          {/* The Chip Visual */}
          <div className="relative w-64 h-24 bg-[#111] rounded shadow-2xl flex items-center justify-center border border-gray-800">
            <div className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-8 bg-gray-800 rounded-full blur-[2px] opacity-50" />
            
            <div className="text-gray-400 font-mono text-xs flex flex-col items-center select-none">
              <span className="text-xl font-bold tracking-widest text-gray-200">SN7400N</span>
              <span className="text-[10px] opacity-50">MALAYSIA 2244</span>
            </div>

            {/* Pins Top */}
            <div className="absolute -top-3 left-4 right-4 flex justify-between px-2">
              {[...Array(7)].map((_, i) => (
                <div key={`t-${i}`} className="w-2 h-4 bg-gray-300 rounded-t shadow-inner border border-gray-400" />
              ))}
            </div>
            {/* Pins Bottom */}
            <div className="absolute -bottom-3 left-4 right-4 flex justify-between px-2">
              {[...Array(7)].map((_, i) => (
                <div key={`b-${i}`} className="w-2 h-4 bg-gray-300 rounded-b shadow-inner border border-gray-400" />
              ))}
            </div>

            {/* Active Logic Indicators (Overlay for learning) */}
            <div className="absolute inset-0 pointer-events-none">
               {/* Pin 1 (A) */}
               <div className={`absolute bottom-2 left-[28px] w-1.5 h-1.5 rounded-full transition-colors ${inputA ? 'bg-red-500 shadow-[0_0_5px_red]' : 'bg-gray-800'}`} />
               {/* Pin 2 (B) */}
               <div className={`absolute bottom-2 left-[58px] w-1.5 h-1.5 rounded-full transition-colors ${inputB ? 'bg-red-500 shadow-[0_0_5px_red]' : 'bg-gray-800'}`} />
               {/* Pin 3 (Out) */}
               <div className={`absolute bottom-2 left-[88px] w-1.5 h-1.5 rounded-full transition-colors ${nandOut ? 'bg-green-500 shadow-[0_0_5px_green]' : 'bg-gray-800'}`} />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between w-full px-8">
             <div className="flex gap-4">
                <ToggleSwitch on={inputA} onChange={setInputA} label="PIN 1" />
                <ToggleSwitch on={inputB} onChange={setInputB} label="PIN 2" />
             </div>
             
             <div className="flex flex-col items-center gap-2">
               <LED on={nandOut} color={nandOut ? 'green' : 'red'} label="PIN 3" />
             </div>
          </div>
        </div>
      </Breadboard>
    </div>
  );
};
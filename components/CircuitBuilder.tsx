import React, { useState, useCallback, useRef, useEffect } from 'react';
import { InfoCard } from './Shared';

// ============================================
// LOGIC HELPERS
// ============================================
const nand = (a: boolean, b: boolean) => !(a && b);
let idCounter = 0;
const generateId = () => `node-${++idCounter}-${Date.now()}`;

interface NodeData {
  id: string;
  type: 'nand' | 'input' | 'output';
  x: number;
  y: number;
  label?: string;
  value?: boolean;
}

interface WireData {
  id: string;
  fromNode: string;
  fromPin: number;
  toNode: string;
  toPin: number;
}

interface ConnectionPointProps {
  type: 'input' | 'output';
  index: number;
  nodeId: string;
  active: boolean;
  onStartConnection: (nodeId: string, pinIndex: number) => void;
  onEndConnection: (nodeId: string, pinIndex: number) => void;
  isConnecting: boolean;
  isConnected: boolean;
}

// Connection point
const ConnectionPoint: React.FC<ConnectionPointProps> = ({ type, index, nodeId, active, onStartConnection, onEndConnection, isConnecting, isConnected }) => {
  const isInput = type === 'input';
  
  // Highlighting logic
  const isTarget = isConnecting && isInput;
  const isSource = isConnecting && !isInput;
  
  return (
    <div
      className={`group relative flex items-center justify-center w-6 h-6 rounded-full cursor-crosshair transition-all duration-200 z-30
        ${isInput ? '-ml-3' : '-mr-3'} 
      `}
      onMouseDown={(e) => { e.stopPropagation(); if (!isInput) onStartConnection(nodeId, index); }}
      onMouseUp={(e) => { e.stopPropagation(); if (isInput) onEndConnection(nodeId, index); }}
    >
      {/* Visual Pin */}
      <div 
        className={`w-3 h-3 rounded-full border-2 transition-all duration-200
          ${active 
             ? 'bg-emerald-400 border-emerald-200 shadow-[0_0_8px_rgba(52,211,153,0.8)]' 
             : 'bg-slate-700 border-slate-500 hover:border-white'
          }
          ${isTarget ? 'ring-2 ring-amber-400 scale-125 bg-slate-600' : ''}
        `} 
      />
      {/* Hit area */}
      <div className="absolute inset-0 rounded-full" />
    </div>
  );
};

// ============================================
// NODE COMPONENTS
// ============================================

interface NodeContainerProps {
  x: number;
  y: number;
  selected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  title: string;
  children?: React.ReactNode;
}

const NodeContainer: React.FC<NodeContainerProps> = ({ 
  x, y, selected, onMouseDown, children, title 
}) => (
  <div 
    className={`absolute cursor-move select-none flex flex-col items-center group touch-none`} 
    style={{ 
      left: x, top: y, 
      transform: 'translate(-50%, -50%)', // Center based on coords
      zIndex: selected ? 50 : 10
    }} 
    onMouseDown={onMouseDown}
  >
    <div className={`
      relative bg-[#1e293b] rounded-lg shadow-xl border transition-all duration-200
      ${selected 
        ? 'border-amber-500 ring-2 ring-amber-500/30 shadow-[0_10px_20px_rgba(0,0,0,0.5)] scale-105' 
        : 'border-slate-600 hover:border-slate-400 shadow-[0_4px_6px_rgba(0,0,0,0.3)]'
      }
    `}>
      {/* Header/Title - schematic style */}
      <div className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <span className="text-[9px] font-mono text-slate-400 bg-slate-900/80 px-1 rounded">{title}</span>
      </div>
      
      {children}
    </div>
  </div>
);

// NAND Gate
const NANDGateNode = ({ id, x, y, inputA, inputB, onStartConnection, onEndConnection, isConnecting, onDragStart, selected }: any) => {
  const output = nand(inputA, inputB);
  
  return (
    <NodeContainer x={x} y={y} selected={selected} onMouseDown={(e) => onDragStart(e, id)} title="7400 NAND">
      <div className="flex items-center p-2 min-w-[80px]">
        {/* Inputs */}
        <div className="flex flex-col gap-4 -ml-4">
          <ConnectionPoint type="input" index={0} nodeId={id} active={inputA} onStartConnection={onStartConnection} onEndConnection={onEndConnection} isConnecting={isConnecting} isConnected={false} />
          <ConnectionPoint type="input" index={1} nodeId={id} active={inputB} onStartConnection={onStartConnection} onEndConnection={onEndConnection} isConnecting={isConnecting} isConnected={false} />
        </div>
        
        {/* Body */}
        <div className="flex-1 flex flex-col items-center justify-center px-3 py-1">
          <div className="w-10 h-10 border-2 border-slate-500 rounded-l-sm rounded-r-full flex items-center justify-center bg-slate-800">
             <span className="font-bold text-slate-300 text-xs">&</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full border-2 border-slate-500 bg-slate-900 -mr-[7px] -mt-[21px] relative z-10" />
        </div>

        {/* Output */}
        <div className="-mr-4 mt-[1px]">
          <ConnectionPoint type="output" index={0} nodeId={id} active={output} onStartConnection={onStartConnection} onEndConnection={onEndConnection} isConnecting={isConnecting} isConnected={false} />
        </div>
      </div>
      {/* Logic State Indicator Small */}
      <div className={`absolute top-1 right-1 w-1.5 h-1.5 rounded-full ${output ? 'bg-emerald-400' : 'bg-slate-700'}`} />
    </NodeContainer>
  );
};

// Input Switch Node
const InputSwitchNode = ({ id, x, y, value, label, onToggle, onStartConnection, isConnecting, onDragStart, selected }: any) => {
  return (
    <NodeContainer x={x} y={y} selected={selected} onMouseDown={(e) => onDragStart(e, id)} title={label || "INPUT"}>
      <div className="flex items-center p-2 gap-2">
         <div 
           className={`w-12 h-16 rounded cursor-pointer transition-all duration-150 flex items-center justify-center
             ${value 
               ? 'bg-gradient-to-b from-emerald-600 to-emerald-800 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)]' 
               : 'bg-gradient-to-b from-slate-700 to-slate-800 shadow-[0_2px_4px_rgba(0,0,0,0.5)]'
             }
           `}
           onClick={(e) => { e.stopPropagation(); onToggle(id); }}
         >
            <div className={`w-8 h-10 rounded border-t border-white/10 flex items-center justify-center ${value ? 'mt-1' : '-mt-1'} bg-black/20`}>
              <span className="font-mono font-bold text-white">{value ? '1' : '0'}</span>
            </div>
         </div>
         <div className="-mr-4">
           <ConnectionPoint type="output" index={0} nodeId={id} active={value} onStartConnection={onStartConnection} onEndConnection={() => {}} isConnecting={isConnecting} isConnected={false} />
         </div>
      </div>
    </NodeContainer>
  );
};

// Output LED Node
const OutputLEDNode = ({ id, x, y, value, label, onEndConnection, isConnecting, onDragStart, selected }: any) => {
  return (
    <NodeContainer x={x} y={y} selected={selected} onMouseDown={(e) => onDragStart(e, id)} title={label || "OUTPUT"}>
      <div className="flex items-center p-2 gap-2">
         <div className="-ml-4">
           <ConnectionPoint type="input" index={0} nodeId={id} active={value} onStartConnection={() => {}} onEndConnection={onEndConnection} isConnecting={isConnecting} isConnected={false} />
         </div>
         <div className="w-12 h-16 bg-slate-800 rounded flex items-center justify-center shadow-inner border border-slate-700">
            <div className={`w-8 h-8 rounded-full transition-all duration-200 ${value ? 'bg-emerald-400 shadow-[0_0_20px_#34d399]' : 'bg-slate-900 border border-slate-700'}`} />
         </div>
      </div>
    </NodeContainer>
  );
};

// Wire
const WireComponent = ({ startX, startY, endX, endY, active, id, selected, onSelect }: any) => {
  const dx = Math.abs(endX - startX);
  const controlOffset = Math.max(50, dx * 0.5);
  const path = `M ${startX} ${startY} C ${startX + controlOffset} ${startY}, ${endX - controlOffset} ${endY}, ${endX} ${endY}`;
  
  return (
    <g className="group" onClick={(e) => { e.stopPropagation(); onSelect(id); }}>
      {/* Hit area for easier selection */}
      <path d={path} fill="none" stroke="transparent" strokeWidth="15" className="cursor-pointer" />
      
      {/* Shadow */}
      <path d={path} fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="6" transform="translate(2, 2)" />
      
      {/* Wire Base */}
      <path d={path} fill="none" stroke={selected ? '#fbbf24' : '#334155'} strokeWidth={selected ? 8 : 4} strokeLinecap="round" />
      
      {/* Inner Color (Active) */}
      <path 
        d={path} 
        fill="none" 
        stroke={active ? '#34d399' : '#475569'} 
        strokeWidth="2" 
        strokeLinecap="round" 
        className="transition-colors duration-300"
        style={{ filter: active ? 'drop-shadow(0 0 4px #34d399)' : 'none' }}
      />
      
      {active && <circle r="2" fill="white"><animateMotion dur="1.5s" repeatCount="indefinite" path={path} calcMode="linear" /></circle>}
    </g>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const challenges = [
  { id: 'not', name: 'Build NOT', icon: '🔄', description: 'Invert input using 1 NAND', hint: 'Connect both NAND inputs together', test: (i: any, o: any) => i.length === 1 && o.length === 1 && o[0] === !i[0], setup: { inputs: [{ x: 100, y: 150, label: 'A', value: false }], outputs: [{ x: 500, y: 150, label: 'OUT' }] } },
  { id: 'and', name: 'Build AND', icon: '🔗', description: 'A AND B using 2 NANDs', hint: 'NAND then invert with another NAND', test: (i: any, o: any) => i.length === 2 && o.length === 1 && o[0] === (i[0] && i[1]), setup: { inputs: [{ x: 80, y: 100, label: 'A', value: false }, { x: 80, y: 220, label: 'B', value: false }], outputs: [{ x: 550, y: 160, label: 'OUT' }] } },
  { id: 'or', name: 'Build OR', icon: '🔀', description: 'A OR B using 3 NANDs', hint: 'NOT both inputs, then NAND results', test: (i: any, o: any) => i.length === 2 && o.length === 1 && o[0] === (i[0] || i[1]), setup: { inputs: [{ x: 80, y: 100, label: 'A', value: false }, { x: 80, y: 220, label: 'B', value: false }], outputs: [{ x: 600, y: 160, label: 'OUT' }] } },
  { id: 'sandbox', name: 'Free Build', icon: '🔧', description: 'Build anything!', hint: '', test: () => true, setup: { inputs: [{ x: 100, y: 100, label: 'A', value: false }], outputs: [{ x: 500, y: 100, label: 'OUT' }] } },
];

export const CircuitBuilder: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<Record<string, NodeData>>({});
  const [wires, setWires] = useState<WireData[]>([]);
  const [connecting, setConnecting] = useState<{ fromNode: string; fromPin: number } | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentChallenge, setCurrentChallenge] = useState(challenges[0]);
  const [completedChallenges, setCompletedChallenges] = useState<Set<string>>(new Set());
  const [showHint, setShowHint] = useState(false);
  const draggingRef = useRef<{ id: string, offsetX: number, offsetY: number } | null>(null);

  // Initialize
  useEffect(() => { loadChallenge(currentChallenge); }, []);
  
  // Logic Engine
  const calculateValues = useCallback(() => {
    const values: Record<string, { output?: boolean; inputA?: boolean; inputB?: boolean; value?: boolean }> = {};
    const calculated = new Set<string>();
    
    // Init Inputs
    Object.values(nodes).forEach((node: NodeData) => { if (node.type === 'input') { values[node.id] = { output: node.value }; calculated.add(node.id); } });
    
    // Propagate
    let changed = true, iterations = 0;
    while (changed && iterations < 50) {
      changed = false; iterations++;
      Object.values(nodes).forEach((node: NodeData) => {
        if (calculated.has(node.id)) return;
        
        if (node.type === 'nand') {
          const inputWires = wires.filter(w => w.toNode === node.id);
          const inputA = inputWires.find(w => w.toPin === 0);
          const inputB = inputWires.find(w => w.toPin === 1);
          
          if (inputA && inputB && values[inputA.fromNode] && values[inputB.fromNode]) {
             const valA = values[inputA.fromNode].output ?? values[inputA.fromNode].value;
             const valB = values[inputB.fromNode].output ?? values[inputB.fromNode].value;
             if (valA !== undefined && valB !== undefined) {
               values[node.id] = { output: nand(valA, valB), inputA: valA, inputB: valB };
               calculated.add(node.id); changed = true;
             }
          }
        } else if (node.type === 'output') {
          const inputWire = wires.find(w => w.toNode === node.id);
          if (inputWire && values[inputWire.fromNode]) {
            const val = values[inputWire.fromNode].output ?? values[inputWire.fromNode].value;
            if (val !== undefined) {
              values[node.id] = { value: val }; calculated.add(node.id); changed = true;
            }
          }
        }
      });
    }
    return values;
  }, [nodes, wires]);
  
  const values = calculateValues();

  // Test Challenge
  useEffect(() => {
    if (currentChallenge.id === 'sandbox') return;
    
    const allNodes = Object.values(nodes) as NodeData[];
    const inputNodes = allNodes.filter(n => n.type === 'input');
    const outputNodes = allNodes.filter(n => n.type === 'output');
    
    // Simple brute force check (up to 4 inputs max recommended)
    let allPass = true;
    const combinations = 1 << inputNodes.length;
    
    for (let i = 0; i < combinations; i++) {
       // Simulate logic state locally
       const testInputs = inputNodes.map((_, idx) => Boolean((i >> idx) & 1));
       
       // Clone state for simulation
       const simValues: Record<string, boolean> = {};
       inputNodes.forEach((n, idx) => simValues[n.id] = testInputs[idx]);
       
       // Propagate
       let changed = true, loops = 0;
       const simNodeResults: Record<string, boolean> = {};
       
       while(changed && loops < 50) {
         changed = false; loops++;
         allNodes.forEach(node => {
            if (node.type === 'input') {
               // already set
            } else if (node.type === 'nand') {
               const wA = wires.find(w => w.toNode === node.id && w.toPin === 0);
               const wB = wires.find(w => w.toNode === node.id && w.toPin === 1);
               if (wA && wB) {
                 const vA = simValues[wA.fromNode] ?? simNodeResults[wA.fromNode];
                 const vB = simValues[wB.fromNode] ?? simNodeResults[wB.fromNode];
                 if (vA !== undefined && vB !== undefined) {
                   const res = nand(vA, vB);
                   if (simNodeResults[node.id] !== res) { simNodeResults[node.id] = res; changed = true; }
                 }
               }
            }
         });
       }
       
       // Check Outputs
       const simOutputs = outputNodes.map(n => {
         const w = wires.find(w => w.toNode === n.id);
         if (!w) return false;
         return simValues[w.fromNode] ?? simNodeResults[w.fromNode] ?? false;
       });
       
       if (!currentChallenge.test(testInputs, simOutputs)) {
         allPass = false;
         break;
       }
    }
    
    if (allPass && wires.length > 0) {
      setCompletedChallenges(prev => new Set([...prev, currentChallenge.id]));
    }
  }, [nodes, wires, currentChallenge]); // Dependency on logic graph

  // Load / Reset
  const loadChallenge = (challenge: any) => {
    setCurrentChallenge(challenge);
    setShowHint(false);
    setWires([]);
    const newNodes: Record<string, NodeData> = {};
    challenge.setup.inputs.forEach((inp: any, i: number) => {
      const id = `in_${i}`; newNodes[id] = { id, type: 'input', x: inp.x, y: inp.y, label: inp.label, value: inp.value };
    });
    challenge.setup.outputs.forEach((out: any, i: number) => {
      const id = `out_${i}`; newNodes[id] = { id, type: 'output', x: out.x, y: out.y, label: out.label };
    });
    setNodes(newNodes);
  };

  // Interactions
  const handleDragStart = (e: React.MouseEvent, id: string) => {
    if (e.button !== 0) return; // Left click only
    e.preventDefault();
    const node = nodes[id];
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    draggingRef.current = {
      id,
      offsetX: e.clientX - rect.left - node.x,
      offsetY: e.clientY - rect.top - node.y
    };
    setSelectedId(id);
  };

  const handleGlobalMouseMove = useCallback((e: MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    if (draggingRef.current) {
      const { id, offsetX, offsetY } = draggingRef.current;
      setNodes(prev => ({
        ...prev,
        [id]: { ...prev[id], x: Math.max(0, Math.min(rect.width, x - offsetX)), y: Math.max(0, Math.min(rect.height, y - offsetY)) }
      }));
    }
  }, []);

  const handleGlobalMouseUp = useCallback(() => {
    draggingRef.current = null;
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [handleGlobalMouseMove, handleGlobalMouseUp]);

  // Wiring
  const handleStartConnection = (nodeId: string, pinIndex: number) => {
    setConnecting({ fromNode: nodeId, fromPin: pinIndex });
  };
  
  const handleEndConnection = (nodeId: string, pinIndex: number) => {
    if (!connecting) return;
    if (connecting.fromNode === nodeId) { setConnecting(null); return; } // Don't connect to self
    
    // Remove existing wire to this pin if any
    const newWires = wires.filter(w => !(w.toNode === nodeId && w.toPin === pinIndex));
    
    // Add new wire
    setWires([...newWires, {
      id: generateId(),
      fromNode: connecting.fromNode,
      fromPin: connecting.fromPin,
      toNode: nodeId,
      toPin: pinIndex
    }]);
    setConnecting(null);
  };

  // Helper to find pin coords
  const getPinPos = (nodeId: string, type: 'input' | 'output', index: number) => {
    const node = nodes[nodeId];
    if (!node) return { x: 0, y: 0 };
    // These offsets match the Node render layouts roughly
    // Node center is at x,y. 
    if (node.type === 'nand') {
       if (type === 'input') return { x: node.x - 40, y: node.y + (index === 0 ? -12 : 12) }; 
       else return { x: node.x + 40, y: node.y }; 
    } else if (node.type === 'input') {
       return { x: node.x + 30, y: node.y };
    } else if (node.type === 'output') {
       return { x: node.x - 30, y: node.y };
    }
    return { x: 0, y: 0 };
  };
  
  const handleRemove = () => {
    if (!selectedId) return;
    if (nodes[selectedId]?.type === 'input' || nodes[selectedId]?.type === 'output') {
      // Don't delete fixed inputs/outputs for challenge
      if (currentChallenge.id !== 'sandbox') return;
    }
    const newNodes = { ...nodes };
    delete newNodes[selectedId];
    setNodes(newNodes);
    setWires(wires.filter(w => w.fromNode !== selectedId && w.toNode !== selectedId && w.id !== selectedId));
    setSelectedId(null);
  };
  
  // Background click to deselect
  const handleBgClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).tagName === 'svg') {
      setSelectedId(null);
      setConnecting(null);
    }
  };

  return (
    <div className="space-y-4">
       <InfoCard title="Circuit Workshop" icon="🔧">
        <p>Drag components, click pins to wire them up. <strong className="text-amber-300">NAND</strong> is universal.</p>
      </InfoCard>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
           <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
             <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Challenges</h3>
             <div className="space-y-2">
               {challenges.map(c => (
                  <button 
                    key={c.id} 
                    onClick={() => loadChallenge(c)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between
                      ${currentChallenge.id === c.id 
                        ? 'bg-amber-500 text-slate-900 font-bold shadow-lg shadow-amber-500/20' 
                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                      }
                    `}
                  >
                    <span className="flex items-center gap-2">
                      <span>{c.icon}</span> {c.name}
                    </span>
                    {completedChallenges.has(c.id) && <span className="bg-emerald-500 text-white text-[10px] px-1.5 rounded-full">✓</span>}
                  </button>
               ))}
             </div>
           </div>

           <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Toolbox</h3>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => { 
                   const id = generateId(); 
                   setNodes(prev => ({ ...prev, [id]: { id, type: 'nand', x: 250, y: 150 } })); 
                }} className="flex flex-col items-center gap-1 p-2 bg-slate-700 rounded hover:bg-slate-600 border border-slate-600 hover:border-slate-500">
                   <div className="w-6 h-4 border border-slate-400 rounded-sm bg-slate-800 flex items-center justify-center text-[8px]">&</div>
                   <span className="text-[10px] font-bold text-slate-300">NAND</span>
                </button>
                <button onClick={() => {
                   const id = generateId();
                   setNodes(prev => ({ ...prev, [id]: { id, type: 'input', x: 100, y: 150, value: false } }));
                }} className="flex flex-col items-center gap-1 p-2 bg-slate-700 rounded hover:bg-slate-600 border border-slate-600 hover:border-slate-500">
                   <div className="w-4 h-4 bg-emerald-700 rounded shadow-inner" />
                   <span className="text-[10px] font-bold text-slate-300">Switch</span>
                </button>
                <button onClick={() => {
                   const id = generateId();
                   setNodes(prev => ({ ...prev, [id]: { id, type: 'output', x: 400, y: 150 } }));
                }} className="flex flex-col items-center gap-1 p-2 bg-slate-700 rounded hover:bg-slate-600 border border-slate-600 hover:border-slate-500">
                   <div className="w-4 h-4 rounded-full bg-slate-900 border border-slate-500" />
                   <span className="text-[10px] font-bold text-slate-300">LED</span>
                </button>
              </div>
           </div>
        </div>

        {/* Canvas Area */}
        <div className="lg:col-span-3 flex flex-col gap-4">
           {/* Header / Status */}
           <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded-lg border border-slate-700">
              <div className="flex items-center gap-3">
                 <div className="bg-slate-900 p-2 rounded text-xl">{currentChallenge.icon}</div>
                 <div>
                    <div className="font-bold text-white text-sm">{currentChallenge.name}</div>
                    <div className="text-gray-400 text-xs">{currentChallenge.description}</div>
                 </div>
              </div>
              <div className="flex gap-2">
                 {selectedId && <button onClick={handleRemove} className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/50 rounded text-xs hover:bg-red-500/30">Delete Selected</button>}
                 {completedChallenges.has(currentChallenge.id) && <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 rounded text-xs font-bold">COMPLETE</div>}
                 {!completedChallenges.has(currentChallenge.id) && currentChallenge.hint && (
                    <button onClick={() => setShowHint(!showHint)} className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/50 rounded text-xs">Hint</button>
                 )}
              </div>
           </div>
           
           {showHint && <div className="bg-amber-900/20 border border-amber-500/30 p-2 rounded text-amber-200 text-xs text-center">💡 {currentChallenge.hint}</div>}

           {/* The Board */}
           <div 
             ref={canvasRef}
             className="relative w-full h-[500px] bg-[#101015] rounded-xl overflow-hidden shadow-inner border border-slate-800"
             onClick={handleBgClick}
             style={{
               backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)',
               backgroundSize: '20px 20px',
               cursor: connecting ? 'crosshair' : 'default'
             }}
           >
             {/* Wires Layer */}
             <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
               {wires.map(w => {
                 const start = getPinPos(w.fromNode, 'output', w.fromPin);
                 const end = getPinPos(w.toNode, 'input', w.toPin);
                 const val = values[w.fromNode]?.output ?? values[w.fromNode]?.value ?? false;
                 return <g key={w.id} className="pointer-events-auto"><WireComponent id={w.id} startX={start.x} startY={start.y} endX={end.x} endY={end.y} active={val} selected={selectedId === w.id} onSelect={setSelectedId} /></g>
               })}
               {/* Dragging Line */}
               {connecting && (
                 <path 
                   d={`M ${getPinPos(connecting.fromNode, 'output', connecting.fromPin).x} ${getPinPos(connecting.fromNode, 'output', connecting.fromPin).y} L ${mousePos.x} ${mousePos.y}`} 
                   stroke="#fbbf24" strokeWidth="2" strokeDasharray="5,5" fill="none"
                   className="opacity-70"
                 />
               )}
             </svg>

             {/* Nodes Layer */}
             {(Object.values(nodes) as NodeData[]).map(node => {
               const nodeVal = values[node.id];
               if (node.type === 'nand') {
                 return <NANDGateNode key={node.id} {...node} inputA={nodeVal?.inputA} inputB={nodeVal?.inputB} onStartConnection={handleStartConnection} onEndConnection={handleEndConnection} isConnecting={!!connecting} onDragStart={handleDragStart} selected={selectedId === node.id} />
               } else if (node.type === 'input') {
                 return <InputSwitchNode key={node.id} {...node} onToggle={(id: string) => setNodes(p => ({...p, [id]: {...p[id], value: !p[id].value}}))} onStartConnection={handleStartConnection} isConnecting={!!connecting} onDragStart={handleDragStart} selected={selectedId === node.id} />
               } else if (node.type === 'output') {
                 return <OutputLEDNode key={node.id} {...node} value={nodeVal?.value} onEndConnection={handleEndConnection} isConnecting={!!connecting} onDragStart={handleDragStart} selected={selectedId === node.id} />
               }
               return null;
             })}
           </div>
           
           <div className="text-[10px] text-gray-500 flex justify-between px-2">
             <span>v1.2.0 • Grid Snap: OFF</span>
             <span>Left Click: Select/Drag • Click Pin: Connect</span>
           </div>
        </div>
      </div>
    </div>
  );
};
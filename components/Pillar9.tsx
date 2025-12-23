import React, { useState, useEffect, useRef } from 'react';
import { InfoCard, ToggleSwitch, LED } from './Shared';

// ============================================
// LEVEL 1: THE NETWORK MESH (ROUTING)
// ============================================
const NetworkMesh = () => {
  const [activePacket, setActivePacket] = useState<{ path: string[], step: number, status: string } | null>(null);
  
  // Simple Graph: 
  // A(0,50) -- B(30,20) -- C(70,20) -- E(100,50)
  //    \__ D(50,80) __/
  
  const nodes = {
    A: { x: 10, y: 50, label: 'Client' },
    B: { x: 40, y: 20, label: 'Router 1' },
    C: { x: 70, y: 20, label: 'Router 2' },
    D: { x: 50, y: 80, label: 'Router 3' },
    E: { x: 90, y: 50, label: 'Server' },
  };

  const sendPacket = () => {
    if (activePacket) return;
    // Randomly choose path: Top (A-B-C-E) or Bottom (A-D-E)
    const path = Math.random() > 0.5 ? ['A', 'B', 'C', 'E'] : ['A', 'D', 'E'];
    setActivePacket({ path, step: 0, status: 'Sending...' });
  };

  useEffect(() => {
    if (!activePacket) return;
    
    if (activePacket.step < activePacket.path.length - 1) {
      const timer = setTimeout(() => {
        setActivePacket(prev => prev ? { ...prev, step: prev.step + 1 } : null);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setActivePacket(null); // Done
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [activePacket?.step]);

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-xl relative min-h-[300px] flex flex-col items-center">
        
        <div className="absolute top-4 right-4">
           <button 
             onClick={sendPacket} 
             disabled={!!activePacket}
             className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
           >
             {activePacket ? 'Transmitting...' : 'Send Packet'}
           </button>
        </div>

        <svg viewBox="0 0 100 100" className="w-full max-w-lg h-64 overflow-visible">
          {/* Links */}
          <path d={`M ${nodes.A.x} ${nodes.A.y} L ${nodes.B.x} ${nodes.B.y}`} stroke="#334155" strokeWidth="1" />
          <path d={`M ${nodes.B.x} ${nodes.B.y} L ${nodes.C.x} ${nodes.C.y}`} stroke="#334155" strokeWidth="1" />
          <path d={`M ${nodes.C.x} ${nodes.C.y} L ${nodes.E.x} ${nodes.E.y}`} stroke="#334155" strokeWidth="1" />
          <path d={`M ${nodes.A.x} ${nodes.A.y} L ${nodes.D.x} ${nodes.D.y}`} stroke="#334155" strokeWidth="1" />
          <path d={`M ${nodes.D.x} ${nodes.D.y} L ${nodes.E.x} ${nodes.E.y}`} stroke="#334155" strokeWidth="1" />

          {/* Active Path Highlight */}
          {activePacket && (
             <path 
               d={`M ${nodes[activePacket.path[0] as keyof typeof nodes].x} ${nodes[activePacket.path[0] as keyof typeof nodes].y} ` + 
                  activePacket.path.slice(1).map(n => `L ${nodes[n as keyof typeof nodes].x} ${nodes[n as keyof typeof nodes].y}`).join(' ')}
               stroke="#60a5fa" strokeWidth="2" fill="none" strokeDasharray="2,2"
               className="animate-pulse"
             />
          )}

          {/* Nodes */}
          {Object.entries(nodes).map(([key, pos]) => (
            <g key={key} transform={`translate(${pos.x}, ${pos.y})`}>
              <circle r="4" fill="#1e293b" stroke="#94a3b8" strokeWidth="1" />
              <text y="8" fontSize="4" textAnchor="middle" fill="#94a3b8" className="font-mono">{pos.label}</text>
            </g>
          ))}

          {/* The Packet */}
          {activePacket && (
            <g className="transition-all duration-700 ease-in-out" 
               style={{ 
                 transform: `translate(${nodes[activePacket.path[activePacket.step] as keyof typeof nodes].x}px, ${nodes[activePacket.path[activePacket.step] as keyof typeof nodes].y}px)` 
               }}>
              <circle r="3" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1" className="shadow-[0_0_10px_orange]" />
              <text y="-5" fontSize="3" textAnchor="middle" fill="#fbbf24">DATA</text>
            </g>
          )}
        </svg>
        
        <div className="text-center text-slate-400 text-sm mt-4">
          {activePacket 
            ? `Hop ${activePacket.step + 1}: Arrived at ${nodes[activePacket.path[activePacket.step] as keyof typeof nodes].label}` 
            : 'Network Idle. Ready to route.'}
        </div>
      </div>
    </div>
  );
};

// ============================================
// LEVEL 2: TCP HANDSHAKE
// ============================================
const HandshakeViz = () => {
  const [step, setStep] = useState(0); // 0: Idle, 1: SYN sent, 2: SYN-ACK received, 3: ACK sent (Connected)

  const reset = () => setStep(0);
  const next = () => setStep(s => Math.min(s + 1, 3));

  return (
    <div className="flex flex-col items-center gap-8 bg-[#0f172a] p-8 rounded-xl border border-slate-700 shadow-xl">
      <div className="flex justify-between w-full max-w-2xl px-8 relative">
        {/* Client */}
        <div className="flex flex-col items-center gap-2 z-10">
          <div className={`w-16 h-16 rounded-lg border-2 flex items-center justify-center transition-colors ${step >= 3 ? 'bg-emerald-900/50 border-emerald-500' : 'bg-slate-800 border-slate-600'}`}>
            <span className="text-2xl">💻</span>
          </div>
          <span className="text-xs font-bold text-slate-400">CLIENT</span>
          {step >= 3 && <span className="text-[10px] bg-emerald-500 text-black px-1 rounded font-bold">ESTABLISHED</span>}
        </div>

        {/* Server */}
        <div className="flex flex-col items-center gap-2 z-10">
          <div className={`w-16 h-16 rounded-lg border-2 flex items-center justify-center transition-colors ${step >= 2 ? 'bg-emerald-900/50 border-emerald-500' : 'bg-slate-800 border-slate-600'}`}>
            <span className="text-2xl">🖥️</span>
          </div>
          <span className="text-xs font-bold text-slate-400">SERVER</span>
          {step >= 2 && <span className="text-[10px] bg-emerald-500 text-black px-1 rounded font-bold">ESTABLISHED</span>}
        </div>

        {/* Wires */}
        <div className="absolute top-8 left-20 right-20 h-0.5 bg-slate-700 -z-0" />

        {/* Animations */}
        {step === 1 && (
          <div className="absolute top-4 left-24 animate-[slideRight_1s_forwards] flex flex-col items-center">
            <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded shadow-lg">SYN</div>
            <div className="text-[9px] text-blue-400 mt-1">Seq=100</div>
          </div>
        )}
        {step === 2 && (
          <div className="absolute top-4 right-24 animate-[slideLeft_1s_forwards] flex flex-col items-center">
            <div className="bg-purple-500 text-white text-xs px-2 py-1 rounded shadow-lg">SYN-ACK</div>
            <div className="text-[9px] text-purple-400 mt-1">Ack=101, Seq=300</div>
          </div>
        )}
        {step === 3 && (
          <div className="absolute top-4 left-24 animate-[slideRight_1s_forwards] flex flex-col items-center">
            <div className="bg-emerald-500 text-white text-xs px-2 py-1 rounded shadow-lg">ACK</div>
            <div className="text-[9px] text-emerald-400 mt-1">Ack=301</div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideRight { from { left: 20%; opacity: 0; } to { left: 80%; opacity: 1; } }
        @keyframes slideLeft { from { left: 80%; opacity: 0; } to { left: 20%; opacity: 1; } }
      `}</style>

      <div className="flex gap-4">
        {step < 3 ? (
          <button onClick={next} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold">
            {step === 0 ? 'Send SYN' : step === 1 ? 'Receive SYN-ACK' : 'Send ACK'}
          </button>
        ) : (
          <button onClick={reset} className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded">
            Reset Connection
          </button>
        )}
      </div>
      
      <p className="text-slate-400 text-sm max-w-md text-center italic">
        {step === 0 && "The client wants to talk. It must first introduce itself."}
        {step === 1 && "Client sends SYN (Synchronize). 'Hello, I'd like to connect.'"}
        {step === 2 && "Server sends SYN-ACK. 'Hello to you too. I acknowledge you.'"}
        {step === 3 && "Client sends ACK. 'Great, connection established.' Data can now flow."}
      </p>
    </div>
  );
};

// ============================================
// LEVEL 3: ENCAPSULATION
// ============================================
const EncapsulationDemo = () => {
  const [layers, setLayers] = useState<string[]>([]);
  
  const allLayers = [
    { id: 'http', name: 'HTTP (Data)', color: 'bg-white text-black', label: 'GET /index.html' },
    { id: 'tcp', name: 'TCP (Segment)', color: 'bg-blue-600 text-white', label: 'Src: 5432 | Dst: 80' },
    { id: 'ip', name: 'IP (Packet)', color: 'bg-purple-600 text-white', label: 'Src: 192.168.1.5 | Dst: 93.184.216.34' },
    { id: 'eth', name: 'Ethernet (Frame)', color: 'bg-slate-700 text-slate-200', label: 'MAC Headers ... CRC' },
  ];

  const addLayer = () => {
    if (layers.length < 4) {
      setLayers([...layers, allLayers[layers.length].id]);
    }
  };

  const removeLayer = () => {
    if (layers.length > 0) {
      setLayers(layers.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex gap-4">
        <button 
          onClick={addLayer} 
          disabled={layers.length >= 4}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded disabled:opacity-50"
        >
          Wrap Layer (Encapsulate)
        </button>
        <button 
          onClick={removeLayer} 
          disabled={layers.length === 0}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded disabled:opacity-50"
        >
          Unwrap Layer (Decapsulate)
        </button>
      </div>

      <div className="relative flex items-center justify-center w-full max-w-2xl h-64 bg-slate-900/50 rounded-xl border border-slate-700 p-8 transition-all">
        {/* Layer 0 (Data) */}
        {layers.length === 0 && <div className="text-slate-500 italic">No Data</div>}
        
        {layers.includes('http') && (
          <div className="absolute z-40 p-4 bg-white text-black rounded shadow-lg animate-[popIn_0.3s_ease-out] min-w-[150px] text-center border-2 border-slate-200">
            <div className="text-xs font-bold text-slate-400 uppercase mb-1">Application</div>
            <div className="font-mono font-bold">GET /</div>
          </div>
        )}

        {/* TCP Wrapper */}
        {layers.includes('tcp') && (
          <div className="absolute z-30 p-8 bg-blue-600 rounded-lg shadow-xl animate-[popIn_0.3s_ease-out] min-w-[220px] flex flex-col items-center justify-end border-2 border-blue-400">
            <div className="absolute top-2 left-2 text-xs font-bold text-blue-200 uppercase">Transport (TCP)</div>
            <div className="absolute bottom-2 text-[10px] font-mono text-blue-100">Port 80</div>
          </div>
        )}

        {/* IP Wrapper */}
        {layers.includes('ip') && (
          <div className="absolute z-20 p-12 bg-purple-600 rounded-xl shadow-2xl animate-[popIn_0.3s_ease-out] min-w-[300px] flex flex-col items-center justify-end border-2 border-purple-400">
            <div className="absolute top-2 left-2 text-xs font-bold text-purple-200 uppercase">Network (IP)</div>
            <div className="absolute bottom-2 text-[10px] font-mono text-purple-100">192.168.1.5</div>
          </div>
        )}

        {/* Ethernet Wrapper */}
        {layers.includes('eth') && (
          <div className="absolute z-10 p-16 bg-slate-700 rounded-2xl shadow-2xl animate-[popIn_0.3s_ease-out] min-w-[380px] flex flex-col items-center justify-end border-2 border-slate-500">
            <div className="absolute top-2 left-2 text-xs font-bold text-slate-400 uppercase">Link (Ethernet)</div>
            <div className="absolute bottom-2 text-[10px] font-mono text-slate-400">MAC: A1:B2...</div>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes popIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
};

// ============================================
// LEVEL 4: RELIABILITY (STOP AND WAIT)
// ============================================
const ReliabilityDemo = () => {
  const [packetState, setPacketState] = useState<'idle' | 'sending' | 'lost' | 'received' | 'ack_sending' | 'ack_lost' | 'done'>('idle');
  const [lossChance, setLossChance] = useState(0.4);
  const [log, setLog] = useState<string[]>([]);

  const send = () => {
    if (packetState !== 'idle' && packetState !== 'done') return;
    setLog([]);
    attemptSend();
  };

  const attemptSend = () => {
    setPacketState('sending');
    setLog(prev => [...prev, 'Sender: Sending Packet...']);
    
    // Simulate Network Delay
    setTimeout(() => {
      if (Math.random() < lossChance) {
        setPacketState('lost');
        setLog(prev => [...prev, 'Network: ❌ Packet Lost!']);
        // Timeout & Retry
        setTimeout(() => {
          setLog(prev => [...prev, 'Sender: ⏱️ Timeout! Retrying...']);
          attemptSend();
        }, 1500);
      } else {
        setPacketState('received');
        setLog(prev => [...prev, 'Receiver: ✅ Got Packet. Sending ACK...']);
        // Send ACK
        setTimeout(() => {
          attemptAck();
        }, 500);
      }
    }, 1000);
  };

  const attemptAck = () => {
    setPacketState('ack_sending');
    
    setTimeout(() => {
      if (Math.random() < lossChance) {
        setPacketState('ack_lost');
        setLog(prev => [...prev, 'Network: ❌ ACK Lost!']);
        // Sender will timeout because it never got ACK
        setTimeout(() => {
          setLog(prev => [...prev, 'Sender: ⏱️ Timeout waiting for ACK! Retrying...']);
          attemptSend(); // Resend original packet
        }, 1500);
      } else {
        setPacketState('done');
        setLog(prev => [...prev, 'Sender: ✅ ACK Received. Success!']);
      }
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center bg-slate-900 p-4 rounded-xl border border-slate-700">
        <div className="flex items-center gap-4">
          <span className="text-slate-400 text-sm font-bold">Network Reliability:</span>
          <button 
            onClick={() => setLossChance(0.0)} 
            className={`px-3 py-1 rounded text-xs ${lossChance === 0.0 ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}
          >
            Perfect (0% Loss)
          </button>
          <button 
            onClick={() => setLossChance(0.4)} 
            className={`px-3 py-1 rounded text-xs ${lossChance === 0.4 ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400'}`}
          >
            Lossy (40% Loss)
          </button>
        </div>
        <button 
          onClick={send}
          disabled={packetState !== 'idle' && packetState !== 'done'}
          className="px-6 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-500 disabled:opacity-50"
        >
          Send Message
        </button>
      </div>

      <div className="relative h-32 bg-black/40 rounded-xl border border-slate-700 flex items-center justify-between px-12 overflow-hidden">
        {/* Sender */}
        <div className="flex flex-col items-center z-10">
          <div className="w-12 h-12 bg-blue-600 rounded flex items-center justify-center text-2xl">📤</div>
          <span className="text-xs font-bold text-slate-400 mt-2">SENDER</span>
        </div>

        {/* Receiver */}
        <div className="flex flex-col items-center z-10">
          <div className="w-12 h-12 bg-purple-600 rounded flex items-center justify-center text-2xl">📥</div>
          <span className="text-xs font-bold text-slate-400 mt-2">RECEIVER</span>
        </div>

        {/* Moving Packet */}
        {(packetState === 'sending' || packetState === 'lost' || packetState === 'received') && (
          <div className={`absolute left-20 w-8 h-6 bg-amber-400 rounded shadow-lg flex items-center justify-center text-[10px] font-bold text-black animate-[moveRight_1s_linear_forwards] ${packetState === 'lost' ? 'opacity-0 transition-opacity duration-300 delay-500' : ''}`}>
            DATA
          </div>
        )}

        {/* Moving ACK */}
        {(packetState === 'ack_sending' || packetState === 'ack_lost' || packetState === 'done') && (
          <div className={`absolute right-20 w-8 h-6 bg-emerald-400 rounded shadow-lg flex items-center justify-center text-[10px] font-bold text-black animate-[moveLeft_1s_linear_forwards] ${packetState === 'ack_lost' ? 'opacity-0 transition-opacity duration-300 delay-500' : ''}`}>
            ACK
          </div>
        )}
      </div>

      <style>{`
        @keyframes moveRight { from { left: 10%; } to { left: 90%; } }
        @keyframes moveLeft { from { right: 10%; } to { right: 90%; } }
      `}</style>

      {/* Log */}
      <div className="bg-black p-4 rounded-lg font-mono text-xs text-green-400 h-40 overflow-y-auto border border-slate-800">
        {log.map((line, i) => <div key={i}>{line}</div>)}
        {log.length === 0 && <span className="text-slate-600">// Transmission log...</span>}
      </div>
    </div>
  );
};

// ============================================
// LEVEL 5: DNS QUEST
// ============================================
const DNSQuest = () => {
  const [domain, setDomain] = useState("google.com");
  const [step, setStep] = useState(0); // 0: Idle, 1: Browser, 2: Resolver, 3: Root, 4: TLD, 5: Auth, 6: Connected
  const [msg, setMsg] = useState("");

  const runDNS = async () => {
    setStep(1);
    setMsg("Browser: Where is " + domain + "?");
    await new Promise(r => setTimeout(r, 1000));

    setStep(2);
    setMsg("Resolver: Checking Root Servers...");
    await new Promise(r => setTimeout(r, 1000));

    setStep(3);
    setMsg("Root Server: I don't know IP, but try .COM server.");
    await new Promise(r => setTimeout(r, 1000));

    setStep(4);
    setMsg("TLD Server (.com): Try Google's Nameserver.");
    await new Promise(r => setTimeout(r, 1000));

    setStep(5);
    setMsg("Auth Server: Here is the IP: 142.250.80.46");
    await new Promise(r => setTimeout(r, 1000));

    setStep(6);
    setMsg("Browser: Connected to 142.250.80.46!");
  };

  const steps = [
    { name: "Browser", icon: "💻" },
    { name: "Resolver", icon: "⚙️" },
    { name: "Root (.)", icon: "🌳" },
    { name: "TLD (.com)", icon: "📑" },
    { name: "Auth (ns1)", icon: "🏢" },
  ];

  return (
    <div className="flex flex-col gap-8 bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-xl">
      <div className="flex justify-between items-center gap-4">
        <input 
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          className="flex-1 bg-black p-3 rounded border border-slate-600 font-mono text-white"
          placeholder="Enter domain..."
        />
        <button onClick={runDNS} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded font-bold text-white shadow-lg">
          Resolve
        </button>
      </div>

      <div className="relative">
        <div className="flex justify-between relative z-10">
          {steps.map((s, i) => {
            const isActive = step === i + 1 || (step === 6 && i === 0);
            return (
              <div key={i} className={`flex flex-col items-center gap-2 transition-all duration-500 ${isActive ? 'scale-110 opacity-100' : 'opacity-40'}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl border-2 ${isActive ? 'bg-blue-600 border-blue-400 shadow-[0_0_20px_blue]' : 'bg-slate-800 border-slate-600'}`}>
                  {s.icon}
                </div>
                <div className="text-xs font-bold text-slate-300">{s.name}</div>
              </div>
            );
          })}
        </div>
        
        {/* Progress Line */}
        <div className="absolute top-6 left-6 right-6 h-0.5 bg-slate-700 -z-0">
          <div 
            className="h-full bg-blue-500 transition-all duration-1000 ease-linear"
            style={{ width: `${Math.max(0, (step - 1) * 25)}%` }}
          />
        </div>
      </div>

      <div className="text-center p-4 bg-black/40 rounded-lg border border-slate-600 min-h-[60px] flex items-center justify-center">
        <span className={`font-mono text-lg ${step === 6 ? 'text-emerald-400 font-bold' : 'text-slate-300'}`}>
          {msg || "Ready to lookup."}
        </span>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
export const Pillar9: React.FC = () => {
  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-2">Pillar 9: Communication & Protocols</h2>
        <p className="text-slate-400">How systems talk to each other. Agreement vs. Control.</p>
      </div>

      <InfoCard title="Level 1: The Routing Mesh" icon="🌐">
        <p>
          The internet has no center. Messages are broken into <strong className="text-amber-400">packets</strong> and passed from router to router like a hot potato.
          If one path is blocked, they find another.
        </p>
      </InfoCard>

      <NetworkMesh />

      <div className="w-full h-px bg-slate-800" />

      <InfoCard title="Level 2: The Three-Way Handshake" icon="🤝">
        <p>
          Before we trade data, we must agree to talk. <strong className="text-blue-400">TCP</strong> uses a handshake to establish a reliable connection state.
        </p>
      </InfoCard>

      <HandshakeViz />

      <div className="w-full h-px bg-slate-800" />

      <InfoCard title="Level 3: Encapsulation (The Envelope)" icon="✉️">
        <p>
          Protocols work in layers. Each layer adds a header (envelope) to the message. The physical wire only sees the outer envelope; it doesn't care what's inside.
        </p>
      </InfoCard>

      <EncapsulationDemo />

      <div className="w-full h-px bg-slate-800" />

      <InfoCard title="Level 4: Reliability" icon="🛡️">
        <p>
          Networks are unreliable. Packets get lost. We build <strong className="text-emerald-400">Reliability</strong> on top of unreliable networks using timeouts, acknowledgments (ACKs), and retransmissions.
        </p>
      </InfoCard>

      <ReliabilityDemo />

      <div className="w-full h-px bg-slate-800" />

      <InfoCard title="Level 5: DNS (The Phonebook)" icon="📖">
        <p>
          Computers need IP addresses (142.250.80.46), but humans prefer names (google.com). 
          <strong className="text-purple-400">DNS</strong> is the distributed system that translates between them.
        </p>
      </InfoCard>

      <DNSQuest />
    </div>
  );
};

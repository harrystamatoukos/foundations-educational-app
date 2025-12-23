import React, { useState } from 'react';
import { Workbench } from './components/Shared';
import { LighthouseDemo, BinaryCountingDemo, RepresentationDemo, FloatingPointDemo } from './components/Pillar1';
import { Pillar2 } from './components/Pillar2';
import { Pillar3 } from './components/Pillar3';
import { Pillar4 } from './components/Pillar4';
import { Pillar5 } from './components/Pillar5';
import { Pillar6 } from './components/Pillar6';
import { Pillar7 } from './components/Pillar7';
import { Pillar8 } from './components/Pillar8';
import { Pillar9 } from './components/Pillar9';
import { Pillar10 } from './components/Pillar10';
import { Pillar11 } from './components/Pillar11';
import { CircuitBuilder } from './components/CircuitBuilder';
import { MasteryProvider, useMastery } from './contexts/MasteryContext';

// Progress Ring Component
const ProgressRing = ({ progress }: { progress: number }) => {
  const r = 8;
  const c = 2 * Math.PI * r;
  const offset = c - progress * c;
  
  return (
    <svg width="20" height="20" className="transform -rotate-90">
      <circle cx="10" cy="10" r={r} stroke="currentColor" strokeWidth="2" fill="transparent" className="text-slate-700" />
      <circle 
        cx="10" cy="10" r={r} 
        stroke="currentColor" strokeWidth="2" fill="transparent" 
        className={progress >= 1 ? "text-emerald-500" : "text-amber-500"}
        strokeDasharray={c} 
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </svg>
  );
};

interface TabButtonProps {
  id: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  icon: string;
}

const TabButton: React.FC<TabButtonProps> = ({ id, active, onClick, children, icon }) => {
  const { getPillarProgress } = useMastery();
  const progress = getPillarProgress(id);
  const isComplete = progress >= 1;

  return (
    <button 
      onClick={onClick} 
      className={`
        group relative flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 outline-none w-full
        ${active 
          ? 'bg-surface text-active shadow-card ring-1 ring-border' 
          : 'text-secondary hover:text-primary hover:bg-depth'
        }
      `}
    >
      <div className="flex items-center gap-3">
        <span className={`text-lg transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>{icon}</span>
        <span>{children}</span>
      </div>
      
      <div className="opacity-80">
        {isComplete ? (
          <span className="text-emerald-500 font-bold">✓</span>
        ) : (
          progress > 0 && <ProgressRing progress={progress} />
        )}
      </div>
      
      {active && <div className="absolute left-0 w-1 h-1/2 bg-active rounded-r-full -ml-3 md:hidden" />}
    </button>
  );
};

const Header = ({ activeLabel }: { activeLabel: string | undefined }) => {
  const { level, overallProgress } = useMastery();
  
  return (
    <header className="flex-shrink-0 bg-surface border-b border-border px-6 py-4 flex items-center justify-between z-20">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-primary text-inverse rounded-lg flex items-center justify-center font-display font-bold text-xl shadow-lg">
          F
        </div>
        <div>
          <h1 className="font-display font-semibold text-lg leading-tight text-primary">Foundations</h1>
          <div className="text-xs text-secondary font-medium">of Computation</div>
        </div>
      </div>
      
      <div className="hidden md:flex items-center gap-6">
        <div className="flex flex-col items-end">
          <div className="text-xs font-bold text-tertiary uppercase tracking-wider">Level: {level}</div>
          <div className="w-32 h-1.5 bg-depth rounded-full overflow-hidden mt-1">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000" style={{ width: `${overallProgress * 100}%` }} />
          </div>
        </div>
        <div className="w-px h-8 bg-border" />
        <div className="text-xs font-mono text-tertiary">
          <span>v3.2</span>
        </div>
      </div>
    </header>
  );
};

const AppContent = () => {
  const [activeSection, setActiveSection] = useState('info');
  
  const sections = [
    { id: 'info', label: 'Information', icon: '◐' },
    { id: 'logic', label: 'Logic & Gates', icon: '⋀' },
    { id: 'memory', label: 'Memory', icon: '⟲' },
    { id: 'cpu', label: 'Execution', icon: '▷' },
    { id: 'limits', label: 'Computability', icon: '∞' },
    { id: 'algo', label: 'Algorithms', icon: '📈' },
    { id: 'abstract', label: 'Abstraction', icon: '▢' },
    { id: 'concurrent', label: 'Concurrency', icon: '⫴' },
    { id: 'net', label: 'Communication', icon: '⇆' },
    { id: 'entropy', label: 'Entropy', icon: '𝐻' },
    { id: 'llm', label: 'LLMs', icon: '🤖' },
    { id: 'builder', label: 'Workshop', icon: '🔧' },
  ];

  return (
    <Workbench>
      <div className="flex flex-col h-screen overflow-hidden">
        
        <Header activeLabel={sections.find(s => s.id === activeSection)?.label} />
        
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Nav (Desktop) */}
          <nav className="hidden md:flex w-64 flex-col bg-canvas border-r border-border overflow-y-auto py-4 px-3 gap-1 flex-shrink-0">
            <div className="text-xs font-bold text-tertiary uppercase tracking-widest px-4 mb-2 mt-2">Pillars</div>
            {sections.map((section) => (
              <TabButton 
                key={section.id} 
                id={section.id}
                active={activeSection === section.id} 
                onClick={() => setActiveSection(section.id)} 
                icon={section.icon}
              >
                {section.label}
              </TabButton>
            ))}
          </nav>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-8 md:px-12 scroll-smooth">
            <div className="max-w-4xl mx-auto space-y-12 pb-20">
              
              {/* Pillar Title */}
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-display font-semibold text-primary mb-2">
                  {sections.find(s => s.id === activeSection)?.label}
                </h2>
                <div className="h-1 w-20 bg-active rounded-full opacity-20" />
              </div>

              {activeSection === 'info' && (
                <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <LighthouseDemo />
                   <BinaryCountingDemo />
                   <RepresentationDemo />
                   <FloatingPointDemo />
                </div>
              )}
              
              {activeSection === 'logic' && <Pillar2 />}
              {activeSection === 'memory' && <Pillar3 />}
              {activeSection === 'cpu' && <Pillar4 />}
              {activeSection === 'limits' && <Pillar5 />}
              {activeSection === 'algo' && <Pillar6 />}
              {activeSection === 'abstract' && <Pillar7 />}
              {activeSection === 'concurrent' && <Pillar8 />}
              {activeSection === 'net' && <Pillar9 />}
              {activeSection === 'entropy' && <Pillar10 />}
              {activeSection === 'llm' && <Pillar11 />}
              {activeSection === 'builder' && <CircuitBuilder />}
            </div>
          </main>
        </div>

        {/* Mobile Nav */}
        <nav className="md:hidden flex overflow-x-auto bg-surface border-t border-border p-2 gap-2 flex-shrink-0 z-20 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
          {sections.map((section) => (
            <TabButton 
              key={section.id} 
              id={section.id}
              active={activeSection === section.id} 
              onClick={() => setActiveSection(section.id)} 
              icon={section.icon}
            >
              {section.label}
            </TabButton>
          ))}
        </nav>

      </div>
    </Workbench>
  );
};

export default function App() {
  return (
    <MasteryProvider>
      <AppContent />
    </MasteryProvider>
  );
}

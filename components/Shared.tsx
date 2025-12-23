import React from 'react';

// ============================================
// SHARED COMPONENTS
// ============================================

interface LEDProps {
  on: boolean;
  color?: 'green' | 'red' | 'yellow' | 'blue';
  size?: 'normal' | 'small' | 'large';
  label?: string;
}

// Honest Materials LED
export const LED: React.FC<LEDProps> = ({ on, color = 'green', size = 'normal', label }) => {
  const colors = {
    green: { on: 'bg-success', shadow: 'shadow-success/50' },
    red: { on: 'bg-error', shadow: 'shadow-error/50' },
    yellow: { on: 'bg-warning', shadow: 'shadow-warning/50' },
    blue: { on: 'bg-active', shadow: 'shadow-active/50' },
  };
  
  const c = colors[color];
  
  let sizeClass = 'w-6 h-6';
  if (size === 'small') sizeClass = 'w-3 h-3';
  if (size === 'large') sizeClass = 'w-8 h-8';
  
  return (
    <div className="flex flex-col items-center gap-2">
      <div 
        className={`${sizeClass} rounded-full transition-all duration-200 border border-black/10 dark:border-white/10
          ${on 
            ? `${c.on} shadow-[0_0_12px_rgba(0,0,0,0)] ${c.shadow}` 
            : 'bg-depth'
          }
        `}
        style={{
          boxShadow: on ? undefined : 'inset 0 1px 3px rgba(0,0,0,0.1)'
        }}
      />
      {label && <span className="text-[10px] font-mono font-bold text-tertiary uppercase tracking-widest">{label}</span>}
    </div>
  );
};

interface ToggleSwitchProps {
  on: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  orientation?: 'vertical' | 'horizontal';
}

// Minimal Toggle Switch
export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ on, onChange, label, orientation = 'vertical' }) => {
  const isVertical = orientation === 'vertical';
  
  return (
    <div className={`flex ${isVertical ? 'flex-col' : 'flex-row'} items-center gap-3`}>
      {label && (
        <div className="text-xs font-bold text-tertiary uppercase tracking-wider font-mono select-none">{label}</div>
      )}
      <button
        onClick={() => onChange(!on)}
        className={`relative group outline-none focus:outline-none bg-depth rounded-full transition-colors duration-200 border border-border
          ${isVertical ? 'w-8 h-14' : 'w-14 h-8'}
        `}
      >
        <div 
          className={`absolute rounded-full shadow-sm transition-all duration-[300ms] cubic-bezier(0.34, 1.56, 0.64, 1) bg-surface border border-black/5
            ${on ? 'bg-active' : 'bg-white dark:bg-gray-600'}
            ${isVertical 
              ? `left-1 w-5 h-5 ${on ? 'top-7' : 'top-1'}` 
              : `top-1 h-5 w-5 ${on ? 'left-7' : 'left-1'}`
            }
          `}
        >
          {on && <div className="absolute inset-0 m-auto w-1.5 h-1.5 rounded-full bg-white opacity-90" />}
        </div>
      </button>
    </div>
  );
};

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
  icon: string;
}

// Clean Surface Card
export const InfoCard: React.FC<InfoCardProps> = ({ title, children, icon }) => {
  return (
    <div className="bg-surface rounded-xl shadow-card border border-border p-6 overflow-hidden relative">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-depth text-xl">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-display font-semibold text-primary mb-2">{title}</h3>
          <div className="text-secondary text-sm leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

interface BreadboardProps {
  children: React.ReactNode;
  title?: string;
}

// Simulation Container
export const Breadboard: React.FC<BreadboardProps> = ({ children, title }) => {
  return (
    <div className="relative rounded-xl overflow-hidden bg-depth border border-border mx-auto w-full shadow-inner">
      <div className="absolute inset-0 bg-dot-grid pointer-events-none opacity-50" />
      
      <div className="relative z-10 p-8 min-h-[200px] flex flex-col items-center justify-center">
        {title && (
          <div className="absolute top-4 left-4 text-[10px] font-mono font-bold text-tertiary tracking-widest uppercase">
            {title}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

interface WorkbenchProps {
  children: React.ReactNode;
}

// App Shell
export const Workbench: React.FC<WorkbenchProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-canvas text-primary transition-colors duration-300">
      <div className="fixed inset-0 bg-dot-grid pointer-events-none z-0" />
      <div className="relative z-10 flex-1 flex flex-col">{children}</div>
    </div>
  );
};

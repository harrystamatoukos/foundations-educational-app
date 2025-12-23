import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the curriculum map (Pillar ID -> Interaction IDs)
export const CURRICULUM: Record<string, string[]> = {
  info: ['p1-lighthouse', 'p1-telegraph', 'p1-binary', 'p1-pixel', 'p1-float'],
  logic: ['p2-intro', 'p2-series', 'p2-parallel', 'p2-transistor', 'p2-not', 'p2-chip', 'p2-adder'],
  memory: ['p3-latch', 'p3-flipflop', 'p3-register', 'p3-ram'],
  cpu: ['p4-music', 'p4-cpu', 'p4-stack'],
  limits: ['p5-turing', 'p5-halting', 'p5-decidable'],
  algo: ['p6-search', 'p6-bigo', 'p6-sort', 'p6-tsp'],
  abstract: ['p7-tower', 'p7-compose', 'p7-parse', 'p7-store'],
  concurrent: ['p8-race', 'p8-deadlock', 'p8-prodcon', 'p8-amdahl'],
  net: ['p9-mesh', 'p9-tcp', 'p9-encap', 'p9-reliable', 'p9-dns'],
  entropy: ['p10-guess', 'p10-entropy', 'p10-huffman', 'p10-channel', 'p10-hamming'],
  llm: ['p11-predict', 'p11-token', 'p11-embed', 'p11-attn', 'p11-temp', 'p11-scale'],
  builder: ['p12-sandbox']
};

interface MasteryContextType {
  completed: Set<string>;
  markComplete: (id: string) => void;
  getPillarProgress: (pillarId: string) => number;
  overallProgress: number;
  level: string;
}

const MasteryContext = createContext<MasteryContextType | undefined>(undefined);

export const MasteryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [completed, setCompleted] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('mastery_progress');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    localStorage.setItem('mastery_progress', JSON.stringify([...completed]));
  }, [completed]);

  const markComplete = (id: string) => {
    if (!completed.has(id)) {
      setCompleted(prev => new Set([...prev, id]));
      // Optional: Add sound effect trigger here later
    }
  };

  const getPillarProgress = (pillarId: string) => {
    const items = CURRICULUM[pillarId];
    if (!items || items.length === 0) return 0;
    const done = items.filter(id => completed.has(id)).length;
    return done / items.length;
  };

  // Calculate overall level
  const totalItems = Object.values(CURRICULUM).flat().length;
  const totalDone = completed.size;
  const overallProgress = totalDone / totalItems;

  let level = "Novice";
  if (overallProgress > 0.1) level = "Apprentice";
  if (overallProgress > 0.3) level = "Journeyman";
  if (overallProgress > 0.6) level = "Expert";
  if (overallProgress > 0.9) level = "Master";

  return (
    <MasteryContext.Provider value={{ completed, markComplete, getPillarProgress, overallProgress, level }}>
      {children}
    </MasteryContext.Provider>
  );
};

export const useMastery = () => {
  const context = useContext(MasteryContext);
  if (!context) throw new Error("useMastery must be used within a MasteryProvider");
  return context;
};

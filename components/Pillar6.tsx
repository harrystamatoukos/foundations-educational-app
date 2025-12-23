import React, { useState, useEffect, useRef } from 'react';
import { InfoCard } from './Shared';

// ============================================
// LEVEL 1: LINEAR VS BINARY SEARCH
// ============================================
const SearchDemo = () => {
  const SIZE = 64;
  const [array, setArray] = useState<number[]>([]);
  const [target, setTarget] = useState<number>(0);
  const [linearIdx, setLinearIdx] = useState<number | null>(null);
  const [binaryRange, setBinaryRange] = useState<[number, number] | null>(null);
  const [binaryMid, setBinaryMid] = useState<number | null>(null);
  const [linearCount, setLinearCount] = useState(0);
  const [binaryCount, setBinaryCount] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    reset();
  }, []);

  const reset = () => {
    const arr = Array.from({ length: SIZE }, (_, i) => i + 1); // Sorted for binary search
    setArray(arr);
    setTarget(Math.floor(Math.random() * SIZE) + 1);
    setLinearIdx(null);
    setBinaryRange(null);
    setBinaryMid(null);
    setLinearCount(0);
    setBinaryCount(0);
    setRunning(false);
  };

  const runSearch = async () => {
    if (running) return;
    setRunning(true);
    setLinearCount(0);
    setBinaryCount(0);

    // Run Linear Search
    const runLinear = async () => {
      for (let i = 0; i < array.length; i++) {
        setLinearIdx(i);
        setLinearCount(c => c + 1);
        await new Promise(r => setTimeout(r, 50));
        if (array[i] === target) break;
      }
    };

    // Run Binary Search
    const runBinary = async () => {
      let low = 0;
      let high = array.length - 1;
      
      while (low <= high) {
        setBinaryRange([low, high]);
        const mid = Math.floor((low + high) / 2);
        setBinaryMid(mid);
        setBinaryCount(c => c + 1);
        await new Promise(r => setTimeout(r, 400)); // Slower to show steps visibly, simpler count

        if (array[mid] === target) break;
        
        if (array[mid] < target) low = mid + 1;
        else high = mid - 1;
      }
    };

    await Promise.all([runLinear(), runBinary()]);
    setRunning(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center bg-slate-800 p-4 rounded-xl border border-slate-700">
        <div className="flex items-center gap-4">
          <div className="text-sm font-bold text-slate-400">Target: <span className="text-white text-xl">{target}</span></div>
          <button 
            onClick={running ? undefined : runSearch}
            disabled={running}
            className={`px-4 py-2 rounded font-bold text-sm ${running ? 'bg-slate-600 text-slate-400' : 'bg-emerald-600 text-white hover:bg-emerald-500'}`}
          >
            {running ? 'Searching...' : 'Start Race'}
          </button>
          <button onClick={reset} disabled={running} className="text-slate-400 hover:text-white text-sm">Reset</button>
        </div>
        <div className="flex gap-8 text-sm font-mono">
          <div>Linear Steps: <span className="text-amber-400 font-bold">{linearCount}</span></div>
          <div>Binary Steps: <span className="text-emerald-400 font-bold">{binaryCount}</span></div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Linear Viz */}
        <div className="relative h-12 bg-slate-900 rounded-lg overflow-hidden flex items-end">
          <div className="absolute top-1 left-2 text-[10px] text-amber-500 font-bold uppercase">Linear Search O(n)</div>
          {array.map((val, i) => (
            <div 
              key={i} 
              className={`flex-1 h-full border-r border-slate-900/50 transition-colors duration-75
                ${i === linearIdx ? 'bg-amber-500' : (linearIdx !== null && i < linearIdx) ? 'bg-slate-800' : 'bg-slate-700'}
                ${val === target && i === linearIdx ? 'bg-emerald-500 !important' : ''}
              `}
            />
          ))}
        </div>

        {/* Binary Viz */}
        <div className="relative h-12 bg-slate-900 rounded-lg overflow-hidden flex items-end">
          <div className="absolute top-1 left-2 text-[10px] text-emerald-500 font-bold uppercase">Binary Search O(log n)</div>
          {array.map((val, i) => {
            const inRange = binaryRange && i >= binaryRange[0] && i <= binaryRange[1];
            const isMid = i === binaryMid;
            return (
              <div 
                key={i} 
                className={`flex-1 h-full border-r border-slate-900/50 transition-colors duration-300
                  ${isMid ? 'bg-white' : inRange ? 'bg-emerald-600' : 'bg-slate-800'}
                  ${val === target && isMid ? 'bg-emerald-400 shadow-[0_0_10px_white] !important' : ''}
                `}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ============================================
// LEVEL 2: BIG-O GRAPH
// ============================================
const BigOGraph = () => {
  const [n, setN] = useState(10);
  
  // Graph Logic
  const width = 600;
  const height = 300;
  const padding = 40;
  const maxY = 100; // Fixed visual scale for normalized comparison
  
  // Functions to plot (normalized for visual comparison at scale)
  const funcs = [
    { fn: (x: number) => 5, color: '#94a3b8', label: 'O(1)' },
    { fn: (x: number) => Math.log2(x) * 5, color: '#34d399', label: 'O(log n)' },
    { fn: (x: number) => x, color: '#60a5fa', label: 'O(n)' },
    { fn: (x: number) => (x * x) / 10, color: '#fbbf24', label: 'O(n²)' },
    { fn: (x: number) => Math.pow(2, x/3), color: '#f87171', label: 'O(2ⁿ)' },
  ];

  const generatePath = (fn: (x: number) => number) => {
    let path = `M ${padding} ${height - padding}`;
    const step = (width - 2 * padding) / n;
    
    for (let i = 0; i <= n; i++) {
      const xVal = i;
      const yVal = fn(xVal);
      
      const px = padding + i * step;
      const py = height - padding - (yVal * (height - 2 * padding) / maxY);
      
      // Clamp
      if (py < padding) break; // Don't draw off top
      path += ` L ${px} ${py}`;
    }
    return path;
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="w-full bg-slate-900 rounded-xl border border-slate-700 p-4 relative overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
          {/* Grid */}
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#475569" strokeWidth="2" />
          <line x1={padding} y1={height - padding} x2={padding} y2={padding} stroke="#475569" strokeWidth="2" />
          <text x={width - padding} y={height - 10} fill="#94a3b8" textAnchor="end" fontSize="12">Input Size (N)</text>
          <text x={10} y={padding} fill="#94a3b8" textAnchor="start" fontSize="12" style={{writingMode: 'vertical-rl'}}>Operations</text>

          {funcs.map((f, i) => (
            <g key={i}>
              <path d={generatePath(f.fn)} fill="none" stroke={f.color} strokeWidth="3" />
              <text x={width - padding + 5} y={height - padding - (f.fn(n) * (height - 2 * padding) / maxY)} fill={f.color} fontSize="12" fontWeight="bold">
                {f.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="flex flex-col items-center w-full max-w-md">
        <div className="flex justify-between w-full text-sm font-bold text-slate-400 mb-2">
          <span>Small N</span>
          <span>Large N</span>
        </div>
        <input 
          type="range" 
          min="5" 
          max="50" 
          value={n} 
          onChange={(e) => setN(parseInt(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />
        <div className="mt-2 text-white font-mono">Current N: {n}</div>
        <div className="text-xs text-slate-500 mt-1 text-center">
          Notice how O(2ⁿ) (Red) shoots off the chart instantly as N grows, while O(log n) (Green) stays almost flat.
        </div>
      </div>
    </div>
  );
};

// ============================================
// LEVEL 3: SORTING RACE
// ============================================
const SortingRace = () => {
  const [arrayA, setArrayA] = useState<number[]>([]);
  const [arrayB, setArrayB] = useState<number[]>([]);
  const [sorting, setSorting] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  useEffect(() => reset(), []);

  const reset = () => {
    const arr = Array.from({ length: 50 }, () => Math.floor(Math.random() * 100));
    setArrayA([...arr]);
    setArrayB([...arr]);
    setSorting(false);
    setWinner(null);
  };

  const runRace = async () => {
    if (sorting) return;
    setSorting(true);
    setWinner(null);

    // Bubble Sort (Slow)
    const runBubble = async () => {
      const arr = [...arrayA];
      const n = arr.length;
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i - 1; j++) {
          if (arr[j] > arr[j + 1]) {
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            setArrayA([...arr]);
            await new Promise(r => setTimeout(r, 1)); // Delay per swap
          }
        }
      }
      return 'bubble';
    };

    // Merge Sort (Fast - Visualization approach simplified)
    const runMerge = async () => {
      const arr = [...arrayB];
      
      const mergeSortHelper = async (start: number, end: number) => {
        if (start >= end) return;
        const mid = Math.floor((start + end) / 2);
        await mergeSortHelper(start, mid);
        await mergeSortHelper(mid + 1, end);
        await merge(start, mid, end);
      };

      const merge = async (start: number, mid: number, end: number) => {
        const left = arr.slice(start, mid + 1);
        const right = arr.slice(mid + 1, end + 1);
        let k = start, i = 0, j = 0;
        
        while (i < left.length && j < right.length) {
          if (left[i] <= right[j]) arr[k++] = left[i++];
          else arr[k++] = right[j++];
          setArrayB([...arr]);
          await new Promise(r => setTimeout(r, 10)); // Delay per write
        }
        while (i < left.length) { arr[k++] = left[i++]; setArrayB([...arr]); await new Promise(r => setTimeout(r, 10)); }
        while (j < right.length) { arr[k++] = right[j++]; setArrayB([...arr]); await new Promise(r => setTimeout(r, 10)); }
      };

      await mergeSortHelper(0, arr.length - 1);
      return 'merge';
    };

    // Race
    const bubblePromise = runBubble();
    const mergePromise = runMerge();

    Promise.race([bubblePromise, mergePromise]).then((w) => {
      if (!winner) setWinner(w === 'bubble' ? 'Bubble Sort' : 'Merge Sort');
    });
    
    await Promise.all([bubblePromise, mergePromise]);
    setSorting(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <button onClick={runRace} disabled={sorting} className="px-6 py-2 bg-indigo-600 text-white font-bold rounded hover:bg-indigo-500 disabled:opacity-50">
          Start Race
        </button>
        {winner && <div className="text-amber-400 font-bold text-lg animate-pulse">Winner: {winner} 🏆</div>}
        <button onClick={reset} disabled={sorting} className="text-slate-400 hover:text-white">Reset Array</button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Bubble Sort */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
          <div className="text-center text-amber-500 font-bold mb-2 uppercase text-xs tracking-widest">Bubble Sort O(n²)</div>
          <div className="flex items-end h-40 gap-0.5">
            {arrayA.map((val, i) => (
              <div key={i} className="flex-1 bg-amber-500/80 rounded-t-sm" style={{ height: `${val}%` }} />
            ))}
          </div>
        </div>

        {/* Merge Sort */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
          <div className="text-center text-emerald-500 font-bold mb-2 uppercase text-xs tracking-widest">Merge Sort O(n log n)</div>
          <div className="flex items-end h-40 gap-0.5">
            {arrayB.map((val, i) => (
              <div key={i} className="flex-1 bg-emerald-500/80 rounded-t-sm" style={{ height: `${val}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// LEVEL 4: TRAVELING SALESMAN (NP-HARD)
// ============================================
const TSPDemo = () => {
  const [cities, setCities] = useState<{x: number, y: number}[]>([]);
  const [path, setPath] = useState<number[]>([]);
  const [bestDist, setBestDist] = useState(Infinity);
  const [computing, setComputing] = useState(false);
  const [method, setMethod] = useState<'brute' | 'greedy' | 'verify' | null>(null);
  const [verificationResult, setVerificationResult] = useState<string | null>(null);

  useEffect(() => {
    generateCities(6);
  }, []);

  const generateCities = (n: number) => {
    const newCities = Array.from({ length: n }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100
    }));
    setCities(newCities);
    setPath([]);
    setBestDist(Infinity);
    setMethod(null);
    setVerificationResult(null);
  };

  const dist = (a: number, b: number) => {
    const c1 = cities[a];
    const c2 = cities[b];
    return Math.sqrt(Math.pow(c1.x - c2.x, 2) + Math.pow(c1.y - c2.y, 2));
  };

  const calcPathDist = (p: number[]) => {
    let d = 0;
    for (let i = 0; i < p.length - 1; i++) {
      d += dist(p[i], p[i+1]);
    }
    d += dist(p[p.length-1], p[0]); // Return to start
    return d;
  };

  // O(N!) - Exponential
  const solveBruteForce = async () => {
    setComputing(true);
    setMethod('brute');
    setBestDist(Infinity);
    setVerificationResult(null);
    
    // Simplified permutation logic for visualization
    const indices = cities.map((_, i) => i).slice(1);
    
    const permuteLoop = async (currentPath: number[], remaining: number[]) => {
       if (remaining.length === 0) {
         const fullPath = [0, ...currentPath];
         const d = calcPathDist(fullPath);
         setPath(fullPath); // Visualize trying this path
         if (d < bestDist) { 
            setBestDist(prev => Math.min(prev, d));
         }
         await new Promise(r => setTimeout(r, 5));
         return;
       }
       for (let i = 0; i < remaining.length; i++) {
         const next = remaining[i];
         const newRem = remaining.filter((_, idx) => idx !== i);
         await permuteLoop([...currentPath, next], newRem);
       }
    }

    if (cities.length > 8) {
      alert("N is too large for Brute Force in browser! Switching to Heuristic.");
      solveGreedy();
      return;
    }

    await permuteLoop([], indices);
    setComputing(false);
  };

  // O(N^2) - Polynomial
  const solveGreedy = async () => {
    setComputing(true);
    setMethod('greedy');
    setVerificationResult(null);
    let current = 0;
    let visited = new Set([0]);
    let p = [0];
    let totalDist = 0;

    while (visited.size < cities.length) {
      let nearest = -1;
      let minD = Infinity;
      
      for (let i = 0; i < cities.length; i++) {
        if (!visited.has(i)) {
          const d = dist(current, i);
          if (d < minD) {
            minD = d;
            nearest = i;
          }
        }
      }
      
      visited.add(nearest);
      p.push(nearest);
      totalDist += minD;
      current = nearest;
      setPath([...p]);
      await new Promise(r => setTimeout(r, 200));
    }
    totalDist += dist(p[p.length-1], p[0]);
    setBestDist(totalDist);
    setComputing(false);
  };

  // O(N) - Verification
  const verifyPath = async () => {
    setComputing(true);
    setMethod('verify');
    // Generate a random valid path to verify
    const randomPath = [0, ...cities.map((_, i) => i).slice(1).sort(() => Math.random() - 0.5)];
    setPath(randomPath);
    
    // Animate verification steps
    let d = 0;
    for (let i = 0; i < randomPath.length; i++) {
       await new Promise(r => setTimeout(r, 100)); // Fast check
       const from = randomPath[i];
       const to = randomPath[(i + 1) % randomPath.length];
       d += dist(from, to);
    }
    setBestDist(d);
    setVerificationResult(`Verified! Length: ${Math.round(d)}`);
    setComputing(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex gap-2">
          <button onClick={() => generateCities(6)} className="px-3 py-1 bg-slate-700 text-slate-300 rounded text-xs">N=6 (Easy)</button>
          <button onClick={() => generateCities(9)} className="px-3 py-1 bg-slate-700 text-slate-300 rounded text-xs">N=9 (Hard)</button>
          <button onClick={() => generateCities(20)} className="px-3 py-1 bg-slate-700 text-slate-300 rounded text-xs">N=20 (Crazy)</button>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          <button onClick={solveBruteForce} disabled={computing} className="px-3 py-2 bg-red-600/80 text-white rounded font-bold hover:bg-red-500 disabled:opacity-50 text-xs">
            Solve (Brute Force)
          </button>
          <button onClick={solveGreedy} disabled={computing} className="px-3 py-2 bg-amber-600/80 text-white rounded font-bold hover:bg-amber-500 disabled:opacity-50 text-xs">
            Solve (Greedy)
          </button>
          <button onClick={verifyPath} disabled={computing} className="px-3 py-2 bg-emerald-600/80 text-white rounded font-bold hover:bg-emerald-500 disabled:opacity-50 text-xs border border-emerald-400">
            Verify Path (Fast)
          </button>
        </div>
      </div>

      <div className="relative w-full aspect-video bg-slate-900 rounded-xl border border-slate-700 overflow-hidden shadow-2xl">
        <svg className="w-full h-full p-4">
          {/* Path */}
          {path.length > 1 && (
            <path 
              d={`M ${cities[path[0]].x}% ${cities[path[0]].y}% ` + path.slice(1).map(i => `L ${cities[i].x}% ${cities[i].y}%`).join(' ') + (path.length === cities.length ? ` Z` : '')}
              fill="none"
              stroke={method === 'brute' ? '#f87171' : method === 'verify' ? '#34d399' : '#f59e0b'}
              strokeWidth="2"
              strokeDasharray={method === 'verify' ? '0' : '5,5'}
              className={method !== 'verify' ? 'animate-pulse' : ''}
            />
          )}
          
          {/* Cities */}
          {cities.map((c, i) => (
            <g key={i} transform={`translate(${c.x}%, ${c.y}%)`}>
              <circle r="6" fill="#f59e0b" />
              <text y="-10" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">#{i}</text>
            </g>
          ))}
        </svg>
        
        {/* Stats */}
        <div className="absolute top-4 left-4 bg-black/60 p-3 rounded backdrop-blur text-xs font-mono">
          <div>Cities: {cities.length}</div>
          <div>Possible Paths: {cities.length > 15 ? 'Too many' : Math.round(cities.length === 0 ? 0 : Array.from({length: cities.length-1}, (_, i) => i+1).reduce((a, b) => a * b, 1)).toLocaleString()}</div>
          <div className="mt-2 text-white">Distance: {bestDist === Infinity ? '-' : Math.round(bestDist)}</div>
          {verificationResult && <div className="mt-2 text-emerald-400 font-bold">{verificationResult}</div>}
        </div>
        
        {/* Comparison Text */}
        <div className="absolute bottom-4 right-4 bg-black/60 p-3 rounded backdrop-blur text-xs font-bold text-slate-300 text-right">
           <div>Finding Best Path: <span className="text-red-400">HARD (NP)</span></div>
           <div>Verifying Path: <span className="text-emerald-400">EASY (P)</span></div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
export const Pillar6: React.FC = () => {
  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-2">Pillar 6: Algorithms & Complexity</h2>
        <p className="text-slate-400">The cost of solving problems. Efficiency is the difference between possible and impossible.</p>
      </div>

      <InfoCard title="Level 1: The Search Problem" icon="🔍">
        <p>
          How do we find data? <strong className="text-amber-400">Linear Search</strong> checks one by one. <strong className="text-emerald-400">Binary Search</strong> cuts the problem in half every step.
          For 1 million items, Linear takes 1 million steps. Binary takes 20.
        </p>
      </InfoCard>

      <SearchDemo />

      <div className="w-full h-px bg-slate-800" />

      <InfoCard title="Level 2: The Shape of Growth" icon="📈">
        <p>
          We measure algorithms by how their time grows with input size (<strong className="text-white">N</strong>). 
          Notice how <strong className="text-red-400">Exponential O(2ⁿ)</strong> explodes vertically, while <strong className="text-emerald-400">Logarithmic O(log n)</strong> stays flat.
        </p>
      </InfoCard>

      <BigOGraph />

      <div className="w-full h-px bg-slate-800" />

      <InfoCard title="Level 3: The Sorting Race" icon="🏁">
        <p>
          <strong className="text-amber-400">Bubble Sort O(n²)</strong> compares every pair. <strong className="text-emerald-400">Merge Sort O(n log n)</strong> divides and conquers.
          At scale, efficient algorithms win by orders of magnitude.
        </p>
      </InfoCard>

      <SortingRace />

      <div className="w-full h-px bg-slate-800" />

      <InfoCard title="Level 4: The P vs NP Problem" icon="🚚">
        <p>
          Some problems, like the <strong className="text-white">Traveling Salesman</strong>, are <strong className="text-red-400">NP-Hard</strong>. 
          Finding the perfect route requires checking essentially all permutations (O(N!)). However, <strong>verifying</strong> a specific route is fast (O(N)).
        </p>
      </InfoCard>

      <TSPDemo />
    </div>
  );
};

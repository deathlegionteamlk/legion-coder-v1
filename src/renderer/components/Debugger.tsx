import React, { useState } from 'react';
import { Bug, Play, Pause, Square, SkipForward, SkipBack, RefreshCw, Eye, EyeOff, Terminal, List, X, ChevronRight, ChevronDown, Circle, AlertCircle, CheckCircle, Info, MoreHorizontal, Filter, Search, Trash2, Plus, Minus } from 'lucide-react';

interface Breakpoint {
id: string;
file: string;
line: number;
column: number;
enabled: boolean;
condition?: string;
}

interface Variable {
name: string;
type: string;
value: string;
scope: 'local' | 'global' | 'closure';
}

interface CallFrame {
id: string;
name: string;
file: string;
line: number;
column: number;
}

interface DebugSession {
id: string;
name: string;
type: string;
status: 'running' | 'paused' | 'stopped';
}

interface DebuggerProps {
isOpen: boolean;
onClose: () => void;
}

export const Debugger: React.FC<DebuggerProps> = ({ isOpen, onClose }) => {
const [activeTab, setActiveTab] = useState<'variables' | 'callstack' | 'breakpoints' | 'console'>('variables');
const [isDebugging, setIsDebugging] = useState(false);
const [isPaused, setIsPaused] = useState(false);
const [selectedFrame, setSelectedFrame] = useState<string | null>(null);
const [expandedVars, setExpandedVars] = useState<Set<string>>(new Set());

const [breakpoints, setBreakpoints] = useState<Breakpoint[]>([
{ id: '1', file: 'src/components/App.tsx', line: 45, column: 0, enabled: true, condition: 'user !== null' },
{ id: '2', file: 'src/utils/api.ts', line: 23, column: 0, enabled: true },
{ id: '3', file: 'src/hooks/useAuth.ts', line: 67, column: 0, enabled: false },
]);

const [variables, setVariables] = useState<Variable[]>([
{ name: 'user', type: 'User | null', value: '{ id: 1, name: "John" }', scope: 'local' },
{ name: 'isLoading', type: 'boolean', value: 'false', scope: 'local' },
{ name: 'data', type: 'Data[]', value: 'Array(5)', scope: 'local' },
{ name: 'API_URL', type: 'string', value: '"https://api.example.com"', scope: 'global' },
{ name: 'MAX_RETRIES', type: 'number', value: '3', scope: 'global' },
]);

const [callStack, setCallStack] = useState<CallFrame[]>([
{ id: '1', name: 'handleSubmit', file: 'src/components/Form.tsx', line: 45, column: 10 },
{ id: '2', name: 'onClick', file: 'src/components/Button.tsx', line: 23, column: 5 },
{ id: '3', name: 'dispatchEvent', file: 'react-dom.development.js', line: 4111, column: 0 },
{ id: '4', name: 'App', file: 'src/App.tsx', line: 12, column: 0 },
]);

const [debugConsole, setDebugConsole] = useState<string[]>([
'> Debug session started',
'> Connected to runtime',
'> Breakpoint hit at src/components/App.tsx:45',
]);

const toggleBreakpoint = (id: string) => {
setBreakpoints(prev => prev.map(bp =>
bp.id === id ? { ...bp, enabled: !bp.enabled } : bp
));
};

const removeBreakpoint = (id: string) => {
setBreakpoints(prev => prev.filter(bp => bp.id !== id));
};

const toggleExpandVar = (name: string) => {
setExpandedVars(prev => {
const newSet = new Set(prev);
if (newSet.has(name)) {
newSet.delete(name);
} else {
newSet.add(name);
}
return newSet;
});
};

const handleStartDebug = () => {
setIsDebugging(true);
setIsPaused(false);
setDebugConsole(prev => [...prev, '> Starting debug session...']);
};

const handlePauseDebug = () => {
setIsPaused(true);
setDebugConsole(prev => [...prev, '> Execution paused']);
};

const handleContinueDebug = () => {
setIsPaused(false);
setDebugConsole(prev => [...prev, '> Continuing execution...']);
};

const handleStopDebug = () => {
setIsDebugging(false);
setIsPaused(false);
setDebugConsole(prev => [...prev, '> Debug session ended']);
};

const handleStepOver = () => {
setDebugConsole(prev => [...prev, '> Step over']);
};

const handleStepInto = () => {
setDebugConsole(prev => [...prev, '> Step into']);
};

const handleStepOut = () => {
setDebugConsole(prev => [...prev, '> Step out']);
};

if (!isOpen) return null;

return (
<div className="h-full flex flex-col glass-panel">
{/* Header */}
<div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
<div className="flex items-center space-x-3">
<Bug className="w-5 h-5 text-red-400" />
<span className="font-semibold text-white">Debug</span>
{isDebugging && (
<span className={`text-xs px-2 py-0.5 rounded-full ${
isPaused ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
}`}>
{isPaused ? 'Paused' : 'Running'}
</span>
)}
</div>
<div className="flex items-center space-x-2">
{!isDebugging ? (
<button
onClick={handleStartDebug}
className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
>
<Play className="w-4 h-4" />
<span>Start</span>
</button>
) : (
<>
{isPaused ? (
<button
onClick={handleContinueDebug}
className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
>
<Play className="w-4 h-4" />
<span>Continue</span>
</button>
) : (
<button
onClick={handlePauseDebug}
className="flex items-center space-x-1 px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm transition-colors"
>
<Pause className="w-4 h-4" />
<span>Pause</span>
</button>
)}
<button
onClick={handleStepOver}
disabled={!isPaused}
className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
title="Step Over (F10)"
>
<SkipForward className="w-4 h-4" />
</button>
<button
onClick={handleStepInto}
disabled={!isPaused}
className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
title="Step Into (F11)"
>
<ChevronRight className="w-4 h-4" />
</button>
<button
onClick={handleStepOut}
disabled={!isPaused}
className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
title="Step Out (Shift+F11)"
>
<SkipBack className="w-4 h-4" />
</button>
<button
onClick={handleStopDebug}
className="flex items-center space-x-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
>
<Square className="w-4 h-4" />
<span>Stop</span>
</button>
</>
)}
<button
onClick={onClose}
className="p-2 hover:bg-white/10 rounded-lg transition-colors"
>
<X className="w-4 h-4 text-gray-400" />
</button>
</div>
</div>

{/* Tabs */}
<div className="flex border-b border-white/10">
{(['variables', 'callstack', 'breakpoints', 'console'] as const).map(tab => (
<button
key={tab}
onClick={() => setActiveTab(tab)}
className={`flex-1 px-4 py-2 text-sm font-medium capitalize transition-colors ${
activeTab === tab
? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/10'
: 'text-gray-400 hover:text-white hover:bg-white/5'
}`}
>
{tab === 'callstack' ? 'Call Stack' : tab}
</button>
))}
</div>

{/* Content */}
<div className="flex-1 overflow-auto">
{activeTab === 'variables' && (
<div className="p-4 space-y-2">
{['local', 'closure', 'global'].map(scope => {
const scopeVars = variables.filter(v => v.scope === scope);
if (scopeVars.length === 0) return null;

return (
<div key={scope}>
<div className="flex items-center space-x-2 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
{scope === 'local' && <Eye className="w-3 h-3" />}
{scope === 'global' && <EyeOff className="w-3 h-3" />}
<span>{scope} Variables</span>
</div>
<div className="space-y-1">
{scopeVars.map(variable => (
<div
key={variable.name}
className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 group cursor-pointer"
onClick={() => toggleExpandVar(variable.name)}
>
<div className="flex items-center space-x-2">
{expandedVars.has(variable.name) ? (
<ChevronDown className="w-3 h-3 text-gray-500" />
) : (
<ChevronRight className="w-3 h-3 text-gray-500" />
)}
<span className="text-sm font-medium text-blue-400">{variable.name}</span>
<span className="text-xs text-gray-500">{variable.type}</span>
</div>
<span className="text-sm text-gray-300 truncate max-w-[200px]">
{variable.value}
</span>
</div>
))}
</div>
</div>
);
})}
</div>
)}

{activeTab === 'callstack' && (
<div className="p-2">
{callStack.map((frame, index) => (
<button
key={frame.id}
onClick={() => setSelectedFrame(frame.id)}
className={`w-full flex items-center p-3 rounded-lg transition-colors text-left ${
selectedFrame === frame.id
? 'bg-blue-500/20 border-l-2 border-blue-500'
: 'hover:bg-white/5 border-l-2 border-transparent'
}`}
>
<div className="flex items-center space-x-3 flex-1">
<span className="text-xs text-gray-500 w-6">{index}</span>
<div className="flex-1">
<div className="text-sm font-medium text-white">{frame.name}</div>
<div className="text-xs text-gray-400">
{frame.file}:{frame.line}:{frame.column}
</div>
</div>
</div>
</button>
))}
</div>
)}

{activeTab === 'breakpoints' && (
<div className="p-2">
<div className="flex items-center justify-between px-3 py-2 mb-2">
<span className="text-sm text-gray-400">{breakpoints.length} breakpoints</span>
<div className="flex space-x-2">
<button className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white" title="Toggle All">
<Eye className="w-4 h-4" />
</button>
<button className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white" title="Remove All">
<Trash2 className="w-4 h-4" />
</button>
</div>
</div>
<div className="space-y-1">
{breakpoints.map(bp => (
<div
key={bp.id}
className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 group"
>
<div className="flex items-center space-x-3">
<button
onClick={() => toggleBreakpoint(bp.id)}
className={`w-3 h-3 rounded-full ${
bp.enabled ? 'bg-red-500' : 'bg-gray-600'
}`}
/>
<div>
<div className="text-sm text-white">{bp.file}</div>
<div className="text-xs text-gray-400">Line {bp.line + 1}</div>
</div>
</div>
<div className="flex items-center space-x-2">
{bp.condition && (
<span className="text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded">
Condition
</span>
)}
<button
onClick={() => removeBreakpoint(bp.id)}
className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-red-400 transition-opacity"
>
<X className="w-4 h-4" />
</button>
</div>
</div>
))}
</div>
</div>
)}

{activeTab === 'console' && (
<div className="flex flex-col h-full">
<div className="flex-1 overflow-auto p-4 font-mono text-sm space-y-1">
{debugConsole.map((line, i) => (
<div key={i} className="text-gray-300">
{line.startsWith('>') ? (
<span className="text-blue-400">{line}</span>
) : line.startsWith('Error') ? (
<span className="text-red-400">{line}</span>
) : line.startsWith('Warning') ? (
<span className="text-yellow-400">{line}</span>
) : (
<span>{line}</span>
)}
</div>
))}
</div>
<div className="p-3 border-t border-white/10">
<div className="flex items-center space-x-2">
<span className="text-gray-500">&gt;</span>
<input
type="text"
placeholder="Enter debug command..."
className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-sm"
/>
</div>
</div>
</div>
)}
</div>
</div>
);
};
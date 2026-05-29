import React, { useState, useEffect } from 'react';
import { Activity, X, Clock, MemoryStick, Cpu, BarChart3, Play, Square, RefreshCw } from 'lucide-react';

interface PerformanceMetrics {
memory: number;
cpu: number;
renderTime: number;
frameRate: number;
}

interface ProfilerProps {
isOpen: boolean;
onClose: () => void;
}

export const Profiler: React.FC<ProfilerProps> = ({ isOpen, onClose }) => {
const [isRecording, setIsRecording] = useState(false);
const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);
const [currentMetrics, setCurrentMetrics] = useState<PerformanceMetrics>({
memory: 0,
cpu: 0,
renderTime: 0,
frameRate: 60,
});

useEffect(() => {
if (!isRecording) return;

const interval = setInterval(() => {
const newMetric: PerformanceMetrics = {
memory: Math.random() * 500 + 100,
cpu: Math.random() * 30 + 10,
renderTime: Math.random() * 16 + 4,
frameRate: 60 - Math.random() * 10,
};

setCurrentMetrics(newMetric);
setMetrics(prev => [...prev.slice(-50), newMetric]);
}, 1000);

return () => clearInterval(interval);
}, [isRecording]);

const average = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

const avgMemory = average(metrics.map(m => m.memory));
const avgCpu = average(metrics.map(m => m.cpu));
const avgRenderTime = average(metrics.map(m => m.renderTime));
const avgFrameRate = average(metrics.map(m => m.frameRate));

if (!isOpen) return null;

return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
<div className="w-full max-w-5xl h-[80vh] glass-panel rounded-xl overflow-hidden flex flex-col">
<div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
<div className="flex items-center space-x-3">
<Activity className="w-6 h-6 text-purple-400" />
<h2 className="text-xl font-bold text-white">Performance Profiler</h2>
</div>
<div className="flex items-center space-x-2">
<button
onClick={() => setIsRecording(!isRecording)}
className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-colors ${
isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
}`}
>
{isRecording ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
<span>{isRecording ? 'Stop' : 'Start'} Recording</span>
</button>
<button
onClick={() => setMetrics([])}
className="p-2 hover:bg-white/10 rounded-lg text-gray-400"
>
<RefreshCw className="w-5 h-5" />
</button>
<button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
<X className="w-5 h-5 text-gray-400" />
</button>
</div>
</div>

<div className="flex-1 overflow-auto p-6">
{/* Metrics Cards */}
<div className="grid grid-cols-4 gap-4 mb-6">
<div className="glass-panel p-4 rounded-lg">
<div className="flex items-center space-x-2 mb-2">
<MemoryStick className="w-5 h-5 text-blue-400" />
<span className="text-sm text-gray-400">Memory Usage</span>
</div>
<div className="text-2xl font-bold text-white">{currentMetrics.memory.toFixed(1)} MB</div>
<div className="text-xs text-gray-500">Avg: {avgMemory.toFixed(1)} MB</div>
</div>

<div className="glass-panel p-4 rounded-lg">
<div className="flex items-center space-x-2 mb-2">
<Cpu className="w-5 h-5 text-green-400" />
<span className="text-sm text-gray-400">CPU Usage</span>
</div>
<div className="text-2xl font-bold text-white">{currentMetrics.cpu.toFixed(1)}%</div>
<div className="text-xs text-gray-500">Avg: {avgCpu.toFixed(1)}%</div>
</div>

<div className="glass-panel p-4 rounded-lg">
<div className="flex items-center space-x-2 mb-2">
<Clock className="w-5 h-5 text-yellow-400" />
<span className="text-sm text-gray-400">Render Time</span>
</div>
<div className="text-2xl font-bold text-white">{currentMetrics.renderTime.toFixed(1)} ms</div>
<div className="text-xs text-gray-500">Avg: {avgRenderTime.toFixed(1)} ms</div>
</div>

<div className="glass-panel p-4 rounded-lg">
<div className="flex items-center space-x-2 mb-2">
<BarChart3 className="w-5 h-5 text-purple-400" />
<span className="text-sm text-gray-400">Frame Rate</span>
</div>
<div className="text-2xl font-bold text-white">{currentMetrics.frameRate.toFixed(0)} FPS</div>
<div className="text-xs text-gray-500">Avg: {avgFrameRate.toFixed(0)} FPS</div>
</div>
</div>

{/* Charts */}
<div className="glass-panel rounded-lg p-4 mb-4">
<h3 className="text-sm font-semibold text-white mb-4">Memory Usage Over Time</h3>
<div className="h-48 flex items-end space-x-1">
{metrics.map((m, i) => (
<div
key={i}
className="flex-1 bg-blue-500/50 hover:bg-blue-500/70 transition-colors rounded-t"
style={{ height: `${(m.memory / 700) * 100}%` }}
title={`${m.memory.toFixed(1)} MB`}
/>
))}
</div>
</div>

<div className="glass-panel rounded-lg p-4">
<h3 className="text-sm font-semibold text-white mb-4">CPU Usage Over Time</h3>
<div className="h-48 flex items-end space-x-1">
{metrics.map((m, i) => (
<div
key={i}
className="flex-1 bg-green-500/50 hover:bg-green-500/70 transition-colors rounded-t"
style={{ height: `${m.cpu}%` }}
title={`${m.cpu.toFixed(1)}%`}
/>
))}
</div>
</div>
</div>
</div>
</div>
);
};
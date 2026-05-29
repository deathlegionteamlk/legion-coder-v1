import React, { useEffect, useRef, useState } from 'react';
import { Map, X } from 'lucide-react';

interface MinimapProps {
isOpen: boolean;
onClose: () => void;
content?: string;
language?: string;
}

export const Minimap: React.FC<MinimapProps> = ({ isOpen, onClose, content = '', language = 'javascript' }) => {
const canvasRef = useRef<HTMLCanvasElement>(null);
const [scale, setScale] = useState(0.2);

useEffect(() => {
if (!canvasRef.current || !content) return;

const canvas = canvasRef.current;
const ctx = canvas.getContext('2d');
if (!ctx) return;

const lines = content.split('\n');
const lineHeight = 2;
const canvasHeight = lines.length * lineHeight;
const canvasWidth = 200;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

ctx.fillStyle = '#1e1e1e';
ctx.fillRect(0, 0, canvasWidth, canvasHeight);

const colorMap: Record<string, string> = {
keyword: '#569cd6',
string: '#ce9178',
comment: '#6a9955',
function: '#dcdcaa',
number: '#b5cea8',
operator: '#d4d4d4',
};

lines.forEach((line, index) => {
const y = index * lineHeight;

// Simple syntax highlighting based on patterns
if (line.trim().startsWith('//') || line.trim().startsWith('#')) {
ctx.fillStyle = colorMap.comment;
} else if (/\b(function|const|let|var|class|import|export|return|if|else|for|while)\b/.test(line)) {
ctx.fillStyle = colorMap.keyword;
} else if (/["'`]/.test(line)) {
ctx.fillStyle = colorMap.string;
} else if (/\b\d+\b/.test(line)) {
ctx.fillStyle = colorMap.number;
} else {
ctx.fillStyle = colorMap.operator;
}

const lineWidth = Math.min(line.length * 0.5, canvasWidth);
ctx.fillRect(0, y, lineWidth, lineHeight - 0.5);
});
}, [content, language]);

if (!isOpen) return null;

return (
<div className="fixed right-4 top-20 z-40 glass-panel rounded-lg overflow-hidden shadow-2xl" style={{ width: '220px' }}>
<div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
<div className="flex items-center space-x-2">
<Map className="w-4 h-4 text-purple-400" />
<span className="text-sm font-medium text-white">Minimap</span>
</div>
<button onClick={onClose} className="text-gray-400 hover:text-white">
<X className="w-4 h-4" />
</button>
</div>
<div className="p-2" style={{ maxHeight: '400px', overflow: 'hidden' }}>
<canvas
ref={canvasRef}
className="w-full rounded"
style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
/>
</div>
<div className="px-3 py-2 border-t border-white/10 flex items-center justify-between">
<span className="text-xs text-gray-400">{content.split('\n').length} lines</span>
<input
 type="range"
min="0.1"
max="0.5"
step="0.05"
value={scale}
onChange={(e) => setScale(parseFloat(e.target.value))}
className="w-20"
/>
</div>
</div>
);
};
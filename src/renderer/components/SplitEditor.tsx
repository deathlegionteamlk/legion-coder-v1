import React, { useState } from 'react';
import { Columns, X, Layout, Maximize2, Minimize2 } from 'lucide-react';

interface SplitEditorProps {
isOpen: boolean;
onClose: () => void;
primaryContent?: string;
secondaryContent?: string;
language?: string;
}

export const SplitEditor: React.FC<SplitEditorProps> = ({
isOpen,
onClose,
primaryContent = '',
secondaryContent = '',
language = 'javascript'
}) => {
const [splitDirection, setSplitDirection] = useState<'horizontal' | 'vertical'>('vertical');
const [splitRatio, setSplitRatio] = useState(50);
const [isFullscreen, setIsFullscreen] = useState(false);

if (!isOpen) return null;

return (
<div className={`fixed z-50 bg-black/90 backdrop-blur-sm ${isFullscreen ? 'inset-0' : 'inset-4 rounded-xl overflow-hidden glass-panel'}`}>
{/* Header */}
<div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
<div className="flex items-center space-x-3">
<Columns className="w-5 h-5 text-purple-400" />
<h2 className="text-lg font-bold text-white">Split Editor</h2>
</div>
<div className="flex items-center space-x-2">
<button
onClick={() => setSplitDirection(splitDirection === 'vertical' ? 'horizontal' : 'vertical')}
className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white"
title="Toggle split direction"
>
<Layout className="w-4 h-4" />
</button>
<button
onClick={() => setIsFullscreen(!isFullscreen)}
className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white"
title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
>
{isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
</button>
<button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
<X className="w-5 h-5 text-gray-400" />
</button>
</div>
</div>

{/* Split View */}
<div
className={`flex-1 flex ${splitDirection === 'horizontal' ? 'flex-col' : 'flex-row'}`}
style={{ height: 'calc(100% - 60px)' }}
>
{/* Primary Editor */}
<div
className="border-r border-white/10 overflow-hidden"
style={{ [splitDirection === 'vertical' ? 'width' : 'height']: `${splitRatio}%` }}
>
<div className="h-full flex flex-col">
<div className="px-3 py-2 bg-white/5 text-xs text-gray-400 border-b border-white/10">
Primary Editor
</div>
<textarea
value={primaryContent}
readOnly
className="flex-1 p-4 bg-transparent text-white font-mono text-sm resize-none focus:outline-none"
spellCheck={false}
/>
</div>
</div>

{/* Resizer */}
<div
className={`${splitDirection === 'vertical' ? 'w-1 cursor-col-resize' : 'h-1 cursor-row-resize'} bg-white/10 hover:bg-purple-500/50 transition-colors`}
onMouseDown={(e) => {
const start = splitDirection === 'vertical' ? e.clientX : e.clientY;
const startRatio = splitRatio;

const handleMove = (e: MouseEvent) => {
const current = splitDirection === 'vertical' ? e.clientX : e.clientY;
const delta = ((current - start) / (splitDirection === 'vertical' ? window.innerWidth : window.innerHeight)) * 100;
setSplitRatio(Math.max(20, Math.min(80, startRatio + delta)));
};

const handleUp = () => {
document.removeEventListener('mousemove', handleMove);
document.removeEventListener('mouseup', handleUp);
};

document.addEventListener('mousemove', handleMove);
document.addEventListener('mouseup', handleUp);
}}
/>

{/* Secondary Editor */}
<div
className="overflow-hidden"
style={{ [splitDirection === 'vertical' ? 'width' : 'height']: `${100 - splitRatio}%` }}
>
<div className="h-full flex flex-col">
<div className="px-3 py-2 bg-white/5 text-xs text-gray-400 border-b border-white/10">
Secondary Editor
</div>
<textarea
value={secondaryContent}
readOnly
className="flex-1 p-4 bg-transparent text-white font-mono text-sm resize-none focus:outline-none"
spellCheck={false}
/>
</div>
</div>
</div>
</div>
);
};
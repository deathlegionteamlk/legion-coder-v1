import React, { useState } from 'react';
import { Download, X, FileText, FileCode, FileJson, FileImage, Check, Copy } from 'lucide-react';

interface ExportPanelProps {
isOpen: boolean;
onClose: () => void;
content?: string;
filename?: string;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ isOpen, onClose, content = '', filename = 'document' }) => {
const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'html' | 'markdown' | 'json'>('markdown');
const [isExporting, setIsExporting] = useState(false);
const [exported, setExported] = useState(false);
const [preview, setPreview] = useState('');

const formats = [
{ id: 'pdf', name: 'PDF Document', icon: <FileImage className="w-5 h-5" />, description: 'Portable Document Format', extension: '.pdf' },
{ id: 'html', name: 'HTML Page', icon: <FileCode className="w-5 h-5" />, description: 'Web-ready HTML with styles', extension: '.html' },
{ id: 'markdown', name: 'Markdown', icon: <FileText className="w-5 h-5" />, description: 'Plain Markdown text', extension: '.md' },
{ id: 'json', name: 'JSON', icon: <FileJson className="w-5 h-5" />, description: 'Structured JSON data', extension: '.json' },
];

const generatePreview = () => {
const format = formats.find(f => f.id === selectedFormat);
if (!format) return;

let previewContent = '';

switch (selectedFormat) {
case 'html':
previewContent = `<!DOCTYPE html>
<html>
<head>
<title>${filename}</title>
<style>
body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; }
code { background: #f5f5f5; padding: 0.2em 0.4em; border-radius: 3px; }
pre { background: #f5f5f5; padding: 1rem; border-radius: 8px; overflow-x: auto; }
</style>
</head>
<body>
${content.replace(/\n/g, '<br>')}
</body>
</html>`;
break;
case 'markdown':
previewContent = `# ${filename}

${content}

---
*Exported from LEGION Coder v1*`;
break;
case 'json':
previewContent = JSON.stringify({
filename,
content,
exportedAt: new Date().toISOString(),
editor: 'LEGION Coder v1'
}, null, 2);
break;
default:
previewContent = content;
}

setPreview(previewContent);
};

const handleExport = async () => {
setIsExporting(true);

// Simulate export
await new Promise(resolve => setTimeout(resolve, 1500));

const format = formats.find(f => f.id === selectedFormat);
const blob = new Blob([preview], { type: 'text/plain' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = `${filename}${format?.extension || '.txt'}`;
a.click();
URL.revokeObjectURL(url);

setIsExporting(false);
setExported(true);
setTimeout(() => setExported(false), 3000);
};

const copyToClipboard = async () => {
try {
await navigator.clipboard.writeText(preview);
} catch (err) {
console.error('Failed to copy:', err);
}
};

if (!isOpen) return null;

return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
<div className="w-full max-w-4xl h-[80vh] glass-panel rounded-xl overflow-hidden flex flex-col">
<div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
<div className="flex items-center space-x-3">
<Download className="w-6 h-6 text-purple-400" />
<h2 className="text-xl font-bold text-white">Export Document</h2>
</div>
<button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
<X className="w-5 h-5 text-gray-400" />
</button>
</div>

<div className="flex-1 flex overflow-hidden">
{/* Format Selection */}
<div className="w-64 border-r border-white/10 p-4">
<h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Format</h3>
<div className="space-y-2">
{formats.map(format => (
<button
key={format.id}
onClick={() => { setSelectedFormat(format.id as any); setPreview(''); }}
className={`w-full flex items-start space-x-3 p-3 rounded-lg transition-colors text-left ${
selectedFormat === format.id
? 'bg-purple-500/20 border border-purple-500/50'
: 'hover:bg-white/5 border border-transparent'
}`}
>
<span className={selectedFormat === format.id ? 'text-purple-400' : 'text-gray-400'}>
{format.icon}
</span>
<div>
<div className={`text-sm font-medium ${selectedFormat === format.id ? 'text-white' : 'text-gray-300'}`}>
{format.name}
</div>
<div className="text-xs text-gray-500">{format.description}</div>
</div>
</button>
))}
</div>
</div>

{/* Preview */}
<div className="flex-1 flex flex-col">
<div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
<span className="text-sm font-medium text-white">Preview</span>
<div className="flex items-center space-x-2">
<button
onClick={generatePreview}
className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded text-sm text-white transition-colors"
>
Generate Preview
</button>
<button
onClick={copyToClipboard}
className="p-1.5 hover:bg-white/10 rounded text-gray-400"
title="Copy to clipboard"
>
<Copy className="w-4 h-4" />
</button>
</div>
</div>

<div className="flex-1 p-4 overflow-auto">
{preview ? (
<pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">{preview}</pre>
) : (
<div className="flex items-center justify-center h-full text-gray-500">
<p>Click "Generate Preview" to see export content</p>
</div>
)}
</div>

<div className="p-4 border-t border-white/10">
<button
onClick={handleExport}
disabled={isExporting || !preview}
className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 rounded-lg text-white transition-colors"
>
{isExporting ? (
<>
<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
<span>Exporting...</span>
</>
) : exported ? (
<>
<Check className="w-4 h-4" />
<span>Exported!</span>
</>
) : (
<>
<Download className="w-4 h-4" />
<span>Export {formats.find(f => f.id === selectedFormat)?.name}</span>
</>
)}
</button>
</div>
</div>
</div>
</div>
</div>
);
};
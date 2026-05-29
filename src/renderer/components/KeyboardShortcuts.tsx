import React, { useState } from 'react';
import { Keyboard, X, Search, Plus, Trash2, Command, Save } from 'lucide-react';

interface Shortcut {
id: string;
command: string;
keybinding: string;
context: string;
}

interface KeyboardShortcutsProps {
isOpen: boolean;
onClose: () => void;
}

export const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({ isOpen, onClose }) => {
const [searchTerm, setSearchTerm] = useState('');
const [selectedPreset, setSelectedPreset] = useState<'default' | 'vim' | 'emacs'>('default');
const [shortcuts, setShortcuts] = useState<Shortcut[]>([
{ id: '1', command: 'Command Palette', keybinding: 'Ctrl+Shift+P', context: 'Global' },
{ id: '2', command: 'Quick Open', keybinding: 'Ctrl+P', context: 'Global' },
{ id: '3', command: 'Save File', keybinding: 'Ctrl+S', context: 'Editor' },
{ id: '4', command: 'Find in File', keybinding: 'Ctrl+F', context: 'Editor' },
{ id: '5', command: 'Replace in File', keybinding: 'Ctrl+H', context: 'Editor' },
{ id: '6', command: 'Go to Line', keybinding: 'Ctrl+G', context: 'Editor' },
{ id: '7', command: 'Toggle Terminal', keybinding: 'Ctrl+`', context: 'Global' },
{ id: '8', command: 'Toggle Sidebar', keybinding: 'Ctrl+B', context: 'Global' },
{ id: '9', command: 'New File', keybinding: 'Ctrl+N', context: 'Global' },
{ id: '10', command: 'Close Editor', keybinding: 'Ctrl+W', context: 'Editor' },
{ id: '11', command: 'Undo', keybinding: 'Ctrl+Z', context: 'Editor' },
{ id: '12', command: 'Redo', keybinding: 'Ctrl+Shift+Z', context: 'Editor' },
{ id: '13', command: 'Cut', keybinding: 'Ctrl+X', context: 'Editor' },
{ id: '14', command: 'Copy', keybinding: 'Ctrl+C', context: 'Editor' },
{ id: '15', command: 'Paste', keybinding: 'Ctrl+V', context: 'Editor' },
{ id: '16', command: 'Select All', keybinding: 'Ctrl+A', context: 'Editor' },
{ id: '17', command: 'Format Document', keybinding: 'Shift+Alt+F', context: 'Editor' },
{ id: '18', command: 'Toggle Comment', keybinding: 'Ctrl+/', context: 'Editor' },
{ id: '19', command: 'Fold All', keybinding: 'Ctrl+K Ctrl+0', context: 'Editor' },
{ id: '20', command: 'Unfold All', keybinding: 'Ctrl+K Ctrl+J', context: 'Editor' },
]);

const filteredShortcuts = shortcuts.filter(s =>
s.command.toLowerCase().includes(searchTerm.toLowerCase()) ||
s.keybinding.toLowerCase().includes(searchTerm.toLowerCase())
);

const presets = [
{ id: 'default', name: 'Default', description: 'Standard VS Code-like keybindings' },
{ id: 'vim', name: 'Vim', description: 'Vim-style modal editing' },
{ id: 'emacs', name: 'Emacs', description: 'Emacs-style keybindings' },
];

if (!isOpen) return null;

return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
<div className="w-full max-w-4xl h-[80vh] glass-panel rounded-xl overflow-hidden flex flex-col">
<div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
<div className="flex items-center space-x-3">
<Keyboard className="w-6 h-6 text-purple-400" />
<h2 className="text-xl font-bold text-white">Keyboard Shortcuts</h2>
</div>
<button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
<X className="w-5 h-5 text-gray-400" />
</button>
</div>

<div className="flex-1 flex overflow-hidden">
{/* Sidebar */}
<div className="w-64 border-r border-white/10 p-4">
<h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Keymap Presets</h3>
<div className="space-y-2">
{presets.map(preset => (
<button
key={preset.id}
onClick={() => setSelectedPreset(preset.id as any)}
className={`w-full text-left p-3 rounded-lg transition-colors ${
selectedPreset === preset.id
? 'bg-purple-500/20 border border-purple-500/50'
: 'hover:bg-white/5 border border-transparent'
}`}
>
<div className={`text-sm font-medium ${selectedPreset === preset.id ? 'text-white' : 'text-gray-300'}`}>
{preset.name}
</div>
<div className="text-xs text-gray-500">{preset.description}</div>
</button>
))}
</div>

<div className="mt-6 p-4 bg-white/5 rounded-lg">
<h4 className="text-sm font-medium text-white mb-2">Current Mode</h4>
<div className="flex items-center space-x-2">
<Command className="w-4 h-4 text-purple-400" />
<span className="text-sm text-gray-300 capitalize">{selectedPreset} Mode</span>
</div>
</div>
</div>

{/* Main Content */}
<div className="flex-1 flex flex-col">
<div className="p-4 border-b border-white/10">
<div className="relative">
<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
<input
 type="text"
value={searchTerm}
onChange={(e) => setSearchTerm(e.target.value)}
placeholder="Search shortcuts..."
className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
/>
</div>
</div>

<div className="flex-1 overflow-auto">
<table className="w-full">
<thead className="bg-white/5 sticky top-0">
<tr>
<th className="text-left px-4 py-2 text-xs font-semibold text-gray-400 uppercase">Command</th>
<th className="text-left px-4 py-2 text-xs font-semibold text-gray-400 uppercase">Keybinding</th>
<th className="text-left px-4 py-2 text-xs font-semibold text-gray-400 uppercase">Context</th>
<th className="text-right px-4 py-2 text-xs font-semibold text-gray-400 uppercase">Actions</th>
</tr>
</thead>
<tbody>
{filteredShortcuts.map(shortcut => (
<tr key={shortcut.id} className="border-b border-white/5 hover:bg-white/5">
<td className="px-4 py-3 text-sm text-white">{shortcut.command}</td>
<td className="px-4 py-3">
<kbd className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300 font-mono">
{shortcut.keybinding}
</kbd>
</td>
<td className="px-4 py-3 text-sm text-gray-400">{shortcut.context}</td>
<td className="px-4 py-3 text-right">
<button className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white">
<Plus className="w-4 h-4" />
</button>
<button className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-red-400">
<Trash2 className="w-4 h-4" />
</button>
</td>
</tr>
))}
</tbody>
</table>
</div>

<div className="p-4 border-t border-white/10 flex items-center justify-between">
<span className="text-sm text-gray-400">{filteredShortcuts.length} shortcuts</span>
<button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors">
<Save className="w-4 h-4" />
<span>Save Changes</span>
</button>
</div>
</div>
</div>
</div>
</div>
);
};
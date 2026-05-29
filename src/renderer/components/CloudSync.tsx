import React, { useState } from 'react';
import { Cloud, X, Check, RefreshCw, Settings, Upload, Download, Trash2, AlertCircle } from 'lucide-react';

interface SyncItem {
id: string;
name: string;
type: 'settings' | 'snippets' | 'themes' | 'shortcuts';
lastSynced: string | null;
size: string;
}

interface CloudSyncProps {
isOpen: boolean;
onClose: () => void;
}

export const CloudSync: React.FC<CloudSyncProps> = ({ isOpen, onClose }) => {
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [isSyncing, setIsSyncing] = useState(false);
const [syncItems, setSyncItems] = useState<SyncItem[]>([
{ id: '1', name: 'Editor Settings', type: 'settings', lastSynced: '2024-01-15 10:30', size: '12 KB' },
{ id: '2', name: 'Code Snippets', type: 'snippets', lastSynced: '2024-01-14 15:45', size: '156 KB' },
{ id: '3', name: 'Custom Themes', type: 'themes', lastSynced: null, size: '89 KB' },
{ id: '4', name: 'Keyboard Shortcuts', type: 'shortcuts', lastSynced: '2024-01-15 09:00', size: '8 KB' },
]);
const [syncDirection, setSyncDirection] = useState<'upload' | 'download'>('upload');

const handleLogin = () => {
setIsLoggedIn(true);
};

const handleSync = async (itemId: string) => {
setIsSyncing(true);
await new Promise(resolve => setTimeout(resolve, 1500));

setSyncItems(prev => prev.map(item =>
item.id === itemId ? { ...item, lastSynced: new Date().toLocaleString() } : item
));

setIsSyncing(false);
};

const handleSyncAll = async () => {
setIsSyncing(true);
await new Promise(resolve => setTimeout(resolve, 3000));

setSyncItems(prev => prev.map(item => ({
...item,
lastSynced: new Date().toLocaleString()
})));

setIsSyncing(false);
};

if (!isOpen) return null;

return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
<div className="w-full max-w-2xl glass-panel rounded-xl overflow-hidden flex flex-col">
<div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
<div className="flex items-center space-x-3">
<Cloud className="w-6 h-6 text-purple-400" />
<h2 className="text-xl font-bold text-white">Cloud Sync</h2>
</div>
<button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
<X className="w-5 h-5 text-gray-400" />
</button>
</div>

{!isLoggedIn ? (
<div className="p-8 text-center">
<Cloud className="w-16 h-16 text-purple-400 mx-auto mb-4" />
<h3 className="text-lg font-semibold text-white mb-2">Sync Your Settings</h3>
<p className="text-gray-400 mb-6">Keep your preferences, snippets, and themes synchronized across all your devices.</p>

<div className="space-y-3 max-w-sm mx-auto">
<button
onClick={handleLogin}
className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors"
>
<span>Sign in with GitHub</span>
</button>
<button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors">
<span>Sign in with Google</span>
</button>
</div>
</div>
) : (
<>
<div className="p-4 border-b border-white/10">
<div className="flex items-center justify-between">
<div className="flex items-center space-x-4">
<button
onClick={() => setSyncDirection('upload')}
className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
syncDirection === 'upload' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'
}`}
>
<Upload className="w-4 h-4" />
<span>Upload</span>
</button>
<button
onClick={() => setSyncDirection('download')}
className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
syncDirection === 'download' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'
}`}
>
<Download className="w-4 h-4" />
<span>Download</span>
</button>
</div>
<button
onClick={handleSyncAll}
disabled={isSyncing}
className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-lg text-white transition-colors"
>
<RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
<span>{isSyncing ? 'Syncing...' : 'Sync All'}</span>
</button>
</div>
</div>

<div className="p-4">
<div className="space-y-2">
{syncItems.map(item => (
<div key={item.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
<div className="flex items-center space-x-3">
<div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
item.lastSynced ? 'bg-green-500/20' : 'bg-yellow-500/20'
}`}>
{item.lastSynced ? <Check className="w-5 h-5 text-green-400" /> : <AlertCircle className="w-5 h-5 text-yellow-400" />}
</div>
<div>
<div className="text-sm font-medium text-white">{item.name}</div>
<div className="text-xs text-gray-500">
{item.lastSynced ? `Last synced: ${item.lastSynced}` : 'Not synced'} • {item.size}
</div>
</div>
</div>
<div className="flex items-center space-x-2">
<button
onClick={() => handleSync(item.id)}
disabled={isSyncing}
className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
title={syncDirection === 'upload' ? 'Upload' : 'Download'}
>
{syncDirection === 'upload' ? <Upload className="w-4 h-4" /> : <Download className="w-4 h-4" />}
</button>
<button
className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
title="Delete from cloud"
>
<Trash2 className="w-4 h-4" />
</button>
</div>
</div>
))}
</div>
</div>

<div className="p-4 border-t border-white/10">
<div className="flex items-center justify-between text-sm text-gray-400">
<span>Storage used: 265 KB / 100 MB</span>
<button className="flex items-center space-x-1 text-purple-400 hover:text-purple-300">
<Settings className="w-4 h-4" />
<span>Sync Settings</span>
</button>
</div>
<div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
<div className="h-full bg-purple-500 rounded-full" style={{ width: '0.3%' }} />
</div>
</div>
</>
)}
</div>
</div>
);
};
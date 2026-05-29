import React, { useState } from 'react';
import { Puzzle, Download, Trash2, Settings, Star, Zap, Shield, AlertCircle, Check, X, Search, Filter, Grid, List, RefreshCw, ExternalLink, Code, Package, Cpu, Globe, Database, Terminal, GitBranch, Bug, Sparkles } from 'lucide-react';

interface Plugin {
id: string;
name: string;
description: string;
author: string;
version: string;
downloads: number;
rating: number;
isInstalled: boolean;
isEnabled: boolean;
category: string;
tags: string[];
icon: string;
}

const PLUGINS: Plugin[] = [
{
id: '1',
name: 'ESLint',
description: 'Integrates ESLint JavaScript/TypeScript linting',
author: 'Microsoft',
version: '2.4.2',
downloads: 45200000,
rating: 4.8,
isInstalled: true,
isEnabled: true,
category: 'Linters',
tags: ['javascript', 'typescript', 'linting'],
icon: 'shield'
},
{
id: '2',
name: 'Prettier',
description: 'Code formatter using prettier',
author: 'Prettier',
version: '10.1.0',
downloads: 38900000,
rating: 4.9,
isInstalled: true,
isEnabled: true,
category: 'Formatters',
tags: ['formatter', 'prettier', 'code-style'],
icon: 'sparkles'
},
{
id: '3',
name: 'GitLens',
description: 'Supercharge the Git capabilities',
author: 'GitKraken',
version: '14.5.0',
downloads: 28400000,
rating: 4.7,
isInstalled: false,
isEnabled: false,
category: 'SCM',
tags: ['git', 'source-control', 'history'],
icon: 'git'
},
{
id: '4',
name: 'Docker',
description: 'Makes it easy to build, manage, and deploy containerized applications',
author: 'Microsoft',
version: '1.28.0',
downloads: 19800000,
rating: 4.6,
isInstalled: false,
isEnabled: false,
category: 'Containers',
tags: ['docker', 'containers', 'devops'],
icon: 'package'
},
{
id: '5',
name: 'Thunder Client',
description: 'Lightweight REST API Client for Testing APIs',
author: 'Ranga Vadhineni',
version: '2.16.0',
downloads: 12500000,
rating: 4.8,
isInstalled: false,
isEnabled: false,
category: 'Testing',
tags: ['http', 'rest', 'api', 'testing'],
icon: 'globe'
},
{
id: '6',
name: 'Database Client',
description: 'Database manager for MySQL, PostgreSQL, SQLite, Redis',
author: 'Weijan Chen',
version: '6.9.0',
downloads: 8900000,
rating: 4.7,
isInstalled: false,
isEnabled: false,
category: 'Database',
tags: ['database', 'sql', 'mysql', 'postgres'],
icon: 'database'
},
{
id: '7',
name: 'Live Server',
description: 'Launch a development local server with live reload',
author: 'Ritwick Dey',
version: '5.7.9',
downloads: 34200000,
rating: 4.5,
isInstalled: false,
isEnabled: false,
category: 'Debuggers',
tags: ['server', 'live-reload', 'development'],
icon: 'zap'
},
{
id: '8',
name: 'Path Intellisense',
description: 'Autocompletes filenames',
author: 'Christian Kohler',
version: '2.8.0',
downloads: 15600000,
rating: 4.6,
isInstalled: false,
isEnabled: false,
category: 'Other',
tags: ['autocomplete', 'paths', 'productivity'],
icon: 'code'
},
];

interface PluginManagerProps {
isOpen: boolean;
onClose: () => void;
}

export const PluginManager: React.FC<PluginManagerProps> = ({ isOpen, onClose }) => {
const [searchQuery, setSearchQuery] = useState('');
const [activeTab, setActiveTab] = useState<'installed' | 'marketplace' | 'recommended'>('installed');
const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
const [plugins, setPlugins] = useState(PLUGINS);

const filteredPlugins = plugins.filter(plugin => {
const matchesSearch = plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
plugin.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
plugin.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

if (activeTab === 'installed') return matchesSearch && plugin.isInstalled;
if (activeTab === 'marketplace') return matchesSearch && !plugin.isInstalled;
if (activeTab === 'recommended') return matchesSearch && plugin.downloads > 10000000;
return matchesSearch;
});

const handleInstall = (id: string) => {
setPlugins(prev => prev.map(p => p.id === id ? { ...p, isInstalled: true, isEnabled: true } : p));
};

const handleUninstall = (id: string) => {
setPlugins(prev => prev.map(p => p.id === id ? { ...p, isInstalled: false, isEnabled: false } : p));
};

const handleToggle = (id: string) => {
setPlugins(prev => prev.map(p => p.id === id ? { ...p, isEnabled: !p.isEnabled } : p));
};

if (!isOpen) return null;

return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
<div className="w-full max-w-5xl h-[80vh] glass-panel rounded-xl overflow-hidden flex flex-col">
{/* Header */}
<div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
<div className="flex items-center space-x-3">
<Puzzle className="w-7 h-7 text-purple-400" />
<div>
<h2 className="text-2xl font-bold text-white">Extensions</h2>
<p className="text-sm text-gray-400">Manage plugins and extensions</p>
</div>
</div>
<button
onClick={onClose}
className="p-2 hover:bg-white/10 rounded-lg transition-colors"
>
<X className="w-5 h-5 text-gray-400" />
</button>
</div>

{/* Search and Tabs */}
<div className="px-6 py-4 border-b border-white/10 space-y-4">
<div className="flex space-x-4">
<div className="flex-1 relative">
<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
<input
type="text"
value={searchQuery}
onChange={(e) => setSearchQuery(e.target.value)}
placeholder="Search extensions..."
className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
/>
</div>
<div className="flex items-center space-x-2">
<button
onClick={() => setViewMode('grid')}
className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
>
<Grid className="w-4 h-4" />
</button>
<button
onClick={() => setViewMode('list')}
className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
>
<List className="w-4 h-4" />
</button>
</div>
</div>

<div className="flex space-x-2">
{['installed', 'marketplace', 'recommended'].map(tab => (
<button
key={tab}
onClick={() => setActiveTab(tab as typeof activeTab)}
className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
activeTab === tab
? 'bg-purple-600 text-white'
: 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
}`}
>
{tab.charAt(0).toUpperCase() + tab.slice(1)}
{tab === 'installed' && (
<span className="ml-2 text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
{plugins.filter(p => p.isInstalled).length}
</span>
)}
</button>
))}
</div>
</div>

{/* Content */}
<div className="flex-1 overflow-y-auto p-6">
{viewMode === 'list' ? (
<div className="space-y-2">
{filteredPlugins.map(plugin => (
<div
key={plugin.id}
className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
>
<div className="flex items-center space-x-4">
<div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
{plugin.icon === 'shield' && <Shield className="w-6 h-6 text-purple-400" />}
{plugin.icon === 'sparkles' && <Sparkles className="w-6 h-6 text-blue-400" />}
{plugin.icon === 'git' && <GitBranch className="w-6 h-6 text-orange-400" />}
{plugin.icon === 'package' && <Package className="w-6 h-6 text-blue-400" />}
{plugin.icon === 'globe' && <Globe className="w-6 h-6 text-green-400" />}
{plugin.icon === 'database' && <Database className="w-6 h-6 text-yellow-400" />}
{plugin.icon === 'zap' && <Zap className="w-6 h-6 text-yellow-400" />}
{plugin.icon === 'code' && <Code className="w-6 h-6 text-pink-400" />}
</div>
<div>
<div className="flex items-center space-x-2">
<h3 className="font-semibold text-white">{plugin.name}</h3>
<span className="text-xs text-gray-500">v{plugin.version}</span>
{plugin.isInstalled && plugin.isEnabled && (
<span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full">Active</span>
)}
</div>
<p className="text-sm text-gray-400">{plugin.description}</p>
<div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
<span>{plugin.author}</span>
<span>•</span>
<div className="flex items-center space-x-1">
<Star className="w-3 h-3 text-yellow-400 fill-current" />
<span>{plugin.rating}</span>
</div>
<span>•</span>
<span>{(plugin.downloads / 1000000).toFixed(1)}M downloads</span>
</div>
</div>
</div>
<div className="flex items-center space-x-2">
{plugin.isInstalled ? (
<>
<button
onClick={() => handleToggle(plugin.id)}
className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
plugin.isEnabled
? 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
: 'bg-white/10 text-gray-400 hover:bg-white/20'
}`}
>
{plugin.isEnabled ? 'Enabled' : 'Disabled'}
</button>
<button
onClick={() => handleUninstall(plugin.id)}
className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
>
<Trash2 className="w-4 h-4" />
</button>
</>
) : (
<button
onClick={() => handleInstall(plugin.id)}
className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
>
Install
</button>
)}
</div>
</div>
))}
</div>
) : (
<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
{filteredPlugins.map(plugin => (
<div
key={plugin.id}
className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
>
<div className="flex items-start justify-between mb-3">
<div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
{plugin.icon === 'shield' && <Shield className="w-5 h-5 text-purple-400" />}
{plugin.icon === 'sparkles' && <Sparkles className="w-5 h-5 text-blue-400" />}
{plugin.icon === 'git' && <GitBranch className="w-5 h-5 text-orange-400" />}
{plugin.icon === 'package' && <Package className="w-5 h-5 text-blue-400" />}
{plugin.icon === 'globe' && <Globe className="w-5 h-5 text-green-400" />}
{plugin.icon === 'database' && <Database className="w-5 h-5 text-yellow-400" />}
{plugin.icon === 'zap' && <Zap className="w-5 h-5 text-yellow-400" />}
{plugin.icon === 'code' && <Code className="w-5 h-5 text-pink-400" />}
</div>
{plugin.isInstalled ? (
<Check className="w-5 h-5 text-green-400" />
) : (
<button
onClick={() => handleInstall(plugin.id)}
className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white"
>
<Download className="w-4 h-4" />
</button>
)}
</div>
<h3 className="font-semibold text-white mb-1">{plugin.name}</h3>
<p className="text-xs text-gray-400 line-clamp-2 mb-2">{plugin.description}</p>
<div className="flex items-center space-x-2 text-xs text-gray-500">
<Star className="w-3 h-3 text-yellow-400 fill-current" />
<span>{plugin.rating}</span>
<span>•</span>
<span>{(plugin.downloads / 1000000).toFixed(1)}M</span>
</div>
</div>
))}
</div>
)}
</div>
</div>
</div>
);
};
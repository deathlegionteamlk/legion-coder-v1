import React, { useState } from 'react';
import { Palette, Download, Check, Star, Sparkles, Moon, Sun, Monitor, X, Search, Filter, Heart, Eye, Zap, Gem, Crown, Award } from 'lucide-react';

interface Theme {
id: string;
name: string;
author: string;
description: string;
category: 'dark' | 'light' | 'high-contrast' | 'colorful';
previewColors: string[];
downloads: number;
rating: number;
isInstalled: boolean;
isPremium: boolean;
price?: number;
tags: string[];
}

const THEMES: Theme[] = [
{
id: '1',
name: 'Midnight Ocean',
author: 'LEGION Team',
description: 'Deep ocean-inspired dark theme with calming blue accents',
category: 'dark',
previewColors: ['#0a0e27', '#1a1f3a', '#3b82f6', '#60a5fa', '#93c5fd'],
downloads: 15420,
rating: 4.8,
isInstalled: true,
isPremium: false,
tags: ['dark', 'blue', 'ocean', 'popular']
},
{
id: '2',
name: 'Neon Cyberpunk',
author: 'CyberDev',
description: 'High-contrast cyberpunk theme with neon pink and cyan accents',
category: 'colorful',
previewColors: ['#0d0221', '#1a0b2e', '#ff006e', '#00f5ff', '#ffbe0b'],
downloads: 12350,
rating: 4.7,
isInstalled: false,
isPremium: false,
tags: ['cyberpunk', 'neon', 'colorful', 'trending']
},
{
id: '3',
name: 'Solarized Light',
author: 'Ethan Schoonover',
description: 'Classic solarized light theme for reduced eye strain',
category: 'light',
previewColors: ['#fdf6e3', '#eee8d5', '#268bd2', '#2aa198', '#859900'],
downloads: 28900,
rating: 4.9,
isInstalled: false,
isPremium: false,
tags: ['light', 'classic', 'solarized', 'popular']
},
{
id: '4',
name: 'Dracula Pro',
author: 'Dracula Team',
description: 'Professional dark theme with vibrant colors',
category: 'dark',
previewColors: ['#282a36', '#44475a', '#ff79c6', '#bd93f9', '#50fa7b'],
downloads: 45600,
rating: 4.9,
isInstalled: false,
isPremium: true,
price: 9.99,
tags: ['dark', 'vibrant', 'professional', 'best-seller']
},
{
id: '5',
name: 'GitHub Dark',
author: 'GitHub',
description: 'Official GitHub dark theme for familiar coding experience',
category: 'dark',
previewColors: ['#0d1117', '#161b22', '#58a6ff', '#238636', '#f78166'],
downloads: 67800,
rating: 4.8,
isInstalled: false,
isPremium: false,
tags: ['dark', 'github', 'official', 'popular']
},
{
id: '6',
name: 'Monokai Pro',
author: 'Monokai',
description: 'Professional Monokai theme with carefully selected colors',
category: 'dark',
previewColors: ['#272822', '#3e3d32', '#f92672', '#a6e22e', '#66d9ef'],
downloads: 32100,
rating: 4.7,
isInstalled: false,
isPremium: true,
price: 14.99,
tags: ['dark', 'monokai', 'professional', 'classic']
},
{
id: '7',
name: 'One Dark Pro',
author: 'BinaryFy',
description: 'Atom One Dark theme optimized for VS Code',
category: 'dark',
previewColors: ['#282c34', '#3e4451', '#e06c75', '#98c379', '#61afef'],
downloads: 89200,
rating: 4.8,
isInstalled: false,
isPremium: false,
tags: ['dark', 'atom', 'popular', 'best-seller']
},
{
id: '8',
name: 'Nord',
author: 'Arctic Ice Studio',
description: 'Polar-inspired theme with cool blue tones',
category: 'dark',
previewColors: ['#2e3440', '#3b4252', '#88c0d0', '#81a1c1', '#5e81ac'],
downloads: 23400,
rating: 4.6,
isInstalled: false,
isPremium: false,
tags: ['dark', 'nord', 'arctic', 'cool']
},
{
id: '9',
name: 'Tokyo Night',
author: 'Enkia',
description: 'A clean, dark theme that celebrates the lights of Tokyo',
category: 'dark',
previewColors: ['#1a1b26', '#24283b', '#7aa2f7', '#bb9af7', '#c0caf5'],
downloads: 18700,
rating: 4.7,
isInstalled: false,
isPremium: false,
tags: ['dark', 'tokyo', 'city', 'trending']
},
{
id: '10',
name: 'Catppuccin',
author: 'Catppuccin Team',
description: 'Soothing pastel theme with multiple flavor options',
category: 'dark',
previewColors: ['#1e1e2e', '#302d41', '#f5c2e7', '#cba6f7', '#89dceb'],
downloads: 15600,
rating: 4.8,
isInstalled: false,
isPremium: false,
tags: ['dark', 'pastel', 'soothing', 'popular']
},
{
id: '11',
name: 'Gruvbox',
author: 'Pavel Pertsev',
description: 'Retro groove color scheme with warm colors',
category: 'dark',
previewColors: ['#282828', '#3c3836', '#fb4934', '#b8bb26', '#fabd2f'],
downloads: 19800,
rating: 4.6,
isInstalled: false,
isPremium: false,
tags: ['dark', 'retro', 'warm', 'classic']
},
{
id: '12',
name: 'Material Theme',
author: 'Mattia Astorino',
description: 'Material Design inspired theme with vibrant colors',
category: 'dark',
previewColors: ['#263238', '#37474f', '#82aaff', '#c3e88d', '#ffcb6b'],
downloads: 41200,
rating: 4.7,
isInstalled: false,
isPremium: false,
tags: ['dark', 'material', 'design', 'popular']
},
{
id: '13',
name: 'Winter is Coming',
author: 'John Papa',
description: 'Dark blue theme inspired by Game of Thrones',
category: 'dark',
previewColors: ['#011627', '#0b2942', '#82aaff', '#7ee787', '#ffeb95'],
downloads: 9800,
rating: 4.5,
isInstalled: false,
isPremium: false,
tags: ['dark', 'blue', 'winter', 'fun']
},
{
id: '14',
name: 'Shades of Purple',
author: 'Ahmad Awais',
description: 'Purple-themed dark theme with vibrant accents',
category: 'dark',
previewColors: ['#2d2b55', '#1e1e3f', '#ff9d00', '#9d92ff', '#ff628c'],
downloads: 14500,
rating: 4.6,
isInstalled: false,
isPremium: false,
tags: ['dark', 'purple', 'vibrant', 'popular']
},
{
id: '15',
name: 'Night Owl',
author: 'Sarah Drasner',
description: 'Dark theme for night owls with accessible colors',
category: 'dark',
previewColors: ['#011627', '#0b2942', '#82aaff', '#addb67', '#ffeb95'],
downloads: 22300,
rating: 4.7,
isInstalled: false,
isPremium: false,
tags: ['dark', 'accessible', 'night', 'popular']
},
{
id: '16',
name: 'Cobalt2',
author: 'Wes Bos',
description: 'Deep blue theme with bright yellow highlights',
category: 'dark',
previewColors: ['#193549', '#1f4662', '#ffc600', '#ff9a00', '#0088ff'],
downloads: 18700,
rating: 4.6,
isInstalled: false,
isPremium: false,
tags: ['dark', 'blue', 'yellow', 'classic']
},
{
id: '17',
name: 'Palenight',
author: 'Olaolu Olawuyi',
description: 'Material inspired theme with soft colors',
category: 'dark',
previewColors: ['#292d3e', '#444267', '#c792ea', '#82aaff', '#ffcb8b'],
downloads: 13400,
rating: 4.5,
isInstalled: false,
isPremium: false,
tags: ['dark', 'material', 'soft', 'elegant']
},
{
id: '18',
name: 'SynthWave 84',
author: 'Robb Owen',
description: 'Retro 80s synthwave theme with neon glow',
category: 'colorful',
previewColors: ['#2b213a', '#362b48', '#f92aad', '#fdf500', '#72f1b8'],
downloads: 11200,
rating: 4.4,
isInstalled: false,
isPremium: false,
tags: ['dark', 'retro', 'synthwave', '80s']
},
{
id: '19',
name: 'Atom One Light',
author: 'Daniel Gamage',
description: 'Light theme based on Atom One',
category: 'light',
previewColors: ['#fafafa', '#eaeaeb', '#4078f2', '#50a14f', '#986801'],
downloads: 15600,
rating: 4.5,
isInstalled: false,
isPremium: false,
tags: ['light', 'atom', 'clean', 'popular']
},
{
id: '20',
name: 'Quiet Light',
author: 'Microsoft',
description: 'Clean light theme with subtle colors',
category: 'light',
previewColors: ['#f5f5f5', '#e8e8e8', '#0000ff', '#008000', '#a31515'],
downloads: 18900,
rating: 4.4,
isInstalled: false,
isPremium: false,
tags: ['light', 'clean', 'subtle', 'official']
}
];

interface ThemesMarketplaceProps {
isOpen: boolean;
onClose: () => void;
}

export const ThemesMarketplace: React.FC<ThemesMarketplaceProps> = ({ isOpen, onClose }) => {
const [searchQuery, setSearchQuery] = useState('');
const [selectedCategory, setSelectedCategory] = useState<string>('all');
const [installedThemes, setInstalledThemes] = useState<Set<string>>(new Set(['1']));
const [activeTheme, setActiveTheme] = useState<string>('1');

const filteredThemes = THEMES.filter(theme => {
const matchesSearch = theme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
theme.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
theme.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
const matchesCategory = selectedCategory === 'all' || theme.category === selectedCategory;
return matchesSearch && matchesCategory;
});

const handleInstall = (themeId: string) => {
setInstalledThemes(prev => new Set([...prev, themeId]));
};

const handleUninstall = (themeId: string) => {
setInstalledThemes(prev => {
const newSet = new Set(prev);
newSet.delete(themeId);
return newSet;
});
};

const handleActivate = (themeId: string) => {
setActiveTheme(themeId);
};

if (!isOpen) return null;

return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
<div className="w-full max-w-6xl h-[85vh] glass-panel rounded-xl overflow-hidden flex flex-col">
{/* Header */}
<div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
<div className="flex items-center space-x-3">
<Palette className="w-7 h-7 text-purple-400" />
<div>
<h2 className="text-2xl font-bold text-white">Themes Marketplace</h2>
<p className="text-sm text-gray-400">Discover and install beautiful themes</p>
</div>
</div>
<div className="flex items-center space-x-4">
<div className="flex items-center space-x-2 px-4 py-2 bg-white/5 rounded-lg">
<Download className="w-4 h-4 text-gray-400" />
<span className="text-sm text-gray-300">{installedThemes.size} installed</span>
</div>
<button
onClick={onClose}
className="p-2 hover:bg-white/10 rounded-lg transition-colors"
>
<X className="w-5 h-5 text-gray-400" />
</button>
</div>
</div>

{/* Search and Filters */}
<div className="px-6 py-4 border-b border-white/10 space-y-4">
<div className="flex space-x-4">
<div className="flex-1 relative">
<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
<input
type="text"
value={searchQuery}
onChange={(e) => setSearchQuery(e.target.value)}
placeholder="Search themes..."
className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
/>
</div>
</div>

<div className="flex items-center space-x-2">
{['all', 'dark', 'light', 'high-contrast', 'colorful'].map(category => (
<button
key={category}
onClick={() => setSelectedCategory(category)}
className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
selectedCategory === category
? 'bg-purple-600 text-white'
: 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
}`}
>
{category.charAt(0).toUpperCase() + category.slice(1)}
</button>
))}
</div>
</div>

{/* Themes Grid */}
<div className="flex-1 overflow-y-auto p-6">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
{filteredThemes.map(theme => {
const isInstalled = installedThemes.has(theme.id);
const isActive = activeTheme === theme.id;

return (
<div
key={theme.id}
className={`group relative p-4 rounded-xl border transition-all duration-300 ${
isActive
? 'bg-purple-500/20 border-purple-500/50'
: 'bg-white/5 border-white/10 hover:border-white/30'
}`}
>
{/* Premium Badge */}
{theme.isPremium && (
<div className="absolute top-3 right-3 flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-full border border-yellow-500/30">
<Crown className="w-3 h-3 text-yellow-400" />
<span className="text-xs font-medium text-yellow-400">${theme.price}</span>
</div>
)}

{/* Preview */}
<div className="flex space-x-1 mb-4">
{theme.previewColors.map((color, i) => (
<div
key={i}
className="flex-1 h-16 first:rounded-l-lg last:rounded-r-lg"
style={{ backgroundColor: color }}
/>
))}
</div>

{/* Info */}
<div className="space-y-2">
<div className="flex items-start justify-between">
<div>
<h3 className="font-semibold text-white">{theme.name}</h3>
<p className="text-sm text-gray-400">by {theme.author}</p>
</div>
{isActive && (
<div className="flex items-center space-x-1 text-purple-400">
<Check className="w-4 h-4" />
<span className="text-xs font-medium">Active</span>
</div>
)}
</div>

<p className="text-sm text-gray-400 line-clamp-2">{theme.description}</p>

{/* Stats */}
<div className="flex items-center space-x-4 text-sm text-gray-500">
<div className="flex items-center space-x-1">
<Download className="w-3 h-3" />
<span>{theme.downloads.toLocaleString()}</span>
</div>
<div className="flex items-center space-x-1">
<Star className="w-3 h-3 text-yellow-400 fill-current" />
<span>{theme.rating}</span>
</div>
</div>

{/* Tags */}
<div className="flex flex-wrap gap-1">
{theme.tags.slice(0, 3).map(tag => (
<span
key={tag}
className="text-xs px-2 py-0.5 bg-white/5 rounded text-gray-400"
>
{tag}
</span>
))}
</div>

{/* Actions */}
<div className="flex space-x-2 pt-2">
{isInstalled ? (
<>
{isActive ? (
<button
className="flex-1 px-3 py-2 bg-purple-600/50 text-purple-300 rounded-lg text-sm font-medium cursor-default"
>
Active
</button>
) : (
<button
onClick={() => handleActivate(theme.id)}
className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
>
Activate
</button>
)}
<button
onClick={() => handleUninstall(theme.id)}
className="px-3 py-2 bg-white/5 hover:bg-white/10 text-gray-400 rounded-lg transition-colors"
>
<Zap className="w-4 h-4" />
</button>
</>
) : (
<button
onClick={() => handleInstall(theme.id)}
className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors"
>
<Download className="w-4 h-4" />
<span>{theme.isPremium ? `Buy $${theme.price}` : 'Install'}</span>
</button>
)}
</div>
</div>
</div>
);
})}
</div>
</div>
</div>
</div>
);
};
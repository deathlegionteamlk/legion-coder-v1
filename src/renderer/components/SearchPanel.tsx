import React, { useState } from 'react';
import { Search, Replace, X, ChevronDown, ChevronRight, FileText, Folder, Settings, Regex, CaseSensitive, WholeWord, RefreshCw, ArrowUp, ArrowDown } from 'lucide-react';

interface SearchResult {
id: string;
file: string;
line: number;
column: number;
preview: string;
match: string;
}

interface SearchPanelProps {
isOpen: boolean;
onClose: () => void;
}

export const SearchPanel: React.FC<SearchPanelProps> = ({ isOpen, onClose }) => {
const [searchQuery, setSearchQuery] = useState('');
const [replaceQuery, setReplaceQuery] = useState('');
const [isRegex, setIsRegex] = useState(false);
const [isCaseSensitive, setIsCaseSensitive] = useState(false);
const [isWholeWord, setIsWholeWord] = useState(false);
const [includePattern, setIncludePattern] = useState('*');
const [excludePattern, setExcludePattern] = useState('node_modules, .git, dist');
const [showReplace, setShowReplace] = useState(false);
const [isSearching, setIsSearching] = useState(false);

const [results, setResults] = useState<SearchResult[]>([
{
id: '1',
file: 'src/components/App.tsx',
line: 45,
column: 12,
preview: 'const [user, setUser] = useState<User | null>(null);',
match: 'useState'
},
{
id: '2',
file: 'src/components/Header.tsx',
line: 23,
column: 8,
preview: 'const theme = useTheme();',
match: 'useTheme'
},
{
id: '3',
file: 'src/hooks/useAuth.ts',
line: 67,
column: 15,
preview: 'export function useAuth() {',
match: 'useAuth'
},
{
id: '4',
file: 'src/utils/api.ts',
line: 12,
column: 20,
preview: 'const response = await fetch(API_URL);',
match: 'fetch'
},
]);

const handleSearch = () => {
setIsSearching(true);
setTimeout(() => setIsSearching(false), 500);
};

const handleReplaceAll = () => {
// Replace all logic
};

if (!isOpen) return null;

return (
<div className="h-full flex flex-col glass-panel">
{/* Header */}
<div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
<div className="flex items-center space-x-2">
<Search className="w-5 h-5 text-blue-400" />
<span className="font-semibold text-white">Search</span>
</div>
<button
onClick={onClose}
className="p-2 hover:bg-white/10 rounded-lg transition-colors"
>
<X className="w-4 h-4 text-gray-400" />
</button>
</div>

{/* Search Controls */}
<div className="p-4 space-y-3">
{/* Search Input */}
<div className="relative">
<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
<input
type="text"
value={searchQuery}
onChange={(e) => setSearchQuery(e.target.value)}
onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
placeholder="Search across files..."
className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm"
/>
</div>

{/* Replace Input */}
{showReplace && (
<div className="relative">
<Replace className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
<input
type="text"
value={replaceQuery}
onChange={(e) => setReplaceQuery(e.target.value)}
placeholder="Replace with..."
className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm"
/>
</div>
)}

{/* Options */}
<div className="flex flex-wrap gap-2">
<button
onClick={() => setIsRegex(!isRegex)}
className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors ${
isRegex ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-gray-400 hover:text-white'
}`}
>
<Regex className="w-3 h-3" />
<span>.*</span>
</button>
<button
onClick={() => setIsCaseSensitive(!isCaseSensitive)}
className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors ${
isCaseSensitive ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-gray-400 hover:text-white'
}`}
>
<CaseSensitive className="w-3 h-3" />
<span>Aa</span>
</button>
<button
onClick={() => setIsWholeWord(!isWholeWord)}
className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors ${
isWholeWord ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-gray-400 hover:text-white'
}`}
>
<WholeWord className="w-3 h-3" />
<span>" "</span>
</button>
<button
onClick={() => setShowReplace(!showReplace)}
className={`px-2 py-1 rounded text-xs transition-colors ${
showReplace ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-gray-400 hover:text-white'
}`}
>
Replace
</button>
</div>

{/* File Patterns */}
<div className="space-y-2 pt-2 border-t border-white/10">
<div className="flex items-center space-x-2">
<span className="text-xs text-gray-400 w-16">Include:</span>
<input
type="text"
value={includePattern}
onChange={(e) => setIncludePattern(e.target.value)}
className="flex-1 px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-white focus:outline-none focus:border-blue-500"
/>
</div>
<div className="flex items-center space-x-2">
<span className="text-xs text-gray-400 w-16">Exclude:</span>
<input
type="text"
value={excludePattern}
onChange={(e) => setExcludePattern(e.target.value)}
className="flex-1 px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-white focus:outline-none focus:border-blue-500"
/>
</div>
</div>

{/* Action Buttons */}
<div className="flex space-x-2">
<button
onClick={handleSearch}
disabled={isSearching}
className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
>
{isSearching ? (
<RefreshCw className="w-4 h-4 animate-spin" />
) : (
<Search className="w-4 h-4" />
)}
<span>Search</span>
</button>
{showReplace && (
<button
onClick={handleReplaceAll}
className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors"
>
Replace All
</button>
)}
</div>
</div>

{/* Results */}
<div className="flex-1 overflow-auto border-t border-white/10">
<div className="px-4 py-2 text-xs text-gray-400 border-b border-white/10">
{results.length} results in {new Set(results.map(r => r.file)).size} files
</div>
<div className="divide-y divide-white/5">
{results.map((result) => (
<button
key={result.id}
className="w-full text-left p-3 hover:bg-white/5 transition-colors"
>
<div className="flex items-center space-x-2 mb-1">
<FileText className="w-4 h-4 text-gray-400" />
<span className="text-sm text-gray-300">{result.file}</span>
<span className="text-xs text-gray-500">:{result.line}:{result.column}</span>
</div>
<p className="text-sm text-gray-400 pl-6">
{result.preview.split(result.match).map((part, i, arr) => (
<React.Fragment key={i}>
{part}
{i < arr.length - 1 && (
<span className="bg-yellow-500/30 text-yellow-200 px-0.5 rounded">{result.match}</span>
)}
</React.Fragment>
))}
</p>
</button>
))}
</div>
</div>
</div>
);
};
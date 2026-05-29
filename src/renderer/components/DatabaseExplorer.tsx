import React, { useState } from 'react';
import { Database, X, Table, Key, Search, Plus, Trash2, Play, Save } from 'lucide-react';

interface TableInfo {
name: string;
columns: { name: string; type: string; isPrimary?: boolean }[];
}

interface DatabaseConnection {
id: string;
name: string;
type: 'sqlite' | 'mysql' | 'postgresql';
host?: string;
port?: number;
database: string;
}

interface DatabaseExplorerProps {
isOpen: boolean;
onClose: () => void;
}

export const DatabaseExplorer: React.FC<DatabaseExplorerProps> = ({ isOpen, onClose }) => {
const [connections, setConnections] = useState<DatabaseConnection[]>([
{ id: '1', name: 'Local SQLite', type: 'sqlite', database: 'app.db' },
]);
const [activeConnection, setActiveConnection] = useState<string>('1');
const [tables, setTables] = useState<TableInfo[]>([
{
name: 'users',
columns: [
{ name: 'id', type: 'INTEGER', isPrimary: true },
{ name: 'username', type: 'TEXT' },
{ name: 'email', type: 'TEXT' },
{ name: 'created_at', type: 'TIMESTAMP' },
],
},
{
name: 'projects',
columns: [
{ name: 'id', type: 'INTEGER', isPrimary: true },
{ name: 'name', type: 'TEXT' },
{ name: 'user_id', type: 'INTEGER' },
{ name: 'status', type: 'TEXT' },
],
},
]);
const [query, setQuery] = useState('SELECT * FROM users LIMIT 10;');
const [queryResults, setQueryResults] = useState<string>('');
const [isExecuting, setIsExecuting] = useState(false);
const [showNewConnection, setShowNewConnection] = useState(false);

const executeQuery = async () => {
setIsExecuting(true);
setQueryResults('');

// Simulate query execution
await new Promise(resolve => setTimeout(resolve, 1000));

setQueryResults(`id | username | email | created_at
---|----------|-------|------------
1 | john_doe | john@example.com | 2024-01-15 10:30:00
2 | jane_smith | jane@example.com | 2024-01-16 14:45:00
3 | bob_wilson | bob@example.com | 2024-01-17 09:15:00

Query executed successfully. 3 rows returned in 0.023s.`);

setIsExecuting(false);
};

if (!isOpen) return null;

return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
<div className="w-full max-w-6xl h-[85vh] glass-panel rounded-xl overflow-hidden flex flex-col">
<div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
<div className="flex items-center space-x-3">
<Database className="w-6 h-6 text-purple-400" />
<h2 className="text-xl font-bold text-white">Database Explorer</h2>
</div>
<button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
<X className="w-5 h-5 text-gray-400" />
</button>
</div>

<div className="flex-1 flex overflow-hidden">
{/* Sidebar */}
<div className="w-72 border-r border-white/10 flex flex-col">
<div className="p-3 border-b border-white/10">
<button
onClick={() => setShowNewConnection(true)}
className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors"
>
<Plus className="w-4 h-4" />
<span>New Connection</span>
</button>
</div>

<div className="flex-1 overflow-y-auto">
<div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Connections</div>
{connections.map(conn => (
<button
key={conn.id}
onClick={() => setActiveConnection(conn.id)}
className={`w-full flex items-center space-x-2 px-4 py-3 text-left hover:bg-white/5 transition-colors ${
activeConnection === conn.id ? 'bg-white/10 border-l-2 border-purple-400' : ''
}`}
>
<Database className="w-4 h-4 text-purple-400" />
<div>
<div className="text-sm text-white">{conn.name}</div>
<div className="text-xs text-gray-500">{conn.type} • {conn.database}</div>
</div>
</button>
))}

<div className="px-4 py-2 mt-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tables</div>
{tables.map(table => (
<div key={table.name} className="px-4 py-2">
<div className="flex items-center space-x-2 text-sm text-white mb-1">
<Table className="w-4 h-4 text-blue-400" />
<span>{table.name}</span>
</div>
<div className="ml-6 space-y-1">
{table.columns.map(col => (
<div key={col.name} className="flex items-center space-x-2 text-xs text-gray-400">
{col.isPrimary && <Key className="w-3 h-3 text-yellow-400" />}
<span className={col.isPrimary ? 'text-yellow-400' : ''}>{col.name}</span>
<span className="text-gray-600">({col.type})</span>
</div>
))}
</div>
</div>
))}
</div>
</div>

{/* Main Content */}
<div className="flex-1 flex flex-col">
{/* Query Editor */}
<div className="flex-1 flex flex-col border-b border-white/10">
<div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/5">
<span className="text-sm font-medium text-white">SQL Query</span>
<div className="flex items-center space-x-2">
<button
onClick={executeQuery}
disabled={isExecuting}
className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded text-white text-sm transition-colors"
>
<Play className="w-3 h-3" />
<span>{isExecuting ? 'Running...' : 'Run'}</span>
</button>
<button className="flex items-center space-x-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded text-white text-sm transition-colors">
<Save className="w-3 h-3" />
<span>Save</span>
</button>
</div>
</div>
<textarea
value={query}
onChange={(e) => setQuery(e.target.value)}
className="flex-1 p-4 bg-black/30 text-white font-mono text-sm resize-none focus:outline-none"
placeholder="Enter SQL query..."
spellCheck={false}
/>
</div>

{/* Results */}
<div className="h-1/2 flex flex-col">
<div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
<span className="text-sm font-medium text-white">Results</span>
<div className="flex items-center space-x-2">
<Search className="w-4 h-4 text-gray-400" />
<input
 type="text"
placeholder="Filter results..."
className="px-2 py-1 bg-white/5 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-purple-500"
/>
</div>
</div>
<div className="flex-1 p-4 overflow-auto">
{queryResults ? (
<pre className="text-sm text-gray-300 font-mono whitespace-pre">{queryResults}</pre>
) : (
<div className="flex items-center justify-center h-full text-gray-500">
<p>Execute a query to see results</p>
</div>
)}
</div>
</div>
</div>
</div>
</div>
</div>
);
};
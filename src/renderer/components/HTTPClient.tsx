import React, { useState } from 'react';
import { Send, Globe, X, Copy, Check, Save, Trash2, Plus } from 'lucide-react';

interface Request {
id: string;
method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
url: string;
headers: Record<string, string>;
body: string;
name: string;
}

interface HTTPClientProps {
isOpen: boolean;
onClose: () => void;
}

export const HTTPClient: React.FC<HTTPClientProps> = ({ isOpen, onClose }) => {
const [requests, setRequests] = useState<Request[]>([
{ id: '1', method: 'GET', url: 'https://api.github.com/users/github', headers: {}, body: '', name: 'GitHub User' },
{ id: '2', method: 'POST', url: 'https://httpbin.org/post', headers: { 'Content-Type': 'application/json' }, body: '{"key": "value"}', name: 'Test POST' },
]);
const [activeRequest, setActiveRequest] = useState<string>('1');
const [response, setResponse] = useState<string>('');
const [isLoading, setIsLoading] = useState(false);
const [copied, setCopied] = useState(false);

const currentRequest = requests.find(r => r.id === activeRequest) || requests[0];

const handleSend = async () => {
setIsLoading(true);
setResponse('');

try {
const startTime = Date.now();
const res = await fetch(currentRequest.url, {
method: currentRequest.method,
headers: currentRequest.headers,
body: ['GET', 'HEAD'].includes(currentRequest.method) ? undefined : currentRequest.body,
});

const duration = Date.now() - startTime;
const data = await res.text();

const responseText = `Status: ${res.status} ${res.statusText}
Time: ${duration}ms
Headers: ${JSON.stringify(Object.fromEntries(res.headers.entries()), null, 2)}

${data}`;

setResponse(responseText);
} catch (error) {
setResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
} finally {
setIsLoading(false);
}
};

const handleCopy = async () => {
try {
await navigator.clipboard.writeText(response);
setCopied(true);
setTimeout(() => setCopied(false), 2000);
} catch (err) {
console.error('Failed to copy:', err);
}
};

const updateRequest = (updates: Partial<Request>) => {
setRequests(prev => prev.map(r => r.id === activeRequest ? { ...r, ...updates } : r));
};

const addRequest = () => {
const newRequest: Request = {
id: Date.now().toString(),
method: 'GET',
url: '',
headers: {},
body: '',
name: 'New Request',
};
setRequests(prev => [...prev, newRequest]);
setActiveRequest(newRequest.id);
};

const deleteRequest = (id: string) => {
setRequests(prev => prev.filter(r => r.id !== id));
if (activeRequest === id && requests.length > 1) {
setActiveRequest(requests.find(r => r.id !== id)?.id || '');
}
};

if (!isOpen) return null;

return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
<div className="w-full max-w-5xl h-[80vh] glass-panel rounded-xl overflow-hidden flex flex-col">
<div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
<div className="flex items-center space-x-3">
<Globe className="w-6 h-6 text-purple-400" />
<h2 className="text-xl font-bold text-white">HTTP Client</h2>
</div>
<button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
<X className="w-5 h-5 text-gray-400" />
</button>
</div>

<div className="flex-1 flex overflow-hidden">
{/* Sidebar */}
<div className="w-64 border-r border-white/10 flex flex-col">
<div className="p-3 border-b border-white/10">
<button
onClick={addRequest}
className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors"
>
<Plus className="w-4 h-4" />
<span>New Request</span>
</button>
</div>
<div className="flex-1 overflow-y-auto">
{requests.map(req => (
<button
key={req.id}
onClick={() => setActiveRequest(req.id)}
className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-colors ${
activeRequest === req.id ? 'bg-white/10 border-l-2 border-purple-400' : ''
}`}
>
<div className="flex-1 min-w-0">
<div className="flex items-center space-x-2">
<span className={`text-xs font-mono px-1.5 py-0.5 rounded ${
req.method === 'GET' ? 'bg-green-500/20 text-green-400' :
req.method === 'POST' ? 'bg-blue-500/20 text-blue-400' :
req.method === 'PUT' ? 'bg-yellow-500/20 text-yellow-400' :
req.method === 'DELETE' ? 'bg-red-500/20 text-red-400' :
'bg-gray-500/20 text-gray-400'
}`}>
{req.method}
</span>
<span className="text-sm text-white truncate">{req.name}</span>
</div>
<div className="text-xs text-gray-500 truncate mt-1">{req.url}</div>
</div>
<button
onClick={(e) => { e.stopPropagation(); deleteRequest(req.id); }}
className="p-1.5 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
>
<Trash2 className="w-4 h-4" />
</button>
</button>
))}
</div>
</div>

{/* Main Content */}
<div className="flex-1 flex flex-col">
{/* Request Section */}
<div className="flex-1 flex flex-col border-b border-white/10">
<div className="flex items-center space-x-2 p-4 border-b border-white/10">
<select
value={currentRequest?.method}
onChange={(e) => updateRequest({ method: e.target.value as Request['method'] })}
className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
>
{['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map(m => (
<option key={m} value={m}>{m}</option>
))}
</select>
<input
 type="text"
value={currentRequest?.url}
onChange={(e) => updateRequest({ url: e.target.value })}
placeholder="Enter URL..."
className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
/>
<button
onClick={handleSend}
disabled={isLoading}
className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 rounded-lg text-white transition-colors"
>
<Send className={`w-4 h-4 ${isLoading ? 'animate-pulse' : ''}`} />
<span>{isLoading ? 'Sending...' : 'Send'}</span>
</button>
</div>

<div className="flex-1 p-4 overflow-auto">
<div className="mb-4">
<label className="text-sm text-gray-400 mb-2 block">Request Name</label>
<input
 type="text"
value={currentRequest?.name}
onChange={(e) => updateRequest({ name: e.target.value })}
className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
/>
</div>

<div className="mb-4">
<label className="text-sm text-gray-400 mb-2 block">Headers (JSON)</label>
<textarea
value={JSON.stringify(currentRequest?.headers, null, 2)}
onChange={(e) => {
try {
const headers = JSON.parse(e.target.value);
updateRequest({ headers });
} catch {}
}}
className="w-full h-24 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-mono resize-none"
/>
</div>

<div>
<label className="text-sm text-gray-400 mb-2 block">Body</label>
<textarea
value={currentRequest?.body}
onChange={(e) => updateRequest({ body: e.target.value })}
className="w-full h-32 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-mono resize-none"
/>
</div>
</div>
</div>

{/* Response Section */}
<div className="h-1/2 flex flex-col">
<div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
<span className="text-sm font-medium text-white">Response</span>
{response && (
<button
onClick={handleCopy}
className="flex items-center space-x-1 text-xs text-gray-400 hover:text-white"
>
{copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
<span>{copied ? 'Copied!' : 'Copy'}</span>
</button>
)}
</div>
<div className="flex-1 p-4 overflow-auto">
{response ? (
<pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">{response}</pre>
) : (
<div className="flex items-center justify-center h-full text-gray-500">
<p>Send a request to see the response</p>
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
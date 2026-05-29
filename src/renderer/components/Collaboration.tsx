import React, { useState, useEffect, useRef } from 'react';
import { Users, X, Share2, Copy, Check, Video, Mic, MicOff, VideoOff, Monitor } from 'lucide-react';

interface Collaborator {
id: string;
name: string;
color: string;
cursor?: { line: number; column: number };
isVideoOn: boolean;
isAudioOn: boolean;
}

interface CollaborationProps {
isOpen: boolean;
onClose: () => void;
}

export const Collaboration: React.FC<CollaborationProps> = ({ isOpen, onClose }) => {
const [sessionId, setSessionId] = useState('');
const [isHost, setIsHost] = useState(false);
const [collaborators, setCollaborators] = useState<Collaborator[]>([
{ id: '1', name: 'You', color: '#8b5cf6', isVideoOn: true, isAudioOn: true },
]);
const [copied, setCopied] = useState(false);
const [isConnected, setIsConnected] = useState(false);
const [chatMessages, setChatMessages] = useState<{ user: string; text: string; time: string }[]>([]);
const [newMessage, setNewMessage] = useState('');

useEffect(() => {
if (isOpen && !sessionId) {
setSessionId('legion-' + Math.random().toString(36).substring(2, 10));
setIsHost(true);
}
}, [isOpen]);

const copySessionId = async () => {
try {
await navigator.clipboard.writeText(sessionId);
setCopied(true);
setTimeout(() => setCopied(false), 2000);
} catch (err) {
console.error('Failed to copy:', err);
}
};

const toggleVideo = (id: string) => {
setCollaborators(prev => prev.map(c =>
c.id === id ? { ...c, isVideoOn: !c.isVideoOn } : c
));
};

const toggleAudio = (id: string) => {
setCollaborators(prev => prev.map(c =>
c.id === id ? { ...c, isAudioOn: !c.isAudioOn } : c
));
};

const sendMessage = () => {
if (!newMessage.trim()) return;
setChatMessages(prev => [...prev, {
user: 'You',
text: newMessage,
time: new Date().toLocaleTimeString(),
}]);
setNewMessage('');
};

if (!isOpen) return null;

return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
<div className="w-full max-w-6xl h-[85vh] glass-panel rounded-xl overflow-hidden flex flex-col">
<div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
<div className="flex items-center space-x-3">
<Users className="w-6 h-6 text-purple-400" />
<h2 className="text-xl font-bold text-white">Live Collaboration</h2>
</div>
<div className="flex items-center space-x-2">
{isHost && (
<div className="flex items-center space-x-2 px-3 py-1.5 bg-white/5 rounded-lg">
<span className="text-sm text-gray-400">Session:</span>
<code className="text-sm text-purple-400 font-mono">{sessionId}</code>
<button
onClick={copySessionId}
className="p-1 hover:bg-white/10 rounded"
>
{copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
</button>
</div>
)}
<button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
<X className="w-5 h-5 text-gray-400" />
</button>
</div>
</div>

<div className="flex-1 flex overflow-hidden">
{/* Video Grid */}
<div className="flex-1 p-4">
<div className="grid grid-cols-2 gap-4 h-full">
{collaborators.map(collab => (
<div
key={collab.id}
className="glass-panel rounded-lg overflow-hidden relative"
style={{ borderColor: collab.color, borderWidth: '2px' }}
>
<div className="absolute inset-0 flex items-center justify-center bg-gray-800">
<div
className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white"
style={{ backgroundColor: collab.color }}
>
{collab.name[0]}
</div>
</div>

<div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
<div className="flex items-center justify-between">
<span className="text-white font-medium">{collab.name}</span>
<div className="flex items-center space-x-1">
<button
onClick={() => toggleVideo(collab.id)}
className="p-1.5 rounded hover:bg-white/20"
>
{collab.isVideoOn ? <Video className="w-4 h-4 text-white" /> : <VideoOff className="w-4 h-4 text-red-400" />}
</button>
<button
onClick={() => toggleAudio(collab.id)}
className="p-1.5 rounded hover:bg-white/20"
>
{collab.isAudioOn ? <Mic className="w-4 h-4 text-white" /> : <MicOff className="w-4 h-4 text-red-400" />}
</button>
</div>
</div>
</div>
</div>
))}

{/* Add placeholder for more collaborators */}
{Array.from({ length: Math.max(0, 4 - collaborators.length) }).map((_, i) => (
<div key={`empty-${i}`} className="glass-panel rounded-lg flex items-center justify-center border-2 border-dashed border-white/10">
<div className="text-center text-gray-500">
<Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
<p className="text-sm">Waiting for collaborators...</p>
</div>
</div>
))}
</div>
</div>

{/* Chat Panel */}
<div className="w-80 border-l border-white/10 flex flex-col">
<div className="p-3 border-b border-white/10">
<h3 className="text-sm font-semibold text-white">Chat</h3>
</div>

<div className="flex-1 overflow-y-auto p-3 space-y-3">
{chatMessages.map((msg, i) => (
<div key={i} className="text-sm">
<div className="flex items-center space-x-2 text-gray-400 text-xs">
<span className="font-medium text-purple-400">{msg.user}</span>
<span>{msg.time}</span>
</div>
<p className="text-gray-300 mt-1">{msg.text}</p>
</div>
))}
</div>

<div className="p-3 border-t border-white/10">
<div className="flex space-x-2">
<input
 type="text"
value={newMessage}
onChange={(e) => setNewMessage(e.target.value)}
onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
placeholder="Type a message..."
className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
/>
<button
onClick={sendMessage}
className="px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white"
>
<Share2 className="w-4 h-4" />
</button>
</div>
</div>
</div>
</div>
</div>
</div>
);
};
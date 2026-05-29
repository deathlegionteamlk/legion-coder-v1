import React, { useState } from 'react';
import { Bot, Sparkles, Code, BookOpen, Languages, TestTube, FileText, MessageSquare, GitCommit, Wand2, Brain, Zap, X, ChevronRight, Copy, Check, RefreshCw, Send } from 'lucide-react';

interface AIAssistantProps {
isOpen: boolean;
onClose: () => void;
}

interface AIAction {
id: string;
name: string;
description: string;
icon: React.ReactNode;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose }) => {
const [activeTab, setActiveTab] = useState<'explain' | 'translate' | 'test' | 'review' | 'docs' | 'commit'>('explain');
const [input, setInput] = useState('');
const [output, setOutput] = useState('');
const [isProcessing, setIsProcessing] = useState(false);
const [copied, setCopied] = useState(false);

const actions: Record<string, AIAction[]> = {
explain: [
{ id: '1', name: 'Explain Code', description: 'Get detailed explanation of selected code', icon: <BookOpen className="w-4 h-4" /> },
{ id: '2', name: 'Simplify Code', description: 'Simplify complex code to make it more readable', icon: <Sparkles className="w-4 h-4" /> },
{ id: '3', name: 'Find Bugs', description: 'Identify potential bugs and issues', icon: <Zap className="w-4 h-4" /> },
],
translate: [
{ id: '4', name: 'JavaScript to TypeScript', description: 'Convert JS code to TypeScript', icon: <Code className="w-4 h-4" /> },
{ id: '5', name: 'Python to JavaScript', description: 'Convert Python code to JavaScript', icon: <Languages className="w-4 h-4" /> },
{ id: '6', name: 'Modernize Code', description: 'Update code to use modern syntax', icon: <RefreshCw className="w-4 h-4" /> },
],
test: [
{ id: '7', name: 'Generate Unit Tests', description: 'Create unit tests for selected code', icon: <TestTube className="w-4 h-4" /> },
{ id: '8', name: 'Generate Integration Tests', description: 'Create integration tests', icon: <TestTube className="w-4 h-4" /> },
{ id: '9', name: 'Test Coverage', description: 'Analyze test coverage', icon: <FileText className="w-4 h-4" /> },
],
review: [
{ id: '10', name: 'Code Review', description: 'Get AI-powered code review', icon: <MessageSquare className="w-4 h-4" /> },
{ id: '11', name: 'Performance Analysis', description: 'Analyze performance bottlenecks', icon: <Zap className="w-4 h-4" /> },
{ id: '12', name: 'Security Review', description: 'Check for security vulnerabilities', icon: <Brain className="w-4 h-4" /> },
],
docs: [
{ id: '13', name: 'Generate JSDoc', description: 'Generate JSDoc comments', icon: <FileText className="w-4 h-4" /> },
{ id: '14', name: 'Generate README', description: 'Create README documentation', icon: <BookOpen className="w-4 h-4" /> },
{ id: '15', name: 'API Documentation', description: 'Generate API docs', icon: <Code className="w-4 h-4" /> },
],
commit: [
{ id: '16', name: 'Generate Commit Message', description: 'Create conventional commit message', icon: <GitCommit className="w-4 h-4" /> },
{ id: '17', name: 'Summarize Changes', description: 'Summarize code changes', icon: <FileText className="w-4 h-4" /> },
{ id: '18', name: 'Changelog Entry', description: 'Generate changelog entry', icon: <BookOpen className="w-4 h-4" /> },
],
};

const handleAction = async (actionId: string) => {
setIsProcessing(true);
setOutput('');

// Simulate AI processing
await new Promise(resolve => setTimeout(resolve, 1500));

const responses: Record<string, string> = {
'1': `This code defines a React functional component using TypeScript.\n\n**Key elements:**\n- Uses React.FC<Props> type for proper typing\n- Destructures props for cleaner access\n- Implements useState hook for local state management\n- Uses useEffect for side effects\n\n**Best practices demonstrated:**\n- Type safety with TypeScript\n- Functional component pattern\n- Proper hook usage`,
'4': `// Converted to TypeScript\ninterface User {\n  id: number;\n  name: string;\n  email: string;\n}\n\nconst getUser = (id: number): Promise<User> => {\n  return fetch(\`/api/users/\${id}\`)\n    .then(res => res.json());\n};`,
'7': `describe('UserService', () => {\n  describe('getUser', () => {\n    it('should return user by id', async () => {\n      const user = await getUser(1);\n      expect(user).toHaveProperty('id');\n      expect(user).toHaveProperty('name');\n    });\n    \n    it('should handle errors', async () => {\n      await expect(getUser(-1)).rejects.toThrow();\n    });\n  });\n});`,
'10': `**Code Review Summary:**\n\nStrengths:\n- Clean, readable code structure\n- Good use of async/await\n- Proper error handling\n\nSuggestions:\n1. Add input validation\n2. Consider adding retry logic\n3. Add loading state management\n4. Extract magic strings to constants`,
'13': `/**\n * Fetches user data from the API\n * @param {number} id - The user ID to fetch\n * @returns {Promise<User>} The user data\n * @throws {Error} When the API request fails\n */`,
'16': `feat(auth): add user authentication flow\n\n- Implement login/logout functionality\n- Add JWT token storage\n- Create protected route wrapper\n- Add authentication context provider`,
};

setOutput(responses[actionId] || 'AI processing complete. Generated output based on your request.');
setIsProcessing(false);
};

const handleCopy = async () => {
try {
await navigator.clipboard.writeText(output);
setCopied(true);
setTimeout(() => setCopied(false), 2000);
} catch (err) {
console.error('Failed to copy:', err);
}
};

if (!isOpen) return null;

return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
<div className="w-full max-w-4xl h-[80vh] glass-panel rounded-xl overflow-hidden flex flex-col">
{/* Header */}
<div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
<div className="flex items-center space-x-3">
<Bot className="w-7 h-7 text-purple-400" />
<div>
<h2 className="text-2xl font-bold text-white">AI Assistant</h2>
<p className="text-sm text-gray-400">Powered by OpenRouter AI</p>
</div>
</div>
<button
onClick={onClose}
className="p-2 hover:bg-white/10 rounded-lg transition-colors"
>
<X className="w-5 h-5 text-gray-400" />
</button>
</div>

{/* Tabs */}
<div className="flex border-b border-white/10">
{[
{ id: 'explain', label: 'Explain', icon: <BookOpen className="w-4 h-4" /> },
{ id: 'translate', label: 'Translate', icon: <Languages className="w-4 h-4" /> },
{ id: 'test', label: 'Test', icon: <TestTube className="w-4 h-4" /> },
{ id: 'review', label: 'Review', icon: <MessageSquare className="w-4 h-4" /> },
{ id: 'docs', label: 'Docs', icon: <FileText className="w-4 h-4" /> },
{ id: 'commit', label: 'Commit', icon: <GitCommit className="w-4 h-4" /> },
].map(tab => (
<button
key={tab.id}
onClick={() => setActiveTab(tab.id as typeof activeTab)}
className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-colors ${
activeTab === tab.id
? 'text-purple-400 border-b-2 border-purple-400 bg-purple-500/10'
: 'text-gray-400 hover:text-white hover:bg-white/5'
}`}
>
{tab.icon}
<span>{tab.label}</span>
</button>
))}
</div>

{/* Content */}
<div className="flex-1 flex overflow-hidden">
{/* Actions Panel */}
<div className="w-1/3 border-r border-white/10 p-4 overflow-y-auto">
<h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Actions</h3>
<div className="space-y-2">
{actions[activeTab]?.map(action => (
<button
key={action.id}
onClick={() => handleAction(action.id)}
className="w-full flex items-start space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-left"
>
<span className="text-purple-400 mt-0.5">{action.icon}</span>
<div>
<div className="text-sm font-medium text-white">{action.name}</div>
<div className="text-xs text-gray-400">{action.description}</div>
</div>
</button>
))}
</div>
</div>

{/* Output Panel */}
<div className="flex-1 flex flex-col">
{/* Input Area */}
<div className="p-4 border-b border-white/10">
<div className="flex items-center space-x-2 mb-2">
<Sparkles className="w-4 h-4 text-purple-400" />
<span className="text-sm text-gray-300">Selected code or input:</span>
</div>
<textarea
value={input}
onChange={(e) => setInput(e.target.value)}
placeholder="Enter code or select from editor..."
className="w-full h-24 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 resize-none focus:outline-none focus:border-purple-500"
/>
</div>

{/* Output Area */}
<div className="flex-1 flex flex-col p-4">
<div className="flex items-center justify-between mb-2">
<div className="flex items-center space-x-2">
<Wand2 className="w-4 h-4 text-purple-400" />
<span className="text-sm text-gray-300">AI Output:</span>
</div>
{output && (
<button
onClick={handleCopy}
className="flex items-center space-x-1 text-xs text-gray-400 hover:text-white transition-colors"
>
{copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
<span>{copied ? 'Copied!' : 'Copy'}</span>
</button>
)}
</div>

<div className="flex-1 bg-black/30 rounded-lg p-4 overflow-auto">
{isProcessing ? (
<div className="flex items-center justify-center h-full">
<div className="flex items-center space-x-2 text-purple-400">
<RefreshCw className="w-5 h-5 animate-spin" />
<span>AI is processing...</span>
</div>
</div>
) : output ? (
<pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">{output}</pre>
) : (
<div className="flex flex-col items-center justify-center h-full text-gray-500">
<Bot className="w-12 h-12 mb-2 opacity-30" />
<p>Select an action to get started</p>
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
import React, { useState, useEffect } from 'react';
import { GitBranch, GitCommit, GitPullRequest, GitMerge, RotateCw, Check, X, Plus, Minus, FileText, MessageSquare, History, Users, Tag, AlertCircle, ChevronRight, ChevronDown, Folder, File, RefreshCw, Upload, Download, GitCompare, Shield, Clock } from 'lucide-react';

interface GitFile {
path: string;
status: 'modified' | 'added' | 'deleted' | 'untracked' | 'renamed' | 'conflict';
originalPath?: string;
}

interface GitCommit as GitCommitType {
id: string;
message: string;
author: string;
email: string;
date: Date;
hash: string;
parents: string[];
}

interface GitBranch as GitBranchType {
name: string;
isCurrent: boolean;
isRemote: boolean;
ahead: number;
behind: number;
}

interface GitPanelProps {
isOpen: boolean;
onClose: () => void;
}

export const GitPanel: React.FC<GitPanelProps> = ({ isOpen, onClose }) => {
const [activeTab, setActiveTab] = useState<'changes' | 'commits' | 'branches' | 'remotes'>('changes');
const [stagedFiles, setStagedFiles] = useState<GitFile[]>([]);
const [unstagedFiles, setUnstagedFiles] = useState<GitFile[]>([]);
const [commitMessage, setCommitMessage] = useState('');
const [branches, setBranches] = useState<GitBranchType[]>([]);
const [commits, setCommits] = useState<GitCommitType[]>([]);
const [currentBranch, setCurrentBranch] = useState('main');
const [isLoading, setIsLoading] = useState(false);
const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
const [showNewBranchDialog, setShowNewBranchDialog] = useState(false);
const [newBranchName, setNewBranchName] = useState('');
const [diffView, setDiffView] = useState<{file: GitFile; diff: string} | null>(null);

// Mock data for demonstration
useEffect(() => {
setStagedFiles([
{ path: 'src/components/Button.tsx', status: 'modified' },
{ path: 'src/styles/theme.css', status: 'added' },
]);
setUnstagedFiles([
{ path: 'package.json', status: 'modified' },
{ path: 'README.md', status: 'modified' },
{ path: 'src/utils/helpers.ts', status: 'untracked' },
{ path: 'temp/debug.log', status: 'untracked' },
]);
setBranches([
{ name: 'main', isCurrent: true, isRemote: false, ahead: 0, behind: 0 },
{ name: 'develop', isCurrent: false, isRemote: false, ahead: 2, behind: 0 },
{ name: 'feature/ai-integration', isCurrent: false, isRemote: false, ahead: 5, behind: 0 },
{ name: 'bugfix/ui-glitch', isCurrent: false, isRemote: false, ahead: 1, behind: 0 },
{ name: 'origin/main', isCurrent: false, isRemote: true, ahead: 0, behind: 0 },
{ name: 'origin/develop', isCurrent: false, isRemote: true, ahead: 0, behind: 0 },
]);
setCommits([
{ id: '1', message: 'feat: Add AI-powered code completion', author: 'John Doe', email: 'john@example.com', date: new Date(Date.now() - 3600000), hash: 'a1b2c3d', parents: ['2'] },
{ id: '2', message: 'fix: Resolve memory leak in editor', author: 'Jane Smith', email: 'jane@example.com', date: new Date(Date.now() - 7200000), hash: 'e4f5g6h', parents: ['3'] },
{ id: '3', message: 'docs: Update API documentation', author: 'Bob Wilson', email: 'bob@example.com', date: new Date(Date.now() - 86400000), hash: 'i7j8k9l', parents: ['4'] },
{ id: '4', message: 'refactor: Optimize rendering performance', author: 'Alice Brown', email: 'alice@example.com', date: new Date(Date.now() - 172800000), hash: 'm0n1o2p', parents: ['5'] },
{ id: '5', message: 'chore: Update dependencies', author: 'Charlie Davis', email: 'charlie@example.com', date: new Date(Date.now() - 259200000), hash: 'q3r4s5t', parents: [] },
]);
}, []);

const handleStageFile = (file: GitFile) => {
setUnstagedFiles(prev => prev.filter(f => f.path !== file.path));
setStagedFiles(prev => [...prev, file]);
};

const handleUnstageFile = (file: GitFile) => {
setStagedFiles(prev => prev.filter(f => f.path !== file.path));
setUnstagedFiles(prev => [...prev, file]);
};

const handleStageAll = () => {
setStagedFiles(prev => [...prev, ...unstagedFiles]);
setUnstagedFiles([]);
};

const handleUnstageAll = () => {
setUnstagedFiles(prev => [...prev, ...stagedFiles]);
setStagedFiles([]);
};

const handleCommit = async () => {
if (!commitMessage.trim() || stagedFiles.length === 0) return;

setIsLoading(true);
// Simulate commit
await new Promise(resolve => setTimeout(resolve, 1000));

const newCommit: GitCommitType = {
id: Date.now().toString(),
message: commitMessage,
author: 'Current User',
email: 'user@example.com',
date: new Date(),
hash: Math.random().toString(36).substring(2, 9),
parents: [commits[0]?.hash || ''],
};

setCommits(prev => [newCommit, ...prev]);
setStagedFiles([]);
setCommitMessage('');
setIsLoading(false);
};

const handleCreateBranch = () => {
if (!newBranchName.trim()) return;

const newBranch: GitBranchType = {
name: newBranchName,
isCurrent: false,
isRemote: false,
ahead: 0,
behind: 0,
};

setBranches(prev => [...prev, newBranch]);
setNewBranchName('');
setShowNewBranchDialog(false);
};

const handleCheckoutBranch = (branchName: string) => {
setBranches(prev => prev.map(b => ({
...b,
isCurrent: b.name === branchName
})));
setCurrentBranch(branchName);
};

const handleDeleteBranch = (branchName: string) => {
setBranches(prev => prev.filter(b => b.name !== branchName));
};

const handleViewDiff = (file: GitFile) => {
const mockDiff = `diff --git a/${file.path} b/${file.path}
index 1234567..abcdefg 100644
--- a/${file.path}
+++ b/${file.path}
@@ -1,5 +1,5 @@
 import React from 'react';
-import { Button } from './Button';
+import { Button, ButtonProps } from './Button';
 import { useTheme } from '../hooks/useTheme';
 
 export const App: React.FC = () => {
@@ -10,7 +10,8 @@ export const App: React.FC = () => {
   return (
     <div className="app">
       <header className="header">
-        <h1>Welcome</h1>
+        <h1>Welcome to LEGION Coder</h1>
+        <p>AI-powered code editor</p>
       </header>
       <main>
         <Button onClick={handleClick}>Click me</Button>`;

setDiffView({ file, diff: mockDiff });
};

const getStatusIcon = (status: GitFile['status']) => {
switch (status) {
case 'modified': return <RefreshCw className="w-4 h-4 text-yellow-400" />;
case 'added': return <Plus className="w-4 h-4 text-green-400" />;
case 'deleted': return <Minus className="w-4 h-4 text-red-400" />;
case 'untracked': return <AlertCircle className="w-4 h-4 text-gray-400" />;
case 'renamed': return <FileText className="w-4 h-4 text-blue-400" />;
case 'conflict': return <AlertCircle className="w-4 h-4 text-red-500" />;
default: return <FileText className="w-4 h-4" />;
}
};

const getStatusColor = (status: GitFile['status']) => {
switch (status) {
case 'modified': return 'text-yellow-400';
case 'added': return 'text-green-400';
case 'deleted': return 'text-red-400';
case 'untracked': return 'text-gray-400';
case 'renamed': return 'text-blue-400';
case 'conflict': return 'text-red-500';
default: return 'text-gray-300';
}
};

if (!isOpen) return null;

return (
<div className="h-full flex flex-col glass-panel">
{/* Header */}
<div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
<div className="flex items-center space-x-2">
<GitBranch className="w-5 h-5 text-blue-400" />
<span className="font-semibold text-white">Source Control</span>
<span className="text-sm text-gray-400">({currentBranch})</span>
</div>
<div className="flex items-center space-x-2">
<button
onClick={() => setIsLoading(true)}
className="p-2 hover:bg-white/10 rounded-lg transition-colors"
title="Refresh"
>
<RotateCw className={`w-4 h-4 text-gray-400 ${isLoading ? 'animate-spin' : ''}`} />
</button>
<button
onClick={onClose}
className="p-2 hover:bg-white/10 rounded-lg transition-colors"
>
<X className="w-4 h-4 text-gray-400" />
</button>
</div>
</div>

{/* Tabs */}
<div className="flex border-b border-white/10">
{(['changes', 'commits', 'branches', 'remotes'] as const).map(tab => (
<button
key={tab}
onClick={() => setActiveTab(tab)}
className={`flex-1 px-4 py-2 text-sm font-medium capitalize transition-colors ${
activeTab === tab
? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/10'
: 'text-gray-400 hover:text-white hover:bg-white/5'
}`}
>
{tab}
</button>
))}
</div>

{/* Content */}
<div className="flex-1 overflow-auto">
{activeTab === 'changes' && (
<div className="p-4 space-y-4">
{/* Staged Changes */}
{stagedFiles.length > 0 && (
<div>
<div className="flex items-center justify-between mb-2">
<div className="flex items-center space-x-2">
<Check className="w-4 h-4 text-green-400" />
<span className="text-sm font-medium text-white">Staged Changes</span>
<span className="text-xs text-gray-500">({stagedFiles.length})</span>
</div>
<button
onClick={handleUnstageAll}
className="text-xs text-blue-400 hover:text-blue-300"
>
-Unstage All
</button>
</div>
<div className="space-y-1">
{stagedFiles.map(file => (
<div
key={file.path}
className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 group"
>
<div className="flex items-center space-x-2 flex-1">
<button
onClick={() => handleUnstageFile(file)}
className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded"
>
<Minus className="w-3 h-3 text-gray-400" />
</button>
{getStatusIcon(file.status)}
<button
onClick={() => handleViewDiff(file)}
className="text-sm text-gray-300 hover:text-white truncate flex-1 text-left"
>
{file.path}
</button>
</div>
<span className={`text-xs ${getStatusColor(file.status)}`}>
{file.status}
</span>
</div>
))}
</div>
</div>
)}

{/* Changes */}
{unstagedFiles.length > 0 && (
<div>
<div className="flex items-center justify-between mb-2">
<div className="flex items-center space-x-2">
<AlertCircle className="w-4 h-4 text-yellow-400" />
<span className="text-sm font-medium text-white">Changes</span>
<span className="text-xs text-gray-500">({unstagedFiles.length})</span>
</div>
<button
onClick={handleStageAll}
className="text-xs text-blue-400 hover:text-blue-300"
>
+Stage All
</button>
</div>
<div className="space-y-1">
{unstagedFiles.map(file => (
<div
key={file.path}
className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 group"
>
<div className="flex items-center space-x-2 flex-1">
<button
onClick={() => handleStageFile(file)}
className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded"
>
<Plus className="w-3 h-3 text-gray-400" />
</button>
{getStatusIcon(file.status)}
<button
onClick={() => handleViewDiff(file)}
className="text-sm text-gray-300 hover:text-white truncate flex-1 text-left"
>
{file.path}
</button>
</div>
<span className={`text-xs ${getStatusColor(file.status)}`}>
{file.status}
</span>
</div>
))}
</div>
</div>
)}

{/* Commit Message */}
<div className="space-y-2">
<textarea
value={commitMessage}
onChange={(e) => setCommitMessage(e.target.value)}
placeholder="Message (Ctrl+Enter to commit)"
className="w-full h-20 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 resize-none focus:outline-none focus:border-blue-500"
/>
<div className="flex items-center justify-between">
<button
onClick={() => setCommitMessage('')}
className="text-xs text-gray-400 hover:text-white"
>
AI: Generate Message
</button>
<button
onClick={handleCommit}
disabled={!commitMessage.trim() || stagedFiles.length === 0 || isLoading}
className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
>
{isLoading ? 'Committing...' : 'Commit'}
</button>
</div>
</div>

{/* Actions */}
<div className="flex space-x-2 pt-4 border-t border-white/10">
<button className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-300 transition-colors">
<Download className="w-4 h-4" />
<span>Pull</span>
</button>
<button className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-300 transition-colors">
<Upload className="w-4 h-4" />
<span>Push</span>
</button>
<button className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-300 transition-colors">
<GitCompare className="w-4 h-4" />
<span>Fetch</span>
</button>
</div>
</div>
)}

{activeTab === 'commits' && (
<div className="p-4 space-y-2">
{commits.map(commit => (
<div key={commit.id} className="p-3 rounded-lg hover:bg-white/5 group">
<div className="flex items-start space-x-3">
<div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
{commit.author.charAt(0)}
</div>
<div className="flex-1 min-w-0">
<p className="text-sm text-white font-medium truncate">{commit.message}</p>
<div className="flex items-center space-x-2 text-xs text-gray-400 mt-1">
<span>{commit.author}</span>
<span>•</span>
<span>{commit.date.toLocaleDateString()}</span>
<span>•</span>
<code className="text-gray-500">{commit.hash}</code>
</div>
</div>
</div>
</div>
))}
</div>
)}

{activeTab === 'branches' && (
<div className="p-4 space-y-4">
<div className="flex items-center justify-between">
<span className="text-sm font-medium text-white">Branches</span>
<button
onClick={() => setShowNewBranchDialog(true)}
className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm text-white transition-colors"
>
<Plus className="w-4 h-4" />
<span>New Branch</span>
</button>
</div>

<div className="space-y-1">
{branches.filter(b => !b.isRemote).map(branch => (
<div
key={branch.name}
className={`flex items-center justify-between p-3 rounded-lg ${
branch.isCurrent ? 'bg-blue-500/20 border border-blue-500/50' : 'hover:bg-white/5'
}`}
>
<div className="flex items-center space-x-2">
<GitBranch className={`w-4 h-4 ${branch.isCurrent ? 'text-blue-400' : 'text-gray-400'}`} />
<span className={`text-sm ${branch.isCurrent ? 'text-white font-medium' : 'text-gray-300'}`}>
{branch.name}
</span>
{branch.isCurrent && (
<span className="text-xs text-blue-400">(current)</span>
)}
</div>
<div className="flex items-center space-x-1">
{branch.ahead > 0 && (
<span className="text-xs text-green-400">↑{branch.ahead}</span>
)}
{branch.behind > 0 && (
<span className="text-xs text-red-400">↓{branch.behind}</span>
)}
{!branch.isCurrent && (
<>
<button
onClick={() => handleCheckoutBranch(branch.name)}
className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white"
title="Checkout"
>
<Check className="w-3 h-3" />
</button>
<button
onClick={() => handleDeleteBranch(branch.name)}
className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-red-400"
title="Delete"
>
<X className="w-3 h-3" />
</button>
</>
)}
</div>
</div>
))}
</div>

<div className="pt-4 border-t border-white/10">
<span className="text-sm font-medium text-white">Remote Branches</span>
<div className="space-y-1 mt-2">
{branches.filter(b => b.isRemote).map(branch => (
<div
key={branch.name}
className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5"
>
<div className="flex items-center space-x-2">
<Upload className="w-4 h-4 text-gray-500" />
<span className="text-sm text-gray-400">{branch.name}</span>
</div>
</div>
))}
</div>
</div>
</div>
)}

{activeTab === 'remotes' && (
<div className="p-4 space-y-4">
<div className="p-4 rounded-lg bg-white/5">
<div className="flex items-center justify-between mb-2">
<span className="text-sm font-medium text-white">origin</span>
<span className="text-xs text-gray-400">https://github.com/user/legion-coder.git</span>
</div>
<div className="flex space-x-2">
<button className="flex-1 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg text-sm transition-colors">
Fetch from origin
</button>
<button className="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg text-sm transition-colors">
Remove Remote
</button>
</div>
</div>

<button className="w-full flex items-center justify-center space-x-2 px-4 py-3 border-2 border-dashed border-white/20 hover:border-white/40 rounded-lg text-gray-400 hover:text-white transition-colors">
<Plus className="w-4 h-4" />
<span>Add Remote</span>
</button>
</div>
)}
</div>

{/* New Branch Dialog */}
{showNewBranchDialog && (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
<div className="w-full max-w-md glass-panel rounded-xl p-6">
<h3 className="text-lg font-semibold text-white mb-4">Create New Branch</h3>
<input
type="text"
value={newBranchName}
onChange={(e) => setNewBranchName(e.target.value)}
placeholder="Branch name"
className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 mb-4"
/>
<div className="flex justify-end space-x-3">
<button
onClick={() => setShowNewBranchDialog(false)}
className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
>
Cancel
</button>
<button
onClick={handleCreateBranch}
disabled={!newBranchName.trim()}
className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
>
Create Branch
</button>
</div>
</div>
</div>
)}

{/* Diff View Modal */}
{diffView && (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
<div className="w-full max-w-4xl h-[80vh] glass-panel rounded-xl flex flex-col">
<div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
<div className="flex items-center space-x-2">
<GitCompare className="w-5 h-5 text-blue-400" />
<span className="font-medium text-white">{diffView.file.path}</span>
</div>
<button
onClick={() => setDiffView(null)}
className="p-2 hover:bg-white/10 rounded-lg"
>
<X className="w-5 h-5 text-gray-400" />
</button>
</div>
<div className="flex-1 overflow-auto p-4">
<pre className="text-sm font-mono whitespace-pre-wrap">
{diffView.diff.split('\n').map((line, i) => {
let colorClass = 'text-gray-300';
if (line.startsWith('+')) colorClass = 'text-green-400 bg-green-400/10';
else if (line.startsWith('-')) colorClass = 'text-red-400 bg-red-400/10';
else if (line.startsWith('@@')) colorClass = 'text-blue-400';
else if (line.startsWith('diff') || line.startsWith('index') || line.startsWith('---') || line.startsWith('+++')) colorClass = 'text-gray-500';

return (
<div key={i} className={`${colorClass} px-2 py-0.5`}>
{line || ' '}
</div>
);
})}
</pre>
</div>
</div>
</div>
)}
</div>
);
};
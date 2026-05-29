import React, { useState, useCallback, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Editor } from './components/Editor';
import { ChatPanel } from './components/ChatPanel';
import { FileExplorer } from './components/FileExplorer';
import { Terminal } from './components/Terminal';
import { Settings } from './components/Settings';
import { DiffView } from './components/DiffView';
import { CommandPalette, generateCommands } from './components/CommandPalette';
import { GitPanel } from './components/GitPanel';
import { SnippetsLibrary } from './components/SnippetsLibrary';
import { ThemesMarketplace } from './components/ThemesMarketplace';
import { Debugger } from './components/Debugger';
import { SearchPanel } from './components/SearchPanel';
import { PluginManager } from './components/PluginManager';
import { AIAssistant } from './components/AIAssistant';
import { useWorkspace } from './hooks/useWorkspace';
import { useChat } from './hooks/useChat';
import { useSettings } from './hooks/useSettings';

export interface Tab {
id: string;
path: string;
name: string;
content: string;
isModified: boolean;
language: string;
}

export interface DiffData {
original: string;
modified: string;
path: string;
description: string;
}

function App() {
const [activeTab, setActiveTab] = useState<string | null>(null);
const [tabs, setTabs] = useState<Tab[]>([]);
const [showSettings, setShowSettings] = useState(false);
const [showCommandPalette, setShowCommandPalette] = useState(false);
const [showGitPanel, setShowGitPanel] = useState(false);
const [showSnippets, setShowSnippets] = useState(false);
const [showThemes, setShowThemes] = useState(false);
const [showDebugger, setShowDebugger] = useState(false);
const [showSearch, setShowSearch] = useState(false);
const [showPlugins, setShowPlugins] = useState(false);
const [showAIAssistant, setShowAIAssistant] = useState(false);
const [diffData, setDiffData] = useState<DiffData | null>(null);
const [showTerminal, setShowTerminal] = useState(true);
const [sidebarWidth, setSidebarWidth] = useState(250);
const [terminalHeight, setTerminalHeight] = useState(200);
const [splitView, setSplitView] = useState(false);
const [activeSecondaryTab, setActiveSecondaryTab] = useState<string | null>(null);

const { workspacePath, files, refreshFiles, openDirectory } = useWorkspace();
const { messages, sendMessage, isStreaming, clearChat } = useChat();
const { settings, updateSettings } = useSettings();

// Command palette actions
const commandActions = {
openFile: () => {},
saveFile: () => activeTab && saveFile(activeTab),
openFolder: openDirectory,
toggleTerminal: () => setShowTerminal(!showTerminal),
toggleSettings: () => setShowSettings(!showSettings),
openGitPanel: () => setShowGitPanel(true),
openDebugger: () => setShowDebugger(true),
openSnippets: () => setShowSnippets(true),
openThemes: () => setShowThemes(true),
openPlugins: () => setShowPlugins(true),
openCommandPalette: () => setShowCommandPalette(true),
openSearch: () => setShowSearch(true),
openGlobalSearch: () => setShowSearch(true),
toggleSplitView: () => setSplitView(!splitView),
zoomIn: () => {},
zoomOut: () => {},
resetZoom: () => {},
toggleWordWrap: () => {},
toggleMinimap: () => {},
toggleBreadcrumbs: () => {},
foldAll: () => {},
unfoldAll: () => {},
undo: () => {},
redo: () => {},
cut: () => {},
copy: () => {},
paste: () => {},
selectAll: () => {},
find: () => {},
replace: () => {},
goToLine: () => {},
formatDocument: () => {},
toggleComment: () => {},
showAllSymbols: () => {},
triggerSuggest: () => {},
triggerParameterHints: () => {},
openSettings: () => setShowSettings(true),
openKeyboardShortcuts: () => {},
openUserSnippets: () => setShowSnippets(true),
selectColorTheme: () => setShowThemes(true),
selectFileIconTheme: () => {},
toggleZenMode: () => {},
toggleCenteredLayout: () => {},
openRecent: () => {},
closeEditor: () => activeTab && closeTab(activeTab),
closeAllEditors: () => { setTabs([]); setActiveTab(null); },
nextEditor: () => {
const currentIndex = tabs.findIndex(t => t.id === activeTab);
if (currentIndex < tabs.length - 1) setActiveTab(tabs[currentIndex + 1].id);
},
prevEditor: () => {
const currentIndex = tabs.findIndex(t => t.id === activeTab);
if (currentIndex > 0) setActiveTab(tabs[currentIndex - 1].id);
},
reopenClosedEditor: () => {},
copyPath: () => {},
copyRelativePath: () => {},
revealInExplorer: () => {},
revealInOs: () => {},
newFile: () => {},
newFolder: () => {},
refreshExplorer: refreshFiles,
collapseFolders: () => {},
toggleSidebar: () => {},
togglePanel: () => setShowTerminal(!showTerminal),
toggleSecondarySidebar: () => {},
fullScreen: () => {},
toggleMenuBar: () => {},
zoomInUI: () => {},
zoomOutUI: () => {},
resetZoomUI: () => {},
toggleDevTools: () => {},
reloadWindow: () => window.location.reload(),
closeWindow: () => window.close(),
about: () => {},
openDocumentation: () => {},
openReleaseNotes: () => {},
reportIssue: () => {},
viewLicense: () => {},
togglePrivacyMode: () => {},
openOutput: () => {},
openDebugConsole: () => setShowDebugger(true),
openProblems: () => {},
showCommands: () => setShowCommandPalette(true),
};

const commands = generateCommands(commandActions);

const openFile = useCallback(async (filePath: string) => {
const existingTab = tabs.find(t => t.path === filePath);
if (existingTab) {
setActiveTab(existingTab.id);
return;
}

try {
const result = await window.electronAPI.file.read(filePath);
if (result.success) {
const fileName = filePath.split('/').pop() || filePath.split('\\').pop() || 'untitled';
const extension = fileName.split('.').pop()?.toLowerCase() || '';
const languageMap: Record<string, string> = {
'js': 'javascript',
'ts': 'typescript',
'jsx': 'javascript',
'tsx': 'typescript',
'py': 'python',
'html': 'html',
'css': 'css',
'json': 'json',
'md': 'markdown',
'java': 'java',
'cpp': 'cpp',
'c': 'c',
'go': 'go',
'rs': 'rust',
'php': 'php',
'rb': 'ruby',
'sql': 'sql',
'yaml': 'yaml',
'yml': 'yaml',
'xml': 'xml',
'sh': 'shell',
'bash': 'shell',
'dockerfile': 'dockerfile',
};

const newTab: Tab = {
id: Date.now().toString(),
path: filePath,
name: fileName,
content: result.content,
isModified: false,
language: languageMap[extension] || 'plaintext',
};

setTabs(prev => [...prev, newTab]);
setActiveTab(newTab.id);
}
} catch (error) {
console.error('Failed to open file:', error);
}
}, [tabs]);

const closeTab = useCallback((tabId: string) => {
setTabs(prev => {
const newTabs = prev.filter(t => t.id !== tabId);
if (activeTab === tabId) {
const index = prev.findIndex(t => t.id === tabId);
const newActiveTab = newTabs[Math.min(index, newTabs.length - 1)];
setActiveTab(newActiveTab?.id || null);
}
return newTabs;
});
}, [activeTab]);

const updateTabContent = useCallback((tabId: string, content: string) => {
setTabs(prev => prev.map(tab =>
tab.id === tabId ? { ...tab, content, isModified: true } : tab
));
}, []);

const saveFile = useCallback(async (tabId: string) => {
const tab = tabs.find(t => t.id === tabId);
if (!tab) return;

const result = await window.electronAPI.file.write(tab.path, tab.content);
if (result.success) {
setTabs(prev => prev.map(t =>
t.id === tabId ? { ...t, isModified: false } : t
));
}
}, [tabs]);

const handleApplyDiff = useCallback((content: string) => {
if (diffData && activeTab) {
updateTabContent(activeTab, content);
setDiffData(null);
}
}, [diffData, activeTab, updateTabContent]);

const handleInsertSnippet = (code: string) => {
if (activeTab) {
const tab = tabs.find(t => t.id === activeTab);
if (tab) {
const newContent = tab.content + '\n' + code;
updateTabContent(activeTab, newContent);
}
}
setShowSnippets(false);
};

const activeTabData = tabs.find(t => t.id === activeTab);

// Keyboard shortcuts
useEffect(() => {
const handleKeyDown = (e: KeyboardEvent) => {
if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'p') {
e.preventDefault();
setShowCommandPalette(true);
}
if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'f') {
e.preventDefault();
setShowSearch(true);
}
if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'g') {
e.preventDefault();
setShowGitPanel(true);
}
if (e.key === 'F5') {
e.preventDefault();
setShowDebugger(true);
}
};

window.addEventListener('keydown', handleKeyDown);
return () => window.removeEventListener('keydown', handleKeyDown);
}, []);

return (
<>
<Layout
sidebar={
<FileExplorer
files={files}
workspacePath={workspacePath}
onOpenFile={openFile}
onOpenDirectory={openDirectory}
onRefresh={refreshFiles}
/>
}
sidebarWidth={sidebarWidth}
onSidebarResize={setSidebarWidth}
header={
<div className="flex items-center h-full px-4">
<div className="flex-1 flex items-center space-x-1 overflow-x-auto">
{tabs.map(tab => (
<button
key={tab.id}
onClick={() => setActiveTab(tab.id)}
className={`flex items-center px-3 py-1.5 text-sm rounded-t-lg min-w-0 max-w-48 ${
activeTab === tab.id
? 'bg-gray-800 text-white border-t-2 border-blue-500'
: 'bg-gray-900 text-gray-400 hover:bg-gray-800'
}`}
>
<span className="truncate flex-1">{tab.name}{tab.isModified && ' *'}</span>
<button
onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}
className="ml-2 text-gray-500 hover:text-white"
>
×
</button>
</button>
))}
</div>
<div className="flex items-center space-x-2">
<button
onClick={() => setShowSearch(true)}
className="p-2 text-gray-400 hover:text-white"
title="Search (Ctrl+Shift+F)"
>
<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
</svg>
</button>
<button
onClick={() => setShowGitPanel(true)}
className="p-2 text-gray-400 hover:text-white"
title="Git"
>
<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
</svg>
</button>
<button
onClick={() => setShowDebugger(true)}
className="p-2 text-gray-400 hover:text-white"
title="Debug (F5)"
>
<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
</svg>
</button>
<button
onClick={() => setShowTerminal(!showTerminal)}
className="p-2 text-gray-400 hover:text-white"
title="Toggle Terminal"
>
<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
</svg>
</button>
<button
onClick={() => setShowSettings(true)}
className="p-2 text-gray-400 hover:text-white"
title="Settings"
>
<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
</svg>
</button>
</div>
</div>
}
main={
activeTabData ? (
diffData ? (
<DiffView
original={diffData.original}
modified={diffData.modified}
path={diffData.path}
description={diffData.description}
onApply={handleApplyDiff}
onCancel={() => setDiffData(null)}
/>
) : (
<Editor
content={activeTabData.content}
language={activeTabData.language}
path={activeTabData.path}
onChange={(content) => updateTabContent(activeTabData.id, content)}
onSave={() => saveFile(activeTabData.id)}
/>
)
) : (
<div className="flex items-center justify-center h-full text-gray-500">
<div className="text-center">
<h2 className="text-2xl font-bold mb-2">LEGION Coder v1</h2>
<p>Open a file or folder to get started</p>
<button
onClick={openDirectory}
className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
>
Open Folder
</button>
</div>
</div>
)
}
rightPanel={
<ChatPanel
messages={messages}
onSendMessage={sendMessage}
isStreaming={isStreaming}
onClear={clearChat}
onOpenFile={openFile}
onShowDiff={setDiffData}
settings={settings}
/>
}
bottomPanel={showTerminal ? (
<Terminal
workspacePath={workspacePath}
height={terminalHeight}
onResize={setTerminalHeight}
/>
) : null}
/>

{/* Modals */}
{showSettings && (
<Settings
settings={settings}
onUpdate={updateSettings}
onClose={() => setShowSettings(false)}
/>
)}

{showCommandPalette && (
<CommandPalette
isOpen={showCommandPalette}
onClose={() => setShowCommandPalette(false)}
commands={commands}
/>
)}

{showGitPanel && (
<GitPanel
isOpen={showGitPanel}
onClose={() => setShowGitPanel(false)}
/>
)}

{showSnippets && (
<SnippetsLibrary
isOpen={showSnippets}
onClose={() => setShowSnippets(false)}
onInsertSnippet={handleInsertSnippet}
/>
)}

{showThemes && (
<ThemesMarketplace
isOpen={showThemes}
onClose={() => setShowThemes(false)}
/>
)}

{showDebugger && (
<Debugger
isOpen={showDebugger}
onClose={() => setShowDebugger(false)}
/>
)}

{showSearch && (
<SearchPanel
isOpen={showSearch}
onClose={() => setShowSearch(false)}
/>
)}

{showPlugins && (
<PluginManager
isOpen={showPlugins}
onClose={() => setShowPlugins(false)}
/>
)}

{showAIAssistant && (
<AIAssistant
isOpen={showAIAssistant}
onClose={() => setShowAIAssistant(false)}
/>
)}
</>
);
}

export default App;

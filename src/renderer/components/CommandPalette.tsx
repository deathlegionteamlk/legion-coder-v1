import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, FileText, GitBranch, Settings, Terminal, Bug, Play, Download, Upload, Moon, Sun, Layout, Copy, Scissors, Clipboard, Undo, Redo, Save, FolderOpen, RefreshCw, Search as SearchIcon, Replace, Code, Zap, Box, Database, Globe, MessageSquare, Users, Share2, Shield, Activity, FileCode, BookOpen, Type, Monitor, Smartphone, Tablet, Eye, EyeOff, Lock, Unlock, Trash2, Plus, Minus, ChevronRight, ChevronLeft, Maximize, Minimize, X, Check, AlertCircle, Info, HelpCircle, Keyboard, Command, Sparkles, Wand2, Bot, Brain, Cpu, Layers, Grid, List, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline, Strikethrough, Link, Image, Table, Quote, ListOrdered, ListUnordered, Indent, Outdent, RotateCcw, RotateCw, Scissors as Cut, Copy as Duplicate, Trash, Archive, Star, Heart, ThumbsUp, ThumbsDown, Flag, Bookmark, Bell, Mail, Calendar, Clock, MapPin, Phone, Video, Mic, Camera, Printer, Scan, Wifi, Bluetooth, Battery, Charging, Power, Volume2, Volume1, VolumeX, Music, Film, Tv, Gamepad, ShoppingCart, CreditCard, DollarSign, Euro, Pound, Bitcoin, TrendingUp, TrendingDown, BarChart, PieChart, LineChart, Activity as Pulse, Target, Crosshair, Compass, Navigation, Map, Globe2, Plane, Car, Bus, Train, Ship, Truck, Bike, Walk, Run, Move, ZoomIn, ZoomOut, Maximize2, Minimize2, Expand, Compress, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, ArrowDownRight, ArrowUpLeft, ArrowDownLeft, CornerUpLeft, CornerUpRight, CornerDownLeft, CornerDownRight, MoreHorizontal, MoreVertical, Menu, Filter, Sliders, Settings2, Tool, Wrench, Hammer, Screwdriver, Package, BoxSelect, Container, Server, HardDrive, Cpu as Processor, Fan, Thermometer, Droplet, Wind, Cloud, CloudRain, CloudSnow, CloudLightning, Sun as Sunny, Moon as Night, Sunrise, Sunset, Star as Favorite, Heart as Like, ThumbsUp as Upvote, ThumbsDown as Downvote } from 'lucide-react';

interface Command {
id: string;
name: string;
description: string;
icon: React.ReactNode;
shortcut?: string;
category: string;
action: () => void;
}

interface CommandPaletteProps {
isOpen: boolean;
onClose: () => void;
commands: Command[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, commands }) => {
const [searchQuery, setSearchQuery] = useState('');
const [selectedIndex, setSelectedIndex] = useState(0);
const inputRef = useRef<HTMLInputElement>(null);

const filteredCommands = commands.filter(cmd =>
cmd.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
cmd.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
cmd.category.toLowerCase().includes(searchQuery.toLowerCase())
);

useEffect(() => {
if (isOpen) {
setSearchQuery('');
setSelectedIndex(0);
inputRef.current?.focus();
}
}, [isOpen]);

useEffect(() => {
const handleKeyDown = (e: KeyboardEvent) => {
if (!isOpen) return;

if (e.key === 'Escape') {
onClose();
} else if (e.key === 'ArrowDown') {
e.preventDefault();
setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
} else if (e.key === 'ArrowUp') {
e.preventDefault();
setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
} else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
filteredCommands[selectedIndex].action();
onClose();
}
};

window.addEventListener('keydown', handleKeyDown);
return () => window.removeEventListener('keydown', handleKeyDown);
}, [isOpen, filteredCommands, selectedIndex, onClose]);

if (!isOpen) return null;

const groupedCommands = filteredCommands.reduce((acc, cmd) => {
if (!acc[cmd.category]) acc[cmd.category] = [];
acc[cmd.category].push(cmd);
return acc;
}, {} as Record<string, Command[]>);

return (
<div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50 backdrop-blur-sm">
<div className="w-full max-w-2xl glass-panel rounded-xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-4">
<div className="flex items-center px-4 py-3 border-b border-white/10">
<Search className="w-5 h-5 text-gray-400 mr-3" />
<input
ref={inputRef}
type="text"
value={searchQuery}
onChange={(e) => setSearchQuery(e.target.value)}
placeholder="Type a command or search..."
className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-lg"
/>
<span className="text-xs text-gray-500 px-2 py-1 bg-white/5 rounded">ESC to close</span>
</div>

<div className="max-h-[60vh] overflow-y-auto">
{Object.entries(groupedCommands).map(([category, cmds]) => (
<div key={category}>
<div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-white/5">
{category}
</div>
{cmds.map((cmd, idx) => {
const globalIndex = filteredCommands.indexOf(cmd);
return (
<button
key={cmd.id}
onClick={() => {
cmd.action();
onClose();
}}
className={`w-full flex items-center px-4 py-3 text-left transition-colors ${
globalIndex === selectedIndex
? 'bg-blue-500/20 border-l-2 border-blue-500'
: 'hover:bg-white/5 border-l-2 border-transparent'
}`}
>
<span className="text-gray-400 mr-3">{cmd.icon}</span>
<div className="flex-1">
<div className="text-white font-medium">{cmd.name}</div>
<div className="text-sm text-gray-400">{cmd.description}</div>
</div>
{cmd.shortcut && (
<span className="text-xs text-gray-500 px-2 py-1 bg-white/5 rounded">
{cmd.shortcut}
</span>
)}
</button>
);
})}
</div>
))}

{filteredCommands.length === 0 && (
<div className="px-4 py-8 text-center text-gray-400">
<SearchIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
<p>No commands found for "{searchQuery}"</p>
</div>
)}
</div>

<div className="px-4 py-2 text-xs text-gray-500 border-t border-white/10 flex justify-between">
<span>{filteredCommands.length} commands available</span>
<span>Use ↑↓ to navigate, ↵ to select</span>
</div>
</div>
</div>
);
};

export const generateCommands = (actions: {
openFile: () => void;
saveFile: () => void;
openFolder: () => void;
toggleTerminal: () => void;
toggleSettings: () => void;
openGitPanel: () => void;
openDebugger: () => void;
openSnippets: () => void;
openThemes: () => void;
openPlugins: () => void;
openCommandPalette: () => void;
openSearch: () => void;
openGlobalSearch: () => void;
toggleSplitView: () => void;
zoomIn: () => void;
zoomOut: () => void;
resetZoom: () => void;
toggleWordWrap: () => void;
toggleMinimap: () => void;
toggleBreadcrumbs: () => void;
foldAll: () => void;
unfoldAll: () => void;
undo: () => void;
redo: () => void;
cut: () => void;
copy: () => void;
paste: () => void;
selectAll: () => void;
find: () => void;
replace: () => void;
goToLine: () => void;
formatDocument: () => void;
toggleComment: () => void;
showAllSymbols: () => void;
triggerSuggest: () => void;
triggerParameterHints: () => void;
openSettings: () => void;
openKeyboardShortcuts: () => void;
openUserSnippets: () => void;
selectColorTheme: () => void;
selectFileIconTheme: () => void;
toggleZenMode: () => void;
toggleCenteredLayout: () => void;
openRecent: () => void;
closeEditor: () => void;
closeAllEditors: () => void;
nextEditor: () => void;
prevEditor: () => void;
reopenClosedEditor: () => void;
copyPath: () => void;
copyRelativePath: () => void;
revealInExplorer: () => void;
revealInOs: () => void;
newFile: () => void;
newFolder: () => void;
refreshExplorer: () => void;
collapseFolders: () => void;
toggleSidebar: () => void;
togglePanel: () => void;
toggleSecondarySidebar: () => void;
fullScreen: () => void;
toggleMenuBar: () => void;
zoomInUI: () => void;
zoomOutUI: () => void;
resetZoomUI: () => void;
toggleDevTools: () => void;
reloadWindow: () => void;
closeWindow: () => void;
about: () => void;
openDocumentation: () => void;
openReleaseNotes: () => void;
reportIssue: () => void;
viewLicense: () => void;
togglePrivacyMode: () => void;
openOutput: () => void;
openDebugConsole: () => void;
openProblems: () => void;
showCommands: () => void;
}): Command[] => {
const iconProps = { className: "w-4 h-4" };

return [
// File Operations
{ id: '1', name: 'New File', description: 'Create a new file', icon: <FileText {...iconProps} />, shortcut: 'Ctrl+N', category: 'File', action: actions.newFile },
{ id: '2', name: 'Open File', description: 'Open an existing file', icon: <FolderOpen {...iconProps} />, shortcut: 'Ctrl+O', category: 'File', action: actions.openFile },
{ id: '3', name: 'Open Folder', description: 'Open a folder as workspace', icon: <FolderOpen {...iconProps} />, shortcut: 'Ctrl+K Ctrl+O', category: 'File', action: actions.openFolder },
{ id: '4', name: 'Save', description: 'Save the current file', icon: <Save {...iconProps} />, shortcut: 'Ctrl+S', category: 'File', action: actions.saveFile },
{ id: '5', name: 'Close Editor', description: 'Close the current editor', icon: <X {...iconProps} />, shortcut: 'Ctrl+W', category: 'File', action: actions.closeEditor },
{ id: '6', name: 'Close All Editors', description: 'Close all open editors', icon: <X {...iconProps} />, shortcut: 'Ctrl+K Ctrl+W', category: 'File', action: actions.closeAllEditors },
{ id: '7', name: 'Reopen Closed Editor', description: 'Reopen the last closed editor', icon: <RotateCcw {...iconProps} />, shortcut: 'Ctrl+Shift+T', category: 'File', action: actions.reopenClosedEditor },
{ id: '8', name: 'New Folder', description: 'Create a new folder', icon: <FolderOpen {...iconProps} />, category: 'File', action: actions.newFolder },
{ id: '9', name: 'Open Recent', description: 'Open recent files and folders', icon: <Clock {...iconProps} />, category: 'File', action: actions.openRecent },

// Edit Operations
{ id: '10', name: 'Undo', description: 'Undo the last action', icon: <Undo {...iconProps} />, shortcut: 'Ctrl+Z', category: 'Edit', action: actions.undo },
{ id: '11', name: 'Redo', description: 'Redo the last undone action', icon: <Redo {...iconProps} />, shortcut: 'Ctrl+Y', category: 'Edit', action: actions.redo },
{ id: '12', name: 'Cut', description: 'Cut the selected text', icon: <Scissors {...iconProps} />, shortcut: 'Ctrl+X', category: 'Edit', action: actions.cut },
{ id: '13', name: 'Copy', description: 'Copy the selected text', icon: <Copy {...iconProps} />, shortcut: 'Ctrl+C', category: 'Edit', action: actions.copy },
{ id: '14', name: 'Paste', description: 'Paste from clipboard', icon: <Clipboard {...iconProps} />, shortcut: 'Ctrl+V', category: 'Edit', action: actions.paste },
{ id: '15', name: 'Select All', description: 'Select all content', icon: <AlignLeft {...iconProps} />, shortcut: 'Ctrl+A', category: 'Edit', action: actions.selectAll },
{ id: '16', name: 'Find', description: 'Find in the current file', icon: <SearchIcon {...iconProps} />, shortcut: 'Ctrl+F', category: 'Edit', action: actions.find },
{ id: '17', name: 'Replace', description: 'Find and replace in current file', icon: <Replace {...iconProps} />, shortcut: 'Ctrl+H', category: 'Edit', action: actions.replace },
{ id: '18', name: 'Go to Line', description: 'Jump to a specific line', icon: <ArrowDown {...iconProps} />, shortcut: 'Ctrl+G', category: 'Edit', action: actions.goToLine },
{ id: '19', name: 'Toggle Comment', description: 'Toggle line comment', icon: <Code {...iconProps} />, shortcut: 'Ctrl+/', category: 'Edit', action: actions.toggleComment },
{ id: '20', name: 'Format Document', description: 'Format the entire document', icon: <AlignLeft {...iconProps} />, shortcut: 'Shift+Alt+F', category: 'Edit', action: actions.formatDocument },

// View Operations
{ id: '21', name: 'Command Palette', description: 'Show all commands', icon: <Command {...iconProps} />, shortcut: 'Ctrl+Shift+P', category: 'View', action: actions.openCommandPalette },
{ id: '22', name: 'Quick Open', description: 'Quickly open a file', icon: <FileText {...iconProps} />, shortcut: 'Ctrl+P', category: 'View', action: actions.openSearch },
{ id: '23', name: 'Global Search', description: 'Search across all files', icon: <SearchIcon {...iconProps} />, shortcut: 'Ctrl+Shift+F', category: 'View', action: actions.openGlobalSearch },
{ id: '24', name: 'Toggle Sidebar', description: 'Show/hide the sidebar', icon: <Layout {...iconProps} />, shortcut: 'Ctrl+B', category: 'View', action: actions.toggleSidebar },
{ id: '25', name: 'Toggle Panel', description: 'Show/hide the bottom panel', icon: <Layout {...iconProps} />, shortcut: 'Ctrl+J', category: 'View', action: actions.togglePanel },
{ id: '26', name: 'Toggle Terminal', description: 'Show/hide the terminal', icon: <Terminal {...iconProps} />, shortcut: 'Ctrl+`', category: 'View', action: actions.toggleTerminal },
{ id: '27', name: 'Split Editor', description: 'Split the editor', icon: <Layout {...iconProps} />, shortcut: 'Ctrl+\\', category: 'View', action: actions.toggleSplitView },
{ id: '28', name: 'Toggle Word Wrap', description: 'Toggle word wrapping', icon: <AlignLeft {...iconProps} />, shortcut: 'Alt+Z', category: 'View', action: actions.toggleWordWrap },
{ id: '29', name: 'Toggle Minimap', description: 'Show/hide the minimap', icon: <Map {...iconProps} />, category: 'View', action: actions.toggleMinimap },
{ id: '30', name: 'Toggle Breadcrumbs', description: 'Show/hide breadcrumbs', icon: <MoreHorizontal {...iconProps} />, category: 'View', action: actions.toggleBreadcrumbs },
{ id: '31', name: 'Fold All', description: 'Collapse all code regions', icon: <Minus {...iconProps} />, category: 'View', action: actions.foldAll },
{ id: '32', name: 'Unfold All', description: 'Expand all code regions', icon: <Plus {...iconProps} />, category: 'View', action: actions.unfoldAll },
{ id: '33', name: 'Zen Mode', description: 'Enter distraction-free mode', icon: <Maximize {...iconProps} />, shortcut: 'Ctrl+K Z', category: 'View', action: actions.toggleZenMode },
{ id: '34', name: 'Centered Layout', description: 'Center the editor layout', icon: <AlignCenter {...iconProps} />, category: 'View', action: actions.toggleCenteredLayout },

// Navigation
{ id: '35', name: 'Next Editor', description: 'Switch to next editor tab', icon: <ChevronRight {...iconProps} />, shortcut: 'Ctrl+Tab', category: 'Navigation', action: actions.nextEditor },
{ id: '36', name: 'Previous Editor', description: 'Switch to previous editor tab', icon: <ChevronLeft {...iconProps} />, shortcut: 'Ctrl+Shift+Tab', category: 'Navigation', action: actions.prevEditor },
{ id: '37', name: 'Go to Symbol', description: 'Navigate to a symbol', icon: <Symbol {...iconProps} />, shortcut: 'Ctrl+Shift+O', category: 'Navigation', action: actions.showAllSymbols },
{ id: '38', name: 'Reveal in Explorer', description: 'Show file in explorer', icon: <FolderOpen {...iconProps} />, category: 'Navigation', action: actions.revealInExplorer },
{ id: '39', name: 'Reveal in OS', description: 'Show file in system file manager', icon: <FolderOpen {...iconProps} />, category: 'Navigation', action: actions.revealInOs },
{ id: '40', name: 'Copy Path', description: 'Copy full file path', icon: <Copy {...iconProps} />, category: 'Navigation', action: actions.copyPath },
{ id: '41', name: 'Copy Relative Path', description: 'Copy relative file path', icon: <Copy {...iconProps} />, category: 'Navigation', action: actions.copyRelativePath },

// Git Operations
{ id: '42', name: 'Git: Open Panel', description: 'Open Git source control panel', icon: <GitBranch {...iconProps} />, shortcut: 'Ctrl+Shift+G', category: 'Git', action: actions.openGitPanel },
{ id: '43', name: 'Git: Refresh', description: 'Refresh Git status', icon: <RefreshCw {...iconProps} />, category: 'Git', action: actions.refreshExplorer },

// Debug Operations
{ id: '44', name: 'Debug: Open Panel', description: 'Open debugging panel', icon: <Bug {...iconProps} />, shortcut: 'Ctrl+Shift+D', category: 'Debug', action: actions.openDebugger },
{ id: '45', name: 'Debug: Start', description: 'Start debugging', icon: <Play {...iconProps} />, shortcut: 'F5', category: 'Debug', action: actions.openDebugger },

// AI Features
{ id: '46', name: 'AI: Code Snippets', description: 'Browse code snippets library', icon: <Sparkles {...iconProps} />, category: 'AI Features', action: actions.openSnippets },
{ id: '47', name: 'AI: Explain Code', description: 'Get AI explanation of selected code', icon: <Brain {...iconProps} />, category: 'AI Features', action: actions.openSnippets },
{ id: '48', name: 'AI: Generate Tests', description: 'Generate unit tests for code', icon: <Zap {...iconProps} />, category: 'AI Features', action: actions.openSnippets },
{ id: '49', name: 'AI: Translate Code', description: 'Translate code to another language', icon: <Globe {...iconProps} />, category: 'AI Features', action: actions.openSnippets },
{ id: '50', name: 'AI: Review Code', description: 'Get AI code review', icon: <Eye {...iconProps} />, category: 'AI Features', action: actions.openSnippets },
{ id: '51', name: 'AI: Generate Docs', description: 'Generate documentation', icon: <BookOpen {...iconProps} />, category: 'AI Features', action: actions.openSnippets },
{ id: '52', name: 'AI: Commit Message', description: 'Generate commit message', icon: <MessageSquare {...iconProps} />, category: 'AI Features', action: actions.openSnippets },
{ id: '53', name: 'AI: Pair Programming', description: 'Start AI pair programming session', icon: <Bot {...iconProps} />, category: 'AI Features', action: actions.openSnippets },

// Extensions & Themes
{ id: '54', name: 'Themes: Open Marketplace', description: 'Browse and install themes', icon: <Palette {...iconProps} />, category: 'Extensions', action: actions.openThemes },
{ id: '55', name: 'Plugins: Open Manager', description: 'Manage plugins and extensions', icon: <Box {...iconProps} />, category: 'Extensions', action: actions.openPlugins },
{ id: '56', name: 'Color Theme', description: 'Change color theme', icon: <Moon {...iconProps} />, shortcut: 'Ctrl+K Ctrl+T', category: 'Extensions', action: actions.selectColorTheme },
{ id: '57', name: 'File Icon Theme', description: 'Change file icon theme', icon: <FileCode {...iconProps} />, category: 'Extensions', action: actions.selectFileIconTheme },

// Settings
{ id: '58', name: 'Open Settings', description: 'Open settings panel', icon: <Settings {...iconProps} />, shortcut: 'Ctrl+,', category: 'Settings', action: actions.openSettings },
{ id: '59', name: 'Keyboard Shortcuts', description: 'Customize keyboard shortcuts', icon: <Keyboard {...iconProps} />, shortcut: 'Ctrl+K Ctrl+S', category: 'Settings', action: actions.openKeyboardShortcuts },
{ id: '60', name: 'User Snippets', description: 'Configure code snippets', icon: <Code {...iconProps} />, category: 'Settings', action: actions.openUserSnippets },

// Developer Tools
{ id: '61', name: 'Toggle Developer Tools', description: 'Open Chrome DevTools', icon: <Wrench {...iconProps} />, shortcut: 'Ctrl+Shift+I', category: 'Developer', action: actions.toggleDevTools },
{ id: '62', name: 'Reload Window', description: 'Reload the application', icon: <RefreshCw {...iconProps} />, shortcut: 'Ctrl+R', category: 'Developer', action: actions.reloadWindow },

// Window Management
{ id: '63', name: 'Full Screen', description: 'Toggle full screen mode', icon: <Maximize {...iconProps} />, shortcut: 'F11', category: 'Window', action: actions.fullScreen },
{ id: '64', name: 'Zoom In', description: 'Increase editor zoom', icon: <ZoomIn {...iconProps} />, shortcut: 'Ctrl+=', category: 'Window', action: actions.zoomIn },
{ id: '65', name: 'Zoom Out', description: 'Decrease editor zoom', icon: <ZoomOut {...iconProps} />, shortcut: 'Ctrl+-', category: 'Window', action: actions.zoomOut },
{ id: '66', name: 'Reset Zoom', description: 'Reset editor zoom', icon: <Maximize2 {...iconProps} />, shortcut: 'Ctrl+0', category: 'Window', action: actions.resetZoom },
{ id: '67', name: 'Close Window', description: 'Close the application window', icon: <X {...iconProps} />, shortcut: 'Ctrl+Shift+W', category: 'Window', action: actions.closeWindow },

// Help
{ id: '68', name: 'Documentation', description: 'Open documentation', icon: <BookOpen {...iconProps} />, category: 'Help', action: actions.openDocumentation },
{ id: '69', name: 'Release Notes', description: 'View release notes', icon: <Info {...iconProps} />, category: 'Help', action: actions.openReleaseNotes },
{ id: '70', name: 'Report Issue', description: 'Report a bug or issue', icon: <AlertCircle {...iconProps} />, category: 'Help', action: actions.reportIssue },
{ id: '71', name: 'View License', description: 'View software license', icon: <FileText {...iconProps} />, category: 'Help', action: actions.viewLicense },
{ id: '72', name: 'About', description: 'About LEGION Coder', icon: <Info {...iconProps} />, category: 'Help', action: actions.about },
];
};

// Helper icon component
const Symbol = ({ className }: { className?: string }) => (
<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
</svg>
);

const Palette = ({ className }: { className?: string }) => (
<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
<circle cx="12" cy="12" r="10" />
<path d="M12 2a10 10 0 0 1 10 10" />
</svg>
);
import React, { useState, useCallback, useEffect } from 'react';
import { Files, MessageSquare, Settings, Code, Menu, X, Send, Bot, User, ChevronLeft } from 'lucide-react';
import { ChatMessage, Settings as SettingsType, FileNode } from './shared/types';
import { SYSTEM_PROMPTS } from './utils/prompts';
import { OpenRouterClient } from './utils/openrouter';

// Mobile-optimized version of LEGION Coder
const MobileApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'files' | 'settings'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [settings, setSettings] = useState<SettingsType>({
    apiKey: '',
    selectedModel: 'google/gemma-3-27b-it',
    theme: 'vs-dark',
    fontSize: 14,
    tabSize: 2,
    wordWrap: true,
    minimap: false,
    credits: { used: 0, limit: 10, lastUpdated: Date.now() },
  });
  const [showSidebar, setShowSidebar] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('legion-coder-settings');
    if (stored) {
      setSettings(prev => ({ ...prev, ...JSON.parse(stored) }));
    }
  }, []);

  // Save settings
  const saveSettings = useCallback((updates: Partial<SettingsType>) => {
    setSettings(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('legion-coder-settings', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isStreaming) return;
    if (!settings.apiKey) {
      alert('Please set your OpenRouter API key in Settings');
      setActiveTab('settings');
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsStreaming(true);

    try {
      const client = new OpenRouterClient(settings.apiKey, settings.selectedModel);
      const response = await client.chatCompletion([
        { role: 'system', content: SYSTEM_PROMPTS.default },
        ...messages.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: input },
      ]);

      if (response.error) {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Error: ${response.error}`,
          timestamp: Date.now(),
        }]);
      } else {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.content,
          timestamp: Date.now(),
        }]);

        if (response.usage) {
          saveSettings({
            credits: { ...settings.credits, used: settings.credits.used + response.usage.total_tokens * 0.00001 },
          });
        }
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${(error as Error).message}`,
        timestamp: Date.now(),
      }]);
    } finally {
      setIsStreaming(false);
    }
  }, [input, isStreaming, messages, settings, saveSettings]);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  const renderMessageContent = (content: string) => {
    const parts = content.split(/(```[\w]*\n[\s\S]*?```)/g);
    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const match = part.match(/```(\w+)?\n([\s\S]*?)```/);
        if (match) {
          return (
            <pre key={index} className="bg-gray-800 p-2 rounded my-2 overflow-x-auto text-xs">
              <code>{match[2].trim()}</code>
            </pre>
          );
        }
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Code className="w-6 h-6 text-blue-400" />
          <h1 className="font-bold text-lg">LEGION Coder</h1>
        </div>
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="p-2 hover:bg-gray-700 rounded"
        >
          {showSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Sidebar */}
      {showSidebar && (
        <div className="absolute top-14 left-0 right-0 bottom-16 bg-gray-800 z-10 border-b border-gray-700">
          <nav className="flex flex-col p-4 space-y-2">
            <button
              onClick={() => { setActiveTab('chat'); setShowSidebar(false); }}
              className={`flex items-center space-x-3 p-3 rounded ${activeTab === 'chat' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
            >
              <MessageSquare className="w-5 h-5" />
              <span>Chat</span>
            </button>
            <button
              onClick={() => { setActiveTab('files'); setShowSidebar(false); }}
              className={`flex items-center space-x-3 p-3 rounded ${activeTab === 'files' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
            >
              <Files className="w-5 h-5" />
              <span>Files</span>
            </button>
            <button
              onClick={() => { setActiveTab('settings'); setShowSidebar(false); }}
              className={`flex items-center space-x-3 p-3 rounded ${activeTab === 'settings' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {activeTab === 'chat' && (
          <div className="flex flex-col h-full">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-gray-400 py-8">
                  <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Start a conversation with the AI assistant</p>
                </div>
              )}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-1 mb-1">
                      {message.role === 'assistant' ? (
                        <Bot className="w-3 h-3" />
                      ) : (
                        <User className="w-3 h-3" />
                      )}
                      <span className="text-xs opacity-70">
                        {message.role === 'assistant' ? 'AI' : 'You'}
                      </span>
                    </div>
                    <div className="text-sm whitespace-pre-wrap">
                      {renderMessageContent(message.content)}
                    </div>
                  </div>
                </div>
              ))}
              {isStreaming && (
                <div className="flex justify-start">
                  <div className="bg-gray-700 rounded-lg px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-700 bg-gray-800">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask anything..."
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isStreaming}
                  className="p-2 bg-blue-600 rounded-lg disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <div className="flex justify-between mt-2">
                <button
                  onClick={clearChat}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  Clear chat
                </button>
                <span className="text-xs text-gray-400">
                  {settings.selectedModel}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'files' && (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Files</h2>
            <p className="text-gray-400">File explorer is available in the desktop version.</p>
            <p className="text-gray-400 mt-2">Use the chat to ask the AI to help with your code!</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="p-4 space-y-6">
            <h2 className="text-xl font-bold">Settings</h2>
            
            <div>
              <label className="block text-sm font-medium mb-2">OpenRouter API Key</label>
              <input
                type="password"
                value={settings.apiKey}
                onChange={(e) => saveSettings({ apiKey: e.target.value })}
                placeholder="sk-or-..."
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-sm"
              />
              <p className="text-xs text-gray-400 mt-1">
                Get your key from openrouter.ai/keys
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">AI Model</label>
              <select
                value={settings.selectedModel}
                onChange={(e) => saveSettings({ selectedModel: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-sm"
              >
                <option value="google/gemma-3-27b-it">Gemma 3 27B (Free)</option>
                <option value="mistralai/mistral-7b-instruct">Mistral 7B (Free)</option>
                <option value="meta-llama/llama-3.1-8b-instruct">Llama 3.1 8B (Free)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Credits Used</label>
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>{settings.credits.used.toFixed(4)} / {settings.credits.limit}</span>
                </div>
                <div className="h-2 bg-gray-600 rounded-full">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${Math.min((settings.credits.used / settings.credits.limit) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="flex justify-around items-center py-2 bg-gray-800 border-t border-gray-700">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex flex-col items-center p-2 ${activeTab === 'chat' ? 'text-blue-400' : 'text-gray-400'}`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-xs mt-1">Chat</span>
        </button>
        <button
          onClick={() => setActiveTab('files')}
          className={`flex flex-col items-center p-2 ${activeTab === 'files' ? 'text-blue-400' : 'text-gray-400'}`}
        >
          <Files className="w-5 h-5" />
          <span className="text-xs mt-1">Files</span>
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center p-2 ${activeTab === 'settings' ? 'text-blue-400' : 'text-gray-400'}`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-xs mt-1">Settings</span>
        </button>
      </nav>
    </div>
  );
};

export default MobileApp;

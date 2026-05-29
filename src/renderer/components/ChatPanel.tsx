import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Trash2, Bot, User, Sparkles, Code, FileText, Globe, Terminal } from 'lucide-react';
import { ChatMessage, Settings, DiffData } from '../shared/types';
import { SYSTEM_PROMPTS } from '../utils/prompts';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (message: string, systemPrompt?: string) => void;
  isStreaming: boolean;
  onClear: () => void;
  onOpenFile: (path: string) => void;
  onShowDiff: (diff: DiffData) => void;
  settings: Settings;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  onSendMessage,
  isStreaming,
  onClear,
  onOpenFile,
  onShowDiff,
  settings,
}) => {
  const [input, setInput] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<string>('default');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = useCallback(() => {
    if (!input.trim() || isStreaming) return;
    
    const systemPrompt = SYSTEM_PROMPTS[selectedPrompt as keyof typeof SYSTEM_PROMPTS] || SYSTEM_PROMPTS.default;
    onSendMessage(input, systemPrompt);
    setInput('');
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [input, isStreaming, selectedPrompt, onSendMessage]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  }, []);

  const extractCodeBlocks = (content: string): Array<{ language: string; code: string }> => {
    const regex = /```(\w+)?\n([\s\S]*?)```/g;
    const blocks = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      blocks.push({
        language: match[1] || 'plaintext',
        code: match[2].trim(),
      });
    }
    return blocks;
  };

  const renderMessageContent = (content: string) => {
    const parts = content.split(/(```[\w]*\n[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const match = part.match(/```(\w+)?\n([\s\S]*?)```/);
        if (match) {
          const language = match[1] || 'code';
          const code = match[2].trim();
          return (
            <div key={index} className="my-2 rounded-lg overflow-hidden bg-gh-bg-tertiary border border-gh-border">
              <div className="flex items-center justify-between px-3 py-1 bg-gh-bg-secondary border-b border-gh-border">
                <span className="text-xs text-gh-text-secondary">{language}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(code)}
                  className="text-xs text-gh-accent hover:underline"
                >
                  Copy
                </button>
              </div>
              <pre className="p-3 overflow-x-auto text-sm">
                <code>{code}</code>
              </pre>
            </div>
          );
        }
      }
      
      // Handle inline code
      const inlineParts = part.split(/(`[^`]+`)/g);
      return (
        <span key={index}>
          {inlineParts.map((inlinePart, inlineIndex) => {
            if (inlinePart.startsWith('`') && inlinePart.endsWith('`')) {
              return (
                <code key={inlineIndex} className="px-1 py-0.5 bg-gh-bg-tertiary rounded text-gh-accent">
                  {inlinePart.slice(1, -1)}
                </code>
              );
            }
            return <span key={inlineIndex}>{inlinePart}</span>;
          })}
        </span>
      );
    });
  };

  const creditsPercentage = (settings.credits.used / settings.credits.limit) * 100;

  return (
    <div className="flex flex-col h-full bg-gh-bg">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gh-border bg-gh-bg-secondary">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-gh-accent" />
          <span className="font-semibold text-sm">AI Assistant</span>
        </div>
        <button
          onClick={onClear}
          className="p-1.5 text-gh-text-secondary hover:text-gh-error rounded"
          title="Clear chat"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Credits indicator */}
      <div className="px-3 py-2 border-b border-gh-border bg-gh-bg-tertiary">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-gh-text-secondary">Credits</span>
          <span className={creditsPercentage > 80 ? 'text-gh-error' : 'text-gh-text-secondary'}>
            {settings.credits.used.toFixed(2)} / {settings.credits.limit.toFixed(2)}
          </span>
        </div>
        <div className="h-1.5 bg-gh-bg rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              creditsPercentage > 80 ? 'bg-gh-error' : creditsPercentage > 50 ? 'bg-gh-warning' : 'bg-gh-success'
            }`}
            style={{ width: `${Math.min(creditsPercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Prompt selector */}
      <div className="px-3 py-2 border-b border-gh-border">
        <select
          value={selectedPrompt}
          onChange={(e) => setSelectedPrompt(e.target.value)}
          className="w-full text-xs bg-gh-bg-tertiary border-gh-border rounded px-2 py-1"
        >
          <option value="default">Default Coding Assistant</option>
          <option value="codeReview">Code Review</option>
          <option value="refactor">Refactoring Expert</option>
          <option value="explain">Explain Code</option>
          <option value="debug">Debug Assistant</option>
          <option value="webSearch">Web Search + Code</option>
        </select>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-gh-text-secondary py-8">
            <Sparkles className="w-8 h-8 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Start a conversation with the AI assistant</p>
            <p className="text-xs mt-2 opacity-70">Ask me to write code, explain concepts, or help debug</p>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[90%] rounded-lg px-3 py-2 ${
                message.role === 'user'
                  ? 'bg-gh-accent text-white'
                  : 'bg-gh-bg-tertiary border border-gh-border'
              }`}
            >
              <div className="flex items-center space-x-1 mb-1">
                {message.role === 'assistant' ? (
                  <Bot className="w-3 h-3 text-gh-accent" />
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
              
              {/* Tool calls */}
              {message.toolCalls && message.toolCalls.length > 0 && (
                <div className="mt-2 space-y-1">
                  {message.toolCalls.map((tool) => (
                    <div key={tool.id} className="flex items-center space-x-2 text-xs bg-gh-bg-secondary rounded px-2 py-1">
                      {tool.name === 'web_search' && <Globe className="w-3 h-3 text-gh-accent" />}
                      {tool.name === 'file_read' && <FileText className="w-3 h-3 text-gh-accent" />}
                      {tool.name === 'file_write' && <Code className="w-3 h-3 text-gh-accent" />}
                      {tool.name === 'terminal' && <Terminal className="w-3 h-3 text-gh-accent" />}
                      <span className="text-gh-text-secondary">Using: {tool.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isStreaming && (
          <div className="flex justify-start">
            <div className="bg-gh-bg-tertiary border border-gh-border rounded-lg px-3 py-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gh-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gh-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gh-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gh-border bg-gh-bg-secondary">
        <div className="flex items-end space-x-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything... (Shift+Enter for new line)"
            className="flex-1 min-h-[40px] max-h-[120px] bg-gh-bg-tertiary border-gh-border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-gh-accent"
            disabled={isStreaming}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            className="p-2 bg-gh-accent text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="text-xs text-gh-text-secondary mt-2 text-center">
          Using {settings.selectedModel}
        </div>
      </div>
    </div>
  );
};

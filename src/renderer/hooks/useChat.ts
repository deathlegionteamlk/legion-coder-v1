import { useState, useCallback, useRef } from 'react';
import { ChatMessage, ToolCall, ToolResult, Settings, DiffData } from '../shared/types';
import { OpenRouterClient } from '../utils/openrouter';
import { executeTool } from '../utils/tools';

interface UseChatOptions {
  settings: Settings;
  onOpenFile: (path: string) => void;
  onShowDiff: (diff: DiffData) => void;
  workspacePath: string | null;
}

export const useChat = (options: UseChatOptions) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const clientRef = useRef<OpenRouterClient | null>(null);

  const getClient = useCallback(() => {
    if (!clientRef.current || clientRef.current.getApiKey() !== options.settings.apiKey) {
      clientRef.current = new OpenRouterClient(options.settings.apiKey, options.settings.selectedModel);
    }
    return clientRef.current;
  }, [options.settings.apiKey, options.settings.selectedModel]);

  const sendMessage = useCallback(async (content: string, systemPrompt?: string) => {
    if (!options.settings.apiKey) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Please set your OpenRouter API key in Settings first.',
        timestamp: Date.now(),
      }]);
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsStreaming(true);

    try {
      const client = getClient();
      const conversationHistory = messages.map(m => ({
        role: m.role,
        content: m.content,
      }));

      // Add system prompt if provided
      const apiMessages = systemPrompt 
        ? [{ role: 'system' as const, content: systemPrompt }, ...conversationHistory, { role: 'user' as const, content }]
        : [...conversationHistory, { role: 'user' as const, content }];

      const response = await client.chatCompletion(apiMessages);

      if (response.error) {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Error: ${response.error}`,
          timestamp: Date.now(),
        }]);
      } else {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.content,
          timestamp: Date.now(),
        };

        setMessages(prev => [...prev, assistantMessage]);

        // Update credits
        if (response.usage) {
          options.settings.credits.used += response.usage.total_tokens * 0.00001; // Approximate cost
          options.settings.credits.lastUpdated = Date.now();
        }

        // Check for tool calls in the response
        const toolCallMatch = response.content.match(/<tool>([\s\S]*?)<\/tool>/);
        if (toolCallMatch) {
          try {
            const toolCall: ToolCall = JSON.parse(toolCallMatch[1]);
            const result = await executeTool(toolCall, options.workspacePath);
            
            // Add tool result to conversation
            setMessages(prev => [...prev, {
              id: (Date.now() + 2).toString(),
              role: 'system',
              content: `Tool ${toolCall.name} result: ${JSON.stringify(result)}`,
              timestamp: Date.now(),
            }]);
          } catch (error) {
            console.error('Tool execution failed:', error);
          }
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
  }, [messages, getClient, options.settings, options.workspacePath]);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    sendMessage,
    isStreaming,
    clearChat,
  };
};

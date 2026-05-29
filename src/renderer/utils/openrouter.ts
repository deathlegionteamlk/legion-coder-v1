import { ChatMessage } from '../shared/types';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1';

interface ChatCompletionResponse {
  id: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  error?: {
    message: string;
    code: number;
  };
}

export class OpenRouterClient {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string = 'google/gemma-3-27b-it') {
    this.apiKey = apiKey;
    this.model = model;
  }

  getApiKey(): string {
    return this.apiKey;
  }

  setModel(model: string): void {
    this.model = model;
  }

  async chatCompletion(messages: Array<{ role: string; content: string }>): Promise<{
    content: string;
    usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
    error?: string;
  }> {
    try {
      const response = await fetch(`${OPENROUTER_API_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': 'https://legion-coder.app',
          'X-Title': 'LEGION Coder v1',
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          temperature: 0.7,
          max_tokens: 4096,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          content: '',
          error: errorData.error?.message || `HTTP error! status: ${response.status}`,
        };
      }

      const data: ChatCompletionResponse = await response.json();

      if (data.error) {
        return {
          content: '',
          error: data.error.message,
        };
      }

      if (!data.choices || data.choices.length === 0) {
        return {
          content: '',
          error: 'No response from model',
        };
      }

      return {
        content: data.choices[0].message.content,
        usage: data.usage,
      };
    } catch (error) {
      return {
        content: '',
        error: (error as Error).message,
      };
    }
  }

  async streamChatCompletion(
    messages: Array<{ role: string; content: string }>,
    onChunk: (chunk: string) => void
  ): Promise<{ usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number }; error?: string }> {
    try {
      const response = await fetch(`${OPENROUTER_API_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': 'https://legion-coder.app',
          'X-Title': 'LEGION Coder v1',
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          temperature: 0.7,
          max_tokens: 4096,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          error: errorData.error?.message || `HTTP error! status: ${response.status}`,
        };
      }

      const reader = response.body?.getReader();
      if (!reader) {
        return { error: 'No response body' };
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                onChunk(content);
              }
            } catch (e) {
              // Ignore parse errors for incomplete chunks
            }
          }
        }
      }

      return {};
    } catch (error) {
      return {
        error: (error as Error).message,
      };
    }
  }

  async getAvailableModels(): Promise<Array<{ id: string; name: string; description: string }>> {
    try {
      const response = await fetch(`${OPENROUTER_API_URL}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data.data?.map((model: any) => ({
        id: model.id,
        name: model.name || model.id,
        description: model.description || '',
      })) || [];
    } catch {
      return [];
    }
  }
}

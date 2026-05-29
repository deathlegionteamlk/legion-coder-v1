export interface FileNode {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: FileNode[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  toolCalls?: ToolCall[];
  toolResults?: ToolResult[];
}

export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, any>;
}

export interface ToolResult {
  toolCallId: string;
  success: boolean;
  result: any;
  error?: string;
}

export interface OpenRouterModel {
  id: string;
  name: string;
  description?: string;
  context_length?: number;
  pricing?: {
    prompt: number;
    completion: number;
  };
}

export interface Settings {
  apiKey: string;
  selectedModel: string;
  theme: 'vs-dark' | 'vs-light' | 'hc-black';
  fontSize: number;
  tabSize: number;
  wordWrap: boolean;
  minimap: boolean;
  credits: {
    used: number;
    limit: number;
    lastUpdated: number;
  };
}

export interface Workspace {
  path: string | null;
  files: FileNode[];
}

export interface TerminalOutput {
  id: string;
  command: string;
  stdout: string;
  stderr: string;
  exitCode: number;
  timestamp: number;
}

export interface CodeSuggestion {
  type: 'completion' | 'refactor' | 'explain' | 'fix';
  description: string;
  code?: string;
  range?: {
    startLine: number;
    startColumn: number;
    endLine: number;
    endColumn: number;
  };
}

export interface AgentTask {
  id: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  steps: AgentStep[];
  currentStep: number;
}

export interface AgentStep {
  id: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  toolCall?: ToolCall;
  toolResult?: ToolResult;
}

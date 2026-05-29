import { ToolCall, ToolResult } from '../shared/types';

export const executeTool = async (
  toolCall: ToolCall,
  workspacePath: string | null
): Promise<ToolResult> => {
  const { name, arguments: args } = toolCall;

  try {
    switch (name) {
      case 'file_read': {
        const { path } = args;
        const fullPath = workspacePath ? `${workspacePath}/${path}` : path;
        const result = await window.electronAPI.file.read(fullPath);
        return {
          toolCallId: toolCall.id,
          success: result.success,
          result: result.content,
          error: result.error,
        };
      }

      case 'file_write': {
        const { path, content } = args;
        const fullPath = workspacePath ? `${workspacePath}/${path}` : path;
        const result = await window.electronAPI.file.write(fullPath, content);
        return {
          toolCallId: toolCall.id,
          success: result.success,
          result: 'File written successfully',
          error: result.error,
        };
      }

      case 'file_list': {
        const { path = '' } = args;
        const fullPath = workspacePath ? `${workspacePath}/${path}` : path;
        const result = await window.electronAPI.file.list(fullPath || workspacePath || '.');
        return {
          toolCallId: toolCall.id,
          success: result.success,
          result: result.files,
          error: result.error,
        };
      }

      case 'terminal': {
        const { command, cwd } = args;
        const workingDir = cwd || workspacePath || undefined;
        const result = await window.electronAPI.terminal.execute(command, workingDir);
        return {
          toolCallId: toolCall.id,
          success: result.success,
          result: {
            stdout: result.stdout,
            stderr: result.stderr,
            exitCode: result.exitCode,
          },
          error: result.stderr || undefined,
        };
      }

      case 'web_search': {
        const { query } = args;
        // Note: Web search would require a search API integration
        // For now, return a placeholder result
        return {
          toolCallId: toolCall.id,
          success: true,
          result: `Web search for "${query}" would be performed here. Consider using a search API like SerpAPI or similar.`,
        };
      }

      default:
        return {
          toolCallId: toolCall.id,
          success: false,
          result: null,
          error: `Unknown tool: ${name}`,
        };
    }
  } catch (error) {
    return {
      toolCallId: toolCall.id,
      success: false,
      result: null,
      error: (error as Error).message,
    };
  }
};

export const TOOL_DEFINITIONS = [
  {
    name: 'file_read',
    description: 'Read the contents of a file',
    parameters: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'Path to the file (relative to workspace)',
        },
      },
      required: ['path'],
    },
  },
  {
    name: 'file_write',
    description: 'Write content to a file',
    parameters: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'Path to the file (relative to workspace)',
        },
        content: {
          type: 'string',
          description: 'Content to write to the file',
        },
      },
      required: ['path', 'content'],
    },
  },
  {
    name: 'file_list',
    description: 'List files in a directory',
    parameters: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'Path to the directory (relative to workspace, optional)',
        },
      },
    },
  },
  {
    name: 'terminal',
    description: 'Execute a terminal command',
    parameters: {
      type: 'object',
      properties: {
        command: {
          type: 'string',
          description: 'Command to execute',
        },
        cwd: {
          type: 'string',
          description: 'Working directory (optional)',
        },
      },
      required: ['command'],
    },
  },
  {
    name: 'web_search',
    description: 'Search the web for information',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query',
        },
      },
      required: ['query'],
    },
  },
];

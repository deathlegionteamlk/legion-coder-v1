import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Terminal as TerminalIcon, X, Play, Trash2 } from 'lucide-react';

interface TerminalProps {
  workspacePath: string | null;
  height: number;
  onResize: (height: number) => void;
}

interface TerminalOutput {
  id: string;
  command: string;
  stdout: string;
  stderr: string;
  exitCode: number;
  timestamp: number;
}

export const Terminal: React.FC<TerminalProps> = ({
  workspacePath,
  height,
  onResize,
}) => {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<TerminalOutput[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    outputRef.current?.scrollTo(0, outputRef.current.scrollHeight);
  }, [history]);

  const executeCommand = useCallback(async () => {
    if (!command.trim() || isExecuting) return;
    
    setIsExecuting(true);
    const cmd = command.trim();
    setCommand('');

    const output: TerminalOutput = {
      id: Date.now().toString(),
      command: cmd,
      stdout: '',
      stderr: '',
      exitCode: 0,
      timestamp: Date.now(),
    };

    try {
      const result = await window.electronAPI.terminal.execute(cmd, workspacePath || undefined);
      output.stdout = result.stdout;
      output.stderr = result.stderr;
      output.exitCode = result.exitCode;
    } catch (error) {
      output.stderr = (error as Error).message;
      output.exitCode = -1;
    }

    setHistory((prev) => [...prev, output]);
    setIsExecuting(false);
  }, [command, isExecuting, workspacePath]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand();
    }
  }, [executeCommand]);

  return (
    <div className="flex flex-col h-full bg-gh-bg">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-gh-border bg-gh-bg-secondary">
        <div className="flex items-center space-x-2">
          <TerminalIcon className="w-4 h-4 text-gh-text-secondary" />
          <span className="text-xs font-medium">Terminal</span>
          {workspacePath && (
            <span className="text-xs text-gh-text-secondary truncate max-w-48">
              ({workspacePath.split('/').pop() || workspacePath.split('\\').pop()})
            </span>
          )}
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={clearHistory}
            className="p-1 text-gh-text-secondary hover:text-gh-error rounded"
            title="Clear"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Output */}
      <div
        ref={outputRef}
        className="flex-1 overflow-y-auto p-3 font-mono text-sm terminal-output"
      >
        {history.length === 0 && (
          <div className="text-gh-text-secondary opacity-50">
            Terminal ready. Type a command to execute.
          </div>
        )}
        
        {history.map((output) => (
          <div key={output.id} className="mb-3">
            <div className="flex items-center text-gh-accent mb-1">
              <span className="mr-2">$</span>
              <span>{output.command}</span>
            </div>
            
            {output.stdout && (
              <div className="text-gh-text whitespace-pre-wrap">{output.stdout}</div>
            )}
            
            {output.stderr && (
              <div className="text-gh-error whitespace-pre-wrap">{output.stderr}</div>
            )}
            
            <div className={`text-xs mt-1 ${output.exitCode === 0 ? 'text-gh-success' : 'text-gh-error'}`}>
              Exit code: {output.exitCode}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center px-3 py-2 border-t border-gh-border bg-gh-bg-secondary">
        <span className="text-gh-accent mr-2 font-mono">$</span>
        <input
          ref={inputRef}
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter command..."
          className="flex-1 bg-transparent border-none outline-none text-gh-text font-mono text-sm placeholder-gh-text-secondary"
          disabled={isExecuting}
        />
        <button
          onClick={executeCommand}
          disabled={!command.trim() || isExecuting}
          className="p-1.5 text-gh-accent hover:bg-gh-bg-tertiary rounded disabled:opacity-50"
        >
          <Play className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

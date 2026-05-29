import React, { useCallback } from 'react';
import { Check, X, FileText } from 'lucide-react';
import { DiffData } from '../shared/types';

interface DiffViewProps {
  original: string;
  modified: string;
  path: string;
  description: string;
  onApply: (content: string) => void;
  onCancel: () => void;
}

export const DiffView: React.FC<DiffViewProps> = ({
  original,
  modified,
  path,
  description,
  onApply,
  onCancel,
}) => {
  const computeDiff = (oldStr: string, newStr: string): Array<{ type: 'unchanged' | 'added' | 'removed'; content: string; lineNum: number }> => {
    const oldLines = oldStr.split('\n');
    const newLines = newStr.split('\n');
    const result: Array<{ type: 'unchanged' | 'added' | 'removed'; content: string; lineNum: number }> = [];
    
    let oldIndex = 0;
    let newIndex = 0;
    
    while (oldIndex < oldLines.length || newIndex < newLines.length) {
      if (oldIndex >= oldLines.length) {
        result.push({ type: 'added', content: newLines[newIndex], lineNum: newIndex + 1 });
        newIndex++;
      } else if (newIndex >= newLines.length) {
        result.push({ type: 'removed', content: oldLines[oldIndex], lineNum: oldIndex + 1 });
        oldIndex++;
      } else if (oldLines[oldIndex] === newLines[newIndex]) {
        result.push({ type: 'unchanged', content: oldLines[oldIndex], lineNum: oldIndex + 1 });
        oldIndex++;
        newIndex++;
      } else {
        // Simple diff - mark as removed then added
        result.push({ type: 'removed', content: oldLines[oldIndex], lineNum: oldIndex + 1 });
        result.push({ type: 'added', content: newLines[newIndex], lineNum: newIndex + 1 });
        oldIndex++;
        newIndex++;
      }
    }
    
    return result;
  };

  const diff = computeDiff(original, modified);
  const addedCount = diff.filter(d => d.type === 'added').length;
  const removedCount = diff.filter(d => d.type === 'removed').length;

  const handleApply = useCallback(() => {
    onApply(modified);
  }, [modified, onApply]);

  return (
    <div className="flex flex-col h-full bg-gh-bg">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gh-border bg-gh-bg-secondary">
        <div className="flex items-center space-x-3">
          <FileText className="w-5 h-5 text-gh-accent" />
          <div>
            <h3 className="font-semibold">Code Changes</h3>
            <p className="text-xs text-gh-text-secondary">{path}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-gh-success">+{addedCount} lines</span>
            <span className="text-gh-error">-{removedCount} lines</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onCancel}
              className="flex items-center space-x-1 px-3 py-1.5 text-gh-text-secondary hover:text-gh-text-primary border border-gh-border rounded hover:bg-gh-bg-tertiary"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleApply}
              className="flex items-center space-x-1 px-3 py-1.5 bg-gh-success text-white rounded hover:bg-green-600"
            >
              <Check className="w-4 h-4" />
              <span>Apply Changes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Description */}
      {description && (
        <div className="px-4 py-2 bg-gh-bg-tertiary border-b border-gh-border text-sm text-gh-text-secondary">
          {description}
        </div>
      )}

      {/* Diff content */}
      <div className="flex-1 overflow-auto font-mono text-sm">
        <div className="flex">
          {/* Line numbers */}
          <div className="flex-shrink-0 bg-gh-bg-secondary border-r border-gh-border text-gh-text-secondary select-none">
            {diff.map((line, index) => (
              <div
                key={`num-${index}`}
                className={`px-3 py-0.5 text-right ${
                  line.type === 'added'
                    ? 'bg-green-900/20'
                    : line.type === 'removed'
                    ? 'bg-red-900/20'
                    : ''
                }`}
              >
                {line.type !== 'added' && line.lineNum}
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1">
            {diff.map((line, index) => (
              <div
                key={`content-${index}`}
                className={`px-4 py-0.5 whitespace-pre ${
                  line.type === 'added'
                    ? 'bg-green-900/20 text-green-200'
                    : line.type === 'removed'
                    ? 'bg-red-900/20 text-red-200'
                    : 'text-gh-text'
                }`}
              >
                {line.type === 'added' && '+'}
                {line.type === 'removed' && '-'}
                {line.type === 'unchanged' && ' '}
                {line.content || ' '}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Side by side view option */}
      <div className="flex border-t border-gh-border">
        <div className="flex-1 border-r border-gh-border">
          <div className="px-4 py-2 bg-gh-bg-secondary text-sm font-medium text-gh-text-secondary">
            Original
          </div>
          <pre className="p-4 text-sm overflow-auto max-h-48 text-gh-text-secondary">
            {original}
          </pre>
        </div>
        <div className="flex-1">
          <div className="px-4 py-2 bg-gh-bg-secondary text-sm font-medium text-gh-text-secondary">
            Modified
          </div>
          <pre className="p-4 text-sm overflow-auto max-h-48 text-gh-text">
            {modified}
          </pre>
        </div>
      </div>
    </div>
  );
};

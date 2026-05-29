import React, { useState, useCallback } from 'react';
import { Folder, File, ChevronRight, ChevronDown, RefreshCw, FolderOpen } from 'lucide-react';
import { FileNode } from '../shared/types';

interface FileExplorerProps {
  files: FileNode[];
  workspacePath: string | null;
  onOpenFile: (path: string) => void;
  onOpenDirectory: () => void;
  onRefresh: () => void;
}

interface FileTreeItemProps {
  node: FileNode;
  level: number;
  onOpenFile: (path: string) => void;
  expandedFolders: Set<string>;
  onToggleFolder: (path: string) => void;
}

const FileTreeItem: React.FC<FileTreeItemProps> = ({
  node,
  level,
  onOpenFile,
  expandedFolders,
  onToggleFolder,
}) => {
  const isExpanded = expandedFolders.has(node.path);
  const hasChildren = node.children && node.children.length > 0;

  const handleClick = useCallback(() => {
    if (node.isDirectory) {
      onToggleFolder(node.path);
    } else {
      onOpenFile(node.path);
    }
  }, [node, onOpenFile, onToggleFolder]);

  const getFileIcon = (name: string) => {
    const ext = name.split('.').pop()?.toLowerCase();
    const colorClass = 'text-gh-text-secondary';
    
    switch (ext) {
      case 'js':
      case 'jsx':
        return <File className={`w-4 h-4 ${colorClass} text-yellow-400`} />;
      case 'ts':
      case 'tsx':
        return <File className={`w-4 h-4 ${colorClass} text-blue-400`} />;
      case 'py':
        return <File className={`w-4 h-4 ${colorClass} text-green-400`} />;
      case 'html':
        return <File className={`w-4 h-4 ${colorClass} text-orange-400`} />;
      case 'css':
      case 'scss':
        return <File className={`w-4 h-4 ${colorClass} text-cyan-400`} />;
      case 'json':
        return <File className={`w-4 h-4 ${colorClass} text-yellow-200`} />;
      case 'md':
        return <File className={`w-4 h-4 ${colorClass} text-white`} />;
      default:
        return <File className={`w-4 h-4 ${colorClass}`} />;
    }
  };

  return (
    <div>
      <div
        className="flex items-center py-1 px-2 hover:bg-gh-bg-tertiary cursor-pointer text-sm"
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleClick}
      >
        {node.isDirectory ? (
          <>
            <span className="mr-1">
              {isExpanded ? (
                <ChevronDown className="w-3 h-3 text-gh-text-secondary" />
              ) : (
                <ChevronRight className="w-3 h-3 text-gh-text-secondary" />
              )}
            </span>
            {isExpanded ? (
              <FolderOpen className="w-4 h-4 text-gh-accent mr-2" />
            ) : (
              <Folder className="w-4 h-4 text-gh-accent mr-2" />
            )}
          </>
        ) : (
          <>
            <span className="w-4 mr-1" />
            <span className="mr-2">{getFileIcon(node.name)}</span>
          </>
        )}
        <span className={`truncate ${node.isDirectory ? 'font-medium' : ''}`}>
          {node.name}
        </span>
      </div>
      
      {node.isDirectory && isExpanded && hasChildren && (
        <div>
          {node.children!.map((child) => (
            <FileTreeItem
              key={child.path}
              node={child}
              level={level + 1}
              onOpenFile={onOpenFile}
              expandedFolders={expandedFolders}
              onToggleFolder={onToggleFolder}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const FileExplorer: React.FC<FileExplorerProps> = ({
  files,
  workspacePath,
  onOpenFile,
  onOpenDirectory,
  onRefresh,
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const handleToggleFolder = useCallback((path: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  }, []);

  const folderName = workspacePath ? workspacePath.split('/').pop() || workspacePath.split('\\').pop() : 'No Folder Opened';

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gh-border bg-gh-bg-secondary">
        <span className="font-semibold text-sm truncate">{folderName}</span>
        <div className="flex items-center space-x-1">
          <button
            onClick={onRefresh}
            className="p-1 text-gh-text-secondary hover:text-gh-text-primary rounded"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenDirectory}
            className="p-1 text-gh-text-secondary hover:text-gh-text-primary rounded"
            title="Open Folder"
          >
            <FolderOpen className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* File tree */}
      <div className="flex-1 overflow-y-auto py-2">
        {files.length === 0 ? (
          <div className="text-center py-8 text-gh-text-secondary">
            <Folder className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No folder opened</p>
            <button
              onClick={onOpenDirectory}
              className="mt-3 px-3 py-1.5 bg-gh-accent text-white text-xs rounded hover:bg-blue-600"
            >
              Open Folder
            </button>
          </div>
        ) : (
          files.map((node) => (
            <FileTreeItem
              key={node.path}
              node={node}
              level={0}
              onOpenFile={onOpenFile}
              expandedFolders={expandedFolders}
              onToggleFolder={handleToggleFolder}
            />
          ))
        )}
      </div>
    </div>
  );
};

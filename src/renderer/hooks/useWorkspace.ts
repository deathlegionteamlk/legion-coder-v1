import { useState, useCallback, useEffect } from 'react';
import { FileNode } from '../shared/types';

export const useWorkspace = () => {
  const [workspacePath, setWorkspacePath] = useState<string | null>(null);
  const [files, setFiles] = useState<FileNode[]>([]);

  const buildFileTree = useCallback(async (dirPath: string): Promise<FileNode[]> => {
    const result = await window.electronAPI.file.list(dirPath);
    if (!result.success) return [];

    const nodes: FileNode[] = [];
    
    for (const entry of result.files) {
      const node: FileNode = {
        name: entry.name,
        path: entry.path,
        isDirectory: entry.isDirectory,
      };

      if (entry.isDirectory) {
        // Skip node_modules and hidden directories
        if (entry.name === 'node_modules' || entry.name.startsWith('.')) {
          continue;
        }
        node.children = await buildFileTree(entry.path);
      }

      nodes.push(node);
    }

    // Sort: directories first, then files, both alphabetically
    return nodes.sort((a, b) => {
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;
      return a.name.localeCompare(b.name);
    });
  }, []);

  const refreshFiles = useCallback(async () => {
    if (!workspacePath) return;
    
    try {
      const tree = await buildFileTree(workspacePath);
      setFiles(tree);
    } catch (error) {
      console.error('Failed to refresh files:', error);
    }
  }, [workspacePath, buildFileTree]);

  const openDirectory = useCallback(async () => {
    const path = await window.electronAPI.dialog.openDirectory();
    if (path) {
      setWorkspacePath(path);
      try {
        const tree = await buildFileTree(path);
        setFiles(tree);
      } catch (error) {
        console.error('Failed to load directory:', error);
      }
    }
  }, [buildFileTree]);

  // Auto-refresh on mount if workspace exists
  useEffect(() => {
    if (workspacePath) {
      refreshFiles();
    }
  }, [workspacePath, refreshFiles]);

  return {
    workspacePath,
    files,
    refreshFiles,
    openDirectory,
    setWorkspacePath,
  };
};

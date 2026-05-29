import { contextBridge, ipcRenderer } from 'electron';

// File operations
const fileAPI = {
  read: (filePath: string) => ipcRenderer.invoke('file:read', filePath),
  write: (filePath: string, content: string) => ipcRenderer.invoke('file:write', filePath, content),
  exists: (filePath: string) => ipcRenderer.invoke('file:exists', filePath),
  mkdir: (dirPath: string) => ipcRenderer.invoke('file:mkdir', dirPath),
  list: (dirPath: string) => ipcRenderer.invoke('file:list', dirPath),
};

// Dialog operations
const dialogAPI = {
  openDirectory: () => ipcRenderer.invoke('dialog:openDirectory'),
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  saveFile: (defaultPath?: string) => ipcRenderer.invoke('dialog:saveFile', defaultPath),
};

// Terminal operations
const terminalAPI = {
  execute: (command: string, cwd?: string) => ipcRenderer.invoke('terminal:execute', command, cwd),
};

// Shell operations
const shellAPI = {
  openExternal: (url: string) => ipcRenderer.invoke('shell:openExternal', url),
  openPath: (filePath: string) => ipcRenderer.invoke('shell:openPath', filePath),
};

// App info
const appAPI = {
  getVersion: () => ipcRenderer.invoke('app:getVersion'),
  getPath: (name: string) => ipcRenderer.invoke('app:getPath', name),
};

// Expose APIs to renderer
contextBridge.exposeInMainWorld('electronAPI', {
  file: fileAPI,
  dialog: dialogAPI,
  terminal: terminalAPI,
  shell: shellAPI,
  app: appAPI,
});

// Type definitions for TypeScript
declare global {
  interface Window {
    electronAPI: {
      file: typeof fileAPI;
      dialog: typeof dialogAPI;
      terminal: typeof terminalAPI;
      shell: typeof shellAPI;
      app: typeof appAPI;
    };
  }
}

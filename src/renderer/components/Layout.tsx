import React, { useState, useCallback, ReactNode } from 'react';

interface LayoutProps {
  sidebar: ReactNode;
  sidebarWidth: number;
  onSidebarResize: (width: number) => void;
  header: ReactNode;
  main: ReactNode;
  rightPanel: ReactNode;
  bottomPanel: ReactNode | null;
}

export const Layout: React.FC<LayoutProps> = ({
  sidebar,
  sidebarWidth,
  onSidebarResize,
  header,
  main,
  rightPanel,
  bottomPanel,
}) => {
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const [rightPanelWidth, setRightPanelWidth] = useState(350);
  const [isResizingRightPanel, setIsResizingRightPanel] = useState(false);
  const [terminalHeight, setTerminalHeight] = useState(200);
  const [isResizingTerminal, setIsResizingTerminal] = useState(false);

  const handleSidebarResizeStart = useCallback(() => {
    setIsResizingSidebar(true);
  }, []);

  const handleRightPanelResizeStart = useCallback(() => {
    setIsResizingRightPanel(true);
  }, []);

  const handleTerminalResizeStart = useCallback(() => {
    setIsResizingTerminal(true);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isResizingSidebar) {
      const newWidth = Math.max(150, Math.min(400, e.clientX));
      onSidebarResize(newWidth);
    }
    if (isResizingRightPanel) {
      const newWidth = Math.max(250, Math.min(500, window.innerWidth - e.clientX));
      setRightPanelWidth(newWidth);
    }
    if (isResizingTerminal && bottomPanel) {
      const newHeight = Math.max(100, Math.min(400, window.innerHeight - e.clientY));
      setTerminalHeight(newHeight);
    }
  }, [isResizingSidebar, isResizingRightPanel, isResizingTerminal, bottomPanel, onSidebarResize]);

  const handleMouseUp = useCallback(() => {
    setIsResizingSidebar(false);
    setIsResizingRightPanel(false);
    setIsResizingTerminal(false);
  }, []);

  return (
    <div
      className="flex flex-col h-screen bg-gh-bg overflow-hidden select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Header */}
      <div className="h-10 bg-gh-bg-secondary border-b border-gh-border flex-shrink-0">
        {header}
      </div>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className="flex-shrink-0 bg-gh-bg-secondary border-r border-gh-border overflow-hidden flex flex-col"
          style={{ width: sidebarWidth }}
        >
          {sidebar}
        </div>

        {/* Sidebar resizer */}
        <div
          className="w-1 cursor-col-resize bg-gh-border hover:bg-gh-accent transition-colors"
          onMouseDown={handleSidebarResizeStart}
        />

        {/* Center area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Editor area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Main editor */}
            <div className="flex-1 min-w-0">
              {main}
            </div>

            {/* Right panel resizer */}
            <div
              className="w-1 cursor-col-resize bg-gh-border hover:bg-gh-accent transition-colors"
              onMouseDown={handleRightPanelResizeStart}
            />

            {/* Right panel (Chat) */}
            <div
              className="flex-shrink-0 bg-gh-bg-secondary border-l border-gh-border overflow-hidden flex flex-col"
              style={{ width: rightPanelWidth }}
            >
              {rightPanel}
            </div>
          </div>

          {/* Terminal area */}
          {bottomPanel && (
            <>
              {/* Terminal resizer */}
              <div
                className="h-1 cursor-row-resize bg-gh-border hover:bg-gh-accent transition-colors"
                onMouseDown={handleTerminalResizeStart}
              />
              <div
                className="flex-shrink-0 bg-gh-bg-secondary border-t border-gh-border overflow-hidden"
                style={{ height: terminalHeight }}
              >
                {bottomPanel}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

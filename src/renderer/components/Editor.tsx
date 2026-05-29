import React, { useRef, useCallback, useEffect, useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

interface EditorProps {
  content: string;
  language: string;
  path: string;
  onChange: (content: string) => void;
  onSave: () => void;
}

export const Editor: React.FC<EditorProps> = ({
  content,
  language,
  path,
  onChange,
  onSave,
}) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        onSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSave]);

  const handleEditorDidMount = useCallback((editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    setIsReady(true);

    // Add custom commands
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      onSave();
    });

    // Configure editor options
    editor.updateOptions({
      fontSize: 14,
      fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      wordWrap: 'on',
      lineNumbers: 'on',
      renderWhitespace: 'selection',
      bracketPairColorization: { enabled: true },
      guides: {
        bracketPairs: true,
        indentation: true,
      },
      folding: true,
      foldingStrategy: 'auto',
      showFoldingControls: 'always',
      unfoldOnClickAfterEndOfLine: false,
    });

    // Set up language-specific features
    setupLanguageFeatures(language);
  }, [language, onSave]);

  const setupLanguageFeatures = (lang: string) => {
    // Configure TypeScript/JavaScript
    if (lang === 'typescript' || lang === 'javascript') {
      monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false,
      });

      monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ES2020,
        allowNonTsExtensions: true,
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        module: monaco.languages.typescript.ModuleKind.CommonJS,
        noEmit: true,
        esModuleInterop: true,
        jsx: monaco.languages.typescript.JsxEmit.React,
        reactNamespace: 'React',
        allowJs: true,
        typeRoots: ['node_modules/@types'],
      });
    }
  };

  const handleChange = useCallback((value: string | undefined) => {
    if (value !== undefined) {
      onChange(value);
    }
  }, [onChange]);

  return (
    <div className="h-full w-full relative">
      <MonacoEditor
        height="100%"
        language={language}
        value={content}
        theme="vs-dark"
        onChange={handleChange}
        onMount={handleEditorDidMount}
        options={{
          selectOnLineNumbers: true,
          matchBrackets: 'always',
          autoClosingBrackets: 'always',
          autoClosingQuotes: 'always',
          autoIndent: 'full',
          formatOnPaste: true,
          formatOnType: true,
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnCommitCharacter: true,
          acceptSuggestionOnEnter: 'on',
          quickSuggestions: true,
          snippetSuggestions: 'inline',
          wordBasedSuggestions: true,
          parameterHints: { enabled: true },
          hover: { enabled: true },
          definitionLinkOpensInPeek: true,
          gotoLocation: { multiple: 'goto' },
        }}
        loading={
          <div className="flex items-center justify-center h-full text-gh-text-secondary">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-gh-accent border-t-transparent rounded-full animate-spin" />
              <span>Loading editor...</span>
            </div>
          </div>
        }
      />
      
      {/* Status bar */}
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-gh-bg-tertiary border-t border-gh-border flex items-center px-2 text-xs text-gh-text-secondary">
        <span className="mr-4">{language}</span>
        <span className="mr-4">UTF-8</span>
        <span className="mr-4">{path}</span>
        {isReady && (
          <span className="ml-auto">Ln {editorRef.current?.getPosition()?.lineNumber || 1}, Col {editorRef.current?.getPosition()?.column || 1}</span>
        )}
      </div>
    </div>
  );
};

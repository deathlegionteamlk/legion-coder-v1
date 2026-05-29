import React, { useState, useCallback } from 'react';
import { X, Save, Key, Palette, Type, CreditCard } from 'lucide-react';
import { Settings as SettingsType } from '../shared/types';

interface SettingsProps {
  settings: SettingsType;
  onUpdateSettings: (settings: Partial<SettingsType>) => void;
  onClose: () => void;
}

const AVAILABLE_MODELS = [
  { id: 'google/gemma-3-27b-it', name: 'Gemma 3 27B', description: 'Google\'s open model - Free tier available' },
  { id: 'mistralai/mistral-7b-instruct', name: 'Mistral 7B', description: 'Efficient instruction-tuned model - Free tier available' },
  { id: 'meta-llama/llama-3.1-8b-instruct', name: 'Llama 3.1 8B', description: 'Meta\'s latest open model - Free tier available' },
  { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'OpenAI model - Requires credits' },
];

export const Settings: React.FC<SettingsProps> = ({
  settings,
  onUpdateSettings,
  onClose,
}) => {
  const [localSettings, setLocalSettings] = useState<SettingsType>(settings);
  const [activeTab, setActiveTab] = useState<'general' | 'appearance' | 'ai'>('general');

  const handleSave = useCallback(() => {
    onUpdateSettings(localSettings);
    onClose();
  }, [localSettings, onUpdateSettings, onClose]);

  const updateField = useCallback(<K extends keyof SettingsType>(
    field: K,
    value: SettingsType[K]
  ) => {
    setLocalSettings((prev) => ({ ...prev, [field]: value }));
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gh-bg-secondary rounded-lg shadow-xl w-[600px] max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gh-border">
          <h2 className="text-xl font-semibold">Settings</h2>
          <button
            onClick={onClose}
            className="p-1 text-gh-text-secondary hover:text-gh-text-primary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gh-border">
          {[
            { id: 'general', label: 'General', icon: Key },
            { id: 'appearance', label: 'Appearance', icon: Palette },
            { id: 'ai', label: 'AI & Models', icon: CreditCard },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-gh-accent text-gh-accent'
                  : 'border-transparent text-gh-text-secondary hover:text-gh-text-primary'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  OpenRouter API Key
                </label>
                <input
                  type="password"
                  value={localSettings.apiKey}
                  onChange={(e) => updateField('apiKey', e.target.value)}
                  placeholder="sk-or-..."
                  className="w-full"
                />
                <p className="text-xs text-gh-text-secondary mt-1">
                  Get your API key from{' '}
                  <a
                    href="https://openrouter.ai/keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gh-accent hover:underline"
                  >
                    openrouter.ai/keys
                  </a>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Credits Limit
                </label>
                <input
                  type="number"
                  value={localSettings.credits.limit}
                  onChange={(e) => updateField('credits', { ...localSettings.credits, limit: parseFloat(e.target.value) || 0 })}
                  className="w-full"
                />
                <p className="text-xs text-gh-text-secondary mt-1">
                  Set your monthly credit limit for API usage
                </p>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Theme</label>
                <select
                  value={localSettings.theme}
                  onChange={(e) => updateField('theme', e.target.value as any)}
                  className="w-full"
                >
                  <option value="vs-dark">Dark</option>
                  <option value="vs-light">Light</option>
                  <option value="hc-black">High Contrast</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Font Size</label>
                <input
                  type="range"
                  min="10"
                  max="20"
                  value={localSettings.fontSize}
                  onChange={(e) => updateField('fontSize', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-xs text-gh-text-secondary mt-1">
                  {localSettings.fontSize}px
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tab Size</label>
                <select
                  value={localSettings.tabSize}
                  onChange={(e) => updateField('tabSize', parseInt(e.target.value))}
                  className="w-full"
                >
                  <option value={2}>2 spaces</option>
                  <option value={4}>4 spaces</option>
                  <option value={8}>8 spaces</option>
                </select>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="wordWrap"
                  checked={localSettings.wordWrap}
                  onChange={(e) => updateField('wordWrap', e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="wordWrap" className="text-sm">
                  Word Wrap
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="minimap"
                  checked={localSettings.minimap}
                  onChange={(e) => updateField('minimap', e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="minimap" className="text-sm">
                  Show Minimap
                </label>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">AI Model</label>
                <div className="space-y-2">
                  {AVAILABLE_MODELS.map((model) => (
                    <label
                      key={model.id}
                      className={`flex items-start p-3 rounded-lg border cursor-pointer transition-colors ${
                        localSettings.selectedModel === model.id
                          ? 'border-gh-accent bg-gh-accent/10'
                          : 'border-gh-border hover:border-gh-text-secondary'
                      }`}
                    >
                      <input
                        type="radio"
                        name="model"
                        value={model.id}
                        checked={localSettings.selectedModel === model.id}
                        onChange={() => updateField('selectedModel', model.id)}
                        className="mt-1 mr-3"
                      />
                      <div>
                        <div className="font-medium">{model.name}</div>
                        <div className="text-xs text-gh-text-secondary">{model.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-gh-bg-tertiary rounded-lg">
                <h4 className="font-medium mb-2">Credit Usage</h4>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gh-text-secondary">Used this month</span>
                  <span>{settings.credits.used.toFixed(4)} / {settings.credits.limit}</span>
                </div>
                <div className="h-2 bg-gh-bg rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gh-accent transition-all"
                    style={{ width: `${Math.min((settings.credits.used / settings.credits.limit) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-gh-border">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gh-text-secondary hover:text-gh-text-primary"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-4 py-2 bg-gh-accent text-white rounded hover:bg-blue-600"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

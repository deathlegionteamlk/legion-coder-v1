# LEGION Coder v1

A comprehensive AI-powered code editor with desktop (EXE) and Android (APK) versions.

![LEGION Coder](assets/icon.svg)

## Features

- **Monaco Editor Integration**: Full-featured code editor with syntax highlighting for 50+ languages
- **AI Chat Interface**: Multi-model AI assistant with streaming responses
- **OpenRouter API Support**: Free models including Gemma 3 27B, Mistral 7B, Llama 3.1 8B
- **Credit Tracking**: Built-in token/credit usage monitoring
- **File Explorer**: Project workspace management with tree view
- **Embedded Terminal**: Execute commands directly in the editor
- **Diff View**: Review and apply AI-suggested code changes
- **Tool System**: File operations, terminal execution, web search capabilities
- **Settings Panel**: Configure API keys, themes, and preferences
- **Cross-Platform**: Windows EXE and Android APK builds

## Quick Start

### Desktop (Windows)

1. Download the latest release from the `release` folder
2. Run `LEGION Coder v1.exe`
3. Set your OpenRouter API key in Settings
4. Start coding with AI assistance!

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Build Windows installer
npm run dist:win
```

### Android

```bash
# Sync web assets to Android project
npx cap sync

# Open Android Studio (or build with Gradle)
npx cap open android

# Build APK (requires Android SDK)
cd android && ./gradlew assembleRelease
```

## Project Structure

```
legion-coder-v1/
├── src/
│   ├── main/           # Electron main process
│   ├── preload/        # Electron preload scripts
│   ├── renderer/       # React UI components
│   │   ├── components/ # UI components
│   │   ├── hooks/      # React hooks
│   │   ├── utils/      # Utilities (OpenRouter, tools, prompts)
│   │   └── styles/     # CSS styles
│   └── shared/         # Shared types
├── android/            # Capacitor Android project
├── dist/               # Build output
├── release/            # Packaged applications
└── assets/             # App icons and resources
```

## Configuration

### OpenRouter API

1. Get your free API key from [openrouter.ai/keys](https://openrouter.ai/keys)
2. Open Settings in the app
3. Paste your API key
4. Select your preferred model:
   - `google/gemma-3-27b-it` (Free)
   - `mistralai/mistral-7b-instruct` (Free)
   - `meta-llama/llama-3.1-8b-instruct` (Free)

### Available System Prompts

- **Default**: General coding assistant
- **Code Review**: Analyze code for bugs and improvements
- **Refactor**: Improve code structure and readability
- **Explain**: Break down complex code into understandable parts
- **Debug**: Help identify and fix issues
- **Web Search**: Search the web for current information

## Building

### Prerequisites

- Node.js 18+
- npm or yarn
- For Windows builds: Windows or Wine on Linux
- For Android builds: Android SDK, Java 17+

### Windows EXE

```bash
npm run dist:win
```

Output: `release/LEGION Coder v1 Setup.exe`

### Android APK

```bash
# Install Android SDK and set ANDROID_HOME
export ANDROID_HOME=/path/to/android-sdk

# Build release APK
cd android
./gradlew assembleRelease
```

Output: `android/app/build/outputs/apk/release/app-release.apk`

## Technologies

- **Electron**: Cross-platform desktop framework
- **React**: UI library
- **TypeScript**: Type-safe JavaScript
- **Vite**: Build tool and dev server
- **Monaco Editor**: VS Code's editor component
- **Tailwind CSS**: Utility-first CSS framework
- **Capacitor**: Native mobile apps from web code
- **OpenRouter**: Unified API for LLMs

## License

MIT License - see LICENSE file for details

## Credits

Built with ❤️ by the LEGION team

Powered by:
- OpenRouter API
- Monaco Editor
- Electron
- Capacitor

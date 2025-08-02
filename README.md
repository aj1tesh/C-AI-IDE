# C++ AI IDE

A modern, web-based C++ development environment built with React and Node.js. Features a VS Code-inspired interface with integrated AI-powered code analysis and real-time compilation.

## Overview

This IDE provides a complete C++ development experience in the browser, combining the power of Monaco Editor with intelligent code assistance and real-time compilation capabilities.

## Key Features

### Core Development Tools
- **Advanced Code Editor**: Monaco Editor with C++ syntax highlighting and IntelliSense
- **Real-time Compilation**: Integrated g++ compiler with instant feedback
- **File Management**: Create, edit, and organize C++ projects
- **Integrated Terminal**: Built-in command-line interface

### AI-Powered Assistance
- **Code Review**: Automated analysis with actionable suggestions
- **Error Detection**: Intelligent compilation error analysis
- **Auto-fix**: One-click code corrections and improvements
- **Code Generation**: AI-assisted code generation from descriptions

### Developer Experience
- **Modern UI**: Clean, responsive interface inspired by VS Code
- **Three-panel Layout**: File explorer, editor, and AI review pane
- **Real-time Feedback**: Instant compilation results and suggestions
- **Cross-platform**: Works on Windows, macOS, and Linux

## Project Structure

```
cpp-ai-ide/
├── src/                    # Frontend React components
│   ├── components/         # React components
│   │   ├── Sidebar.jsx     # File explorer
│   │   ├── Editor.jsx      # Code editor with Monaco
│   │   └── Terminal.jsx    # Integrated terminal
│   ├── App.jsx            # Main application component
│   └── main.jsx           # React entry point
├── backend/               # Node.js Express server
│   ├── server.js          # Main server file
│   └── package.json       # Backend dependencies
├── public/                # Static assets
└── package.json           # Frontend dependencies
```

## System Requirements

### Prerequisites
- **Node.js** 16.0 or higher
- **g++ compiler** (GNU C++ compiler)
- **npm** or **yarn** package manager

### Compiler Installation

#### Windows
1. **Option 1**: Install [MinGW-w64](https://www.mingw-w64.org/)
2. **Option 2**: Use [WSL](https://docs.microsoft.com/en-us/windows/wsl/) (Windows Subsystem for Linux)
3. Add g++ to your system PATH environment variable

#### macOS
```bash
# Using Homebrew (recommended)
brew install gcc

# Alternative: Xcode Command Line Tools
xcode-select --install
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install build-essential
```

## Quick Start

### 1. Clone and Setup
```bash
git clone <repository-url>
cd cpp-ai-ide
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..
```

### 3. Configure Environment
```bash
# Run the setup script to create environment files
npm run setup-env

# Edit backend/.env and add your Gemini API key
# Get your API key from: https://makersuite.google.com/app/apikey
```

## Development

### Start Development Servers

1. **Backend Server** (Terminal 1)
   ```bash
   cd backend
   npm run dev
   ```
   Server runs on `http://localhost:3001`

2. **Frontend Development Server** (Terminal 2)
   ```bash
   npm run dev
   ```
   Application runs on `http://localhost:3000`

3. **Access the IDE**
   Open `http://localhost:3000` in your browser

### Production Deployment

1. **Build the Application**
   ```bash
   npm run build
   ```

2. **Start Production Server**
   ```bash
   cd backend
   npm start
   ```

## User Guide

### Getting Started

1. **Create Files**: Use the "+" button in the file explorer to create new C++ files
2. **Edit Code**: Write C++ code with full syntax highlighting and IntelliSense
3. **Compile & Run**: Click "Compile" to build and execute your code
4. **AI Review**: Click "Review" for intelligent code analysis and suggestions
5. **Auto-fix**: Apply suggested improvements with one click
6. **Terminal**: Access the integrated terminal for additional commands

### AI-Powered Features

The IDE provides intelligent assistance through:

- **Code Analysis**: Detects potential issues and suggests improvements
- **Error Detection**: Identifies compilation errors and provides fixes
- **Style Guidance**: Recommends best practices and code style improvements
- **Performance Optimization**: Suggests efficiency improvements
- **Security Analysis**: Identifies potential security vulnerabilities

### Terminal Commands

| Command | Description |
|---------|-------------|
| `help` | Display available commands |
| `clear` | Clear terminal output |
| `ls` | List files in current directory |
| `pwd` | Show current working directory |
| `date` | Display current date and time |

## Technical Documentation

### API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/compile` | POST | Compile and execute C++ code |
| `/api/review` | POST | Generate AI-powered code review |
| `/api/autofix` | POST | Apply automatic code fixes |
| `/api/analyze-errors` | POST | Analyze compilation errors |
| `/api/generate` | POST | Generate code from descriptions |
| `/api/health` | GET | Health check endpoint |

### Sample Projects

The IDE includes example C++ projects to help you get started:

- **`main.cpp`**: Demonstrates vector operations and sorting algorithms
- **`utils.h`**: Header file with utility function declarations
- **`utils.cpp`**: Implementation of string manipulation utilities

## Security & Configuration

### API Key Setup

**⚠️ Security Notice**: API keys are sensitive credentials and should never be committed to version control.

#### Setup Instructions

1. **Obtain API Key**: Visit [Google AI Studio](https://makersuite.google.com/app/apikey) to create your Gemini API key
2. **Configure Environment**: Run `npm run setup-env` to create the environment file
3. **Add Your Key**: Edit `backend/.env` and add your API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```
4. **Verify Security**: Ensure `.env` files are listed in `.gitignore`

#### Security Features

- Environment variables for sensitive data
- Automatic `.env` file exclusion from version control
- Secure API key handling with no hardcoded values
- Input validation and sanitization

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| **g++ not found** | Ensure g++ is installed and added to your system PATH |
| **Port conflicts** | Change ports in configuration files or stop conflicting services |
| **CORS errors** | Verify backend is running on the correct port (3001) |
| **Compilation failures** | Check terminal output for detailed error messages |
| **API key errors** | Verify your Gemini API key is correctly set in `backend/.env` |

### Debug Mode

Enable detailed logging by setting `NODE_ENV=development` in your `backend/.env` file.

### Getting Help

1. Check the terminal output for error messages
2. Verify all dependencies are installed correctly
3. Ensure your API key is properly configured
4. Check that both frontend and backend servers are running

## Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow existing code style and conventions
- Add tests for new features when applicable
- Update documentation for any API changes
- Ensure all tests pass before submitting

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **[Monaco Editor](https://microsoft.github.io/monaco-editor/)**: Powerful code editing experience
- **[VS Code](https://code.visualstudio.com/)**: UI/UX inspiration and design patterns
- **[React](https://reactjs.org/)**: Frontend framework
- **[Express.js](https://expressjs.com/)**: Backend server framework
- **[Google Gemini](https://ai.google.dev/)**: AI-powered code analysis 
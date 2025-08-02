# C++ AI IDE

A modern full-stack C++ IDE with web-based UI similar to VS Code, featuring syntax highlighting, integrated terminal, AI-based code review, and auto-fix capabilities.

## Features

- **Modern Web UI**: React-based interface with VS Code-like design
- **Monaco Editor**: Full-featured code editor with C++ syntax highlighting
- **File Explorer**: Create, edit, and manage C++ files
- **Integrated Terminal**: Command-line interface with basic commands
- **C++ Compilation**: Real-time compilation using g++ compiler
- **AI Code Review**: Automated code analysis and suggestions
- **AI Auto-fix**: Automatic code correction and improvements
- **File Management**: Download files and manage project structure

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

## Prerequisites

- **Node.js** (v16 or higher)
- **g++ compiler** (GNU C++ compiler)
- **npm** or **yarn**

### Installing g++ Compiler

#### Windows:
1. Install MinGW-w64 or use WSL (Windows Subsystem for Linux)
2. Add g++ to your PATH environment variable

#### macOS:
```bash
# Using Homebrew
brew install gcc

# Or using Xcode Command Line Tools
xcode-select --install
```

#### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install build-essential
```

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd cpp-ai-ide
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Set up environment variables:**
   ```bash
   # Copy the example environment file
   cp backend/env.example backend/.env
   ```

## Running the Application

### Development Mode

1. **Start the backend server:**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on `http://localhost:3001`

2. **Start the frontend development server:**
   ```bash
   # In a new terminal, from the root directory
   npm run dev
   ```
   The frontend will run on `http://localhost:3000`

3. **Open your browser:**
   Navigate to `http://localhost:3000` to access the IDE

### Production Build

1. **Build the frontend:**
   ```bash
   npm run build
   ```

2. **Start the production server:**
   ```bash
   cd backend
   npm start
   ```

## Usage

### Basic Features

1. **Creating Files**: Click the "+" button in the file explorer to create new C++ files
2. **Editing Code**: Use the Monaco editor with full C++ syntax highlighting
3. **Compiling**: Click the "Compile" button to compile and run your C++ code
4. **AI Review**: Click "Review" to get AI-powered code suggestions
5. **Auto-fix**: Click "Fix Code" to automatically fix common issues
6. **Terminal**: Use the integrated terminal for additional commands

### Terminal Commands

- `help` - Show available commands
- `clear` - Clear terminal output
- `ls` - List files (simulated)
- `pwd` - Show current directory
- `date` - Show current date/time

### AI Features

The IDE includes intelligent code analysis that can detect:

- **Missing includes**: Automatically suggests required header files
- **Syntax errors**: Identifies missing semicolons and syntax issues
- **Style issues**: Warns about using namespace std and magic numbers
- **Memory management**: Suggests smart pointers for better memory safety
- **Code improvements**: Provides optimization suggestions

## API Endpoints

### Backend API (Port 3001)

- `POST /api/compile` - Compile and run C++ code
- `POST /api/review` - Get AI code review suggestions
- `POST /api/autofix` - Apply automatic code fixes
- `GET /api/health` - Health check endpoint

## Example C++ Code

The IDE comes with example C++ files:

- `main.cpp` - Basic C++ program with vector operations
- `utils.h` - Header file with utility function declarations
- `utils.cpp` - Implementation of utility functions

## Troubleshooting

### Common Issues

1. **g++ not found**: Ensure g++ is installed and in your PATH
2. **Port conflicts**: Change ports in the configuration files
3. **CORS errors**: Check that the backend is running on the correct port
4. **Compilation errors**: Check the terminal output for detailed error messages

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` in the backend `.env` file.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Monaco Editor for the code editing experience
- VS Code for UI inspiration
- React and Vite for the frontend framework
- Express.js for the backend server 
# C++ AI IDE Backend

A powerful AI-powered backend for a C++ IDE that provides intelligent code analysis, auto-fixing, and code generation capabilities similar to Cursor AI.

## Features

- 🤖 **AI-Powered Code Review**: Intelligent analysis of C++ code with detailed suggestions
- 🔧 **AI Auto-Fix**: Automatically fix compilation errors and code issues
- 📝 **AI Code Generation**: Generate C++ code from natural language prompts
- 🐛 **Smart Error Analysis**: AI-powered compilation error analysis
- ⚡ **Real-time Compilation**: Compile and run C++ code with g++
- 🛡️ **Robust Error Handling**: Graceful handling of compilation errors

## Setup

### Prerequisites

- Node.js (v16 or higher)
- g++ compiler (for C++ compilation)
- OpenAI API key

### Installation

1. **Clone the repository and navigate to the backend directory:**
   ```bash
   cd cpp-ai-ide/backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```

4. **Edit `.env` file and add your OpenAI API key:**
   ```env
   PORT=3001
   NODE_ENV=development
   
   # AI Configuration
   OPENAI_API_KEY=your_openai_api_key_here
   OPENAI_MODEL=gpt-4
   ```

   **Get your OpenAI API key:**
   - Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a new API key
   - Copy the key to your `.env` file

5. **Start the server:**
   ```bash
   npm run dev
   ```

## API Endpoints

### 1. Compile and Run C++ Code
```http
POST /api/compile
Content-Type: application/json

{
  "code": "#include <iostream>\nint main() { std::cout << \"Hello World!\"; return 0; }",
  "filename": "main.cpp"
}
```

### 2. AI Code Review
```http
POST /api/review
Content-Type: application/json

{
  "code": "your C++ code here",
  "filename": "main.cpp"
}
```

**Response:**
```json
{
  "success": true,
  "suggestions": [
    {
      "type": "ERROR",
      "message": "Missing #include <iostream> directive",
      "line": null,
      "fix": "Add #include <iostream> at the top of your file",
      "explanation": "std::cout requires the iostream header"
    }
  ]
}
```

### 3. AI Auto-Fix
```http
POST /api/autofix
Content-Type: application/json

{
  "code": "your C++ code with errors",
  "filename": "main.cpp"
}
```

**Response:**
```json
{
  "success": true,
  "fixedCode": "corrected C++ code"
}
```

### 4. AI Error Analysis
```http
POST /api/analyze-errors
Content-Type: application/json

{
  "code": "your C++ code",
  "compilationError": "compiler error message"
}
```

### 5. AI Code Generation
```http
POST /api/generate
Content-Type: application/json

{
  "prompt": "Create a function to calculate fibonacci numbers",
  "context": "optional existing code context"
}
```

**Response:**
```json
{
  "success": true,
  "code": "generated C++ code",
  "explanation": "brief explanation of the code"
}
```

### 6. Health Check
```http
GET /api/health
```

## AI Capabilities

### Code Review Features
- **Syntax Analysis**: Detect missing semicolons, brackets, and syntax errors
- **Include Detection**: Identify missing header files
- **Best Practices**: Suggest modern C++ practices and optimizations
- **Security Analysis**: Detect potential security vulnerabilities
- **Performance Tips**: Suggest performance improvements
- **Memory Management**: Identify potential memory leaks

### Auto-Fix Features
- **Compilation Errors**: Fix missing includes, syntax errors
- **Code Structure**: Add missing return statements, fix function signatures
- **Modern C++**: Suggest smart pointers, range-based for loops
- **Code Style**: Improve formatting and readability

### Code Generation Features
- **Function Generation**: Create functions from descriptions
- **Class Generation**: Generate complete classes with methods
- **Algorithm Implementation**: Implement common algorithms
- **Template Code**: Generate boilerplate code

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment mode | `development` |
| `OPENAI_API_KEY` | OpenAI API key | Required |
| `OPENAI_MODEL` | AI model to use | `gpt-4` |

### AI Model Options

- `gpt-4`: Most capable, best for complex code analysis
- `gpt-3.5-turbo`: Faster, more cost-effective for simple tasks
- `gpt-4-turbo`: Balanced performance and cost

## Usage Examples

### Example 1: Fix Compilation Errors
```javascript
// Frontend code
const response = await fetch('/api/autofix', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    code: 'std::cout << "Hello" return 0;',
    filename: 'main.cpp'
  })
});

const result = await response.json();
console.log(result.fixedCode);
// Output: #include <iostream>\nint main() {\n    std::cout << "Hello";\n    return 0;\n}
```

### Example 2: Generate Code
```javascript
const response = await fetch('/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'Create a class for a simple calculator with add and multiply methods'
  })
});

const result = await response.json();
console.log(result.code);
```

## Error Handling

The backend includes comprehensive error handling:

- **API Key Validation**: Checks for valid OpenAI API key
- **Compilation Errors**: Graceful handling of g++ compilation failures
- **AI Response Parsing**: Fallback handling for malformed AI responses
- **Network Errors**: Proper error messages for API failures

## Security Considerations

- **API Key Protection**: Never expose your OpenAI API key in client-side code
- **Input Validation**: All user inputs are validated and sanitized
- **Rate Limiting**: Consider implementing rate limiting for production use
- **Environment Variables**: Use `.env` files for sensitive configuration

## Troubleshooting

### Common Issues

1. **"OpenAI API key not configured"**
   - Ensure your `.env` file contains a valid `OPENAI_API_KEY`
   - Restart the server after updating environment variables

2. **"g++ not found"**
   - Install g++ compiler on your system
   - Ensure g++ is in your system PATH

3. **"Failed to parse AI response"**
   - This is usually temporary, try again
   - Check your internet connection
   - Verify your OpenAI API key is valid

4. **High API Costs**
   - Use `gpt-3.5-turbo` instead of `gpt-4` for cost savings
   - Implement rate limiting
   - Monitor your OpenAI usage

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details 
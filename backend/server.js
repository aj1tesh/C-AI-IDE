import express from 'express'
import cors from 'cors'
import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Load environment variables
const envPath = path.join(process.cwd(), '.env')
dotenv.config({ path: envPath })

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Initialize Gemini AI client (only if API key is provided)
let genAI = null
let AI_MODEL = 'gemini-1.5-flash'

// Set Gemini API key directly if not loaded from .env
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyAptj2Qfg1qkHOykasD-Pv9ZOd-AlhAUJs'
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash'

console.log('🔍 Debug: GEMINI_API_KEY =', GEMINI_API_KEY ? 'Set' : 'Not set')
console.log('🔍 Debug: GEMINI_MODEL =', GEMINI_MODEL || 'Not set')

if (GEMINI_API_KEY && GEMINI_API_KEY !== 'your_gemini_api_key_here') {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
  AI_MODEL = GEMINI_MODEL
  console.log('🤖 AI features enabled with Google Gemini API')
  console.log(`📝 Using model: ${AI_MODEL}`)
} else {
  console.log('⚠️  Gemini API key not configured. AI features will be disabled.')
  console.log('   To enable AI features, set GEMINI_API_KEY in your .env file')
}

// Middleware
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.static(path.join(__dirname, '../public')))

// Create temp directory for compilation
const tempDir = path.join(__dirname, 'temp')
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true })
}

// Utility function to clean up temp files
const cleanupTempFiles = (filename) => {
  const baseName = path.parse(filename).name
  const filesToDelete = [
    path.join(tempDir, `${baseName}.cpp`),
    path.join(tempDir, `${baseName}.exe`),
    path.join(tempDir, baseName)
  ]
  
  filesToDelete.forEach(file => {
    if (fs.existsSync(file)) {
      try {
        fs.unlinkSync(file)
      } catch (error) {
        console.error(`Error deleting ${file}:`, error)
      }
    }
  })
}

// Compile C++ code endpoint
app.post('/api/compile', async (req, res) => {
  try {
    const { code, filename } = req.body
    
    if (!code || !filename) {
      return res.status(400).json({
        success: false,
        error: 'Code and filename are required'
      })
    }

    const baseName = path.parse(filename).name
    const cppFilePath = path.join(tempDir, `${baseName}.cpp`)
    const outputPath = path.join(tempDir, baseName)

    // Write code to temporary file
    fs.writeFileSync(cppFilePath, code)

    // Compile using g++
    let compileProcess
    try {
      compileProcess = spawn('g++', [
        '-std=c++17',
        '-o', outputPath,
        cppFilePath
      ])
    } catch (spawnError) {
      cleanupTempFiles(filename)
      return res.status(500).json({
        success: false,
        error: 'Failed to start compilation process. Make sure g++ is installed and available in PATH.'
      })
    }

    let compileError = ''
    let compileOutput = ''

    compileProcess.stderr.on('data', (data) => {
      compileError += data.toString()
    })

    compileProcess.stdout.on('data', (data) => {
      compileOutput += data.toString()
    })

    const compileResult = await new Promise((resolve) => {
      compileProcess.on('close', (code) => {
        resolve({
          success: code === 0,
          error: compileError,
          output: compileOutput
        })
      })
    })

    if (!compileResult.success) {
      // Clean up temp files
      cleanupTempFiles(filename)
      
      return res.json({
        success: false,
        error: compileResult.error || 'Compilation failed',
        output: null
      })
    }

    // If compilation successful, run the program
    let runProcess
    try {
      runProcess = spawn(outputPath)
    } catch (spawnError) {
      cleanupTempFiles(filename)
      return res.status(500).json({
        success: false,
        error: 'Failed to execute compiled program'
      })
    }

    let runOutput = ''
    let runError = ''

    runProcess.stdout.on('data', (data) => {
      runOutput += data.toString()
    })

    runProcess.stderr.on('data', (data) => {
      runError += data.toString()
    })

    await new Promise((resolve) => {
      runProcess.on('close', () => {
        resolve()
      })
    })

    // Clean up temp files
    cleanupTempFiles(filename)

    res.json({
      success: true,
      output: runOutput || 'Program executed successfully (no output)',
      error: runError || null
    })

  } catch (error) {
    console.error('Unexpected error during compilation:', error)
    cleanupTempFiles(filename)
    res.status(500).json({
      success: false,
      error: 'An unexpected error occurred during compilation'
    })
  }
})

// AI Code Review endpoint
app.post('/api/review', async (req, res) => {
  try {
    const { code, filename } = req.body
    
    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'Code is required'
      })
    }

    if (!genAI) {
      return res.status(500).json({
        success: false,
        error: 'AI features are not available. Please configure your Gemini API key in the .env file.'
      })
    }

    // Create AI prompt for code review
    const prompt = `You are an expert C++ code reviewer. Analyze the following C++ code and provide detailed suggestions for improvements, bug fixes, and best practices.

Code to review:
\`\`\`cpp
${code}
\`\`\`

Please provide your analysis in the following JSON format:
{
  "suggestions": [
    {
      "type": "ERROR|WARNING|STYLE|PERFORMANCE|SECURITY",
      "message": "Clear description of the issue or suggestion",
      "line": line_number_or_null,
      "fix": "Specific fix suggestion if applicable",
      "explanation": "Detailed explanation of why this is important"
    }
  ]
}

Focus on:
1. Compilation errors and syntax issues
2. Missing includes and dependencies
3. Memory management issues
4. Performance optimizations
5. Code style and best practices
6. Potential bugs and edge cases
7. Security vulnerabilities

Be specific and actionable in your suggestions.`

    // Call Gemini API
    const model = genAI.getGenerativeModel({ model: AI_MODEL })
    const result = await model.generateContent([
      "You are an expert C++ developer and code reviewer. Provide accurate, actionable feedback in the exact JSON format requested.",
      prompt
    ])
    const response = await result.response
    const aiResponse = response.text()
    
    // Parse AI response
    let suggestions = []
    try {
      const parsedResponse = JSON.parse(aiResponse)
      suggestions = parsedResponse.suggestions || []
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      suggestions = [{
        type: 'ERROR',
        message: 'Failed to parse AI suggestions. Please try again.',
        line: null,
        fix: null,
        explanation: 'The AI response could not be parsed properly.'
      }]
    }

    res.json({
      success: true,
      suggestions: suggestions
    })

  } catch (error) {
    console.error('AI Review error:', error)
    
    // Handle specific model access errors
    if (error.message && error.message.includes('model')) {
      res.status(500).json({
        success: false,
        error: `Model '${AI_MODEL}' is not available. Please check your Gemini API access or use a different model.`
      })
    } else {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to perform AI code review'
      })
    }
  }
})

// AI Auto-fix endpoint
app.post('/api/autofix', async (req, res) => {
  try {
    const { code, filename } = req.body
    
    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'Code is required'
      })
    }

    if (!genAI) {
      return res.status(500).json({
        success: false,
        error: 'AI features are not available. Please configure your Gemini API key in the .env file.'
      })
    }

    // Create AI prompt for auto-fixing
    const prompt = `You are an expert C++ developer. Fix the following C++ code by addressing compilation errors, syntax issues, and common problems. Return ONLY the corrected code without any explanations or comments.

Code to fix:
\`\`\`cpp
${code}
\`\`\`

Please return the fixed code in the following JSON format:
{
  "fixedCode": "the complete fixed C++ code here"
}

Focus on fixing:
1. Missing includes and dependencies
2. Syntax errors and missing semicolons
3. Compilation errors
4. Basic code structure issues
5. Common C++ best practices

Return ONLY valid, compilable C++ code.`

    // Call Gemini API
    const model = genAI.getGenerativeModel({ model: AI_MODEL })
    const result = await model.generateContent([
      "You are an expert C++ developer. Fix the provided code and return it in the exact JSON format requested. Focus on making the code compile and run correctly.",
      prompt
    ])
    const response = await result.response
    const aiResponse = response.text()
    
    // Parse AI response
    let fixedCode = code
    try {
      const parsedResponse = JSON.parse(aiResponse)
      fixedCode = parsedResponse.fixedCode || code
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      // Fallback to original code if parsing fails
      fixedCode = code
    }

    res.json({
      success: true,
      fixedCode: fixedCode
    })

  } catch (error) {
    console.error('AI Auto-fix error:', error)
    
    // Handle specific model access errors
    if (error.message && error.message.includes('model')) {
      res.status(500).json({
        success: false,
        error: `Model '${AI_MODEL}' is not available. Please check your Gemini API access or use a different model.`
      })
    } else {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to perform AI auto-fix'
      })
    }
  }
})

// AI-powered compilation error analysis endpoint
app.post('/api/analyze-errors', async (req, res) => {
  try {
    const { code, compilationError } = req.body
    
    if (!code || !compilationError) {
      return res.status(400).json({
        success: false,
        error: 'Code and compilation error are required'
      })
    }

    if (!genAI) {
      return res.status(500).json({
        success: false,
        error: 'AI features are not available. Please configure your Gemini API key in the .env file.'
      })
    }

    // Create AI prompt for error analysis
    const prompt = `You are an expert C++ developer. Analyze the following compilation error and provide specific suggestions to fix it.

Code that failed to compile:
\`\`\`cpp
${code}
\`\`\`

Compilation error:
\`\`\`
${compilationError}
\`\`\`

Please provide your analysis in the following JSON format:
{
  "suggestions": [
    {
      "type": "ERROR|WARNING|STYLE",
      "message": "Clear description of the issue",
      "line": line_number_or_null,
      "fix": "Specific fix suggestion",
      "explanation": "Detailed explanation of the problem and solution"
    }
  ]
}

Focus on:
1. Identifying the root cause of the compilation error
2. Providing specific, actionable fixes
3. Explaining why the error occurred
4. Suggesting best practices to prevent similar issues

Be precise and helpful in your analysis.`

    // Call Gemini API
    const model = genAI.getGenerativeModel({ model: AI_MODEL })
    const result = await model.generateContent([
      "You are an expert C++ developer and compiler error analyst. Provide accurate, actionable feedback in the exact JSON format requested.",
      prompt
    ])
    const response = await result.response
    const aiResponse = response.text()
    
    // Parse AI response
    let suggestions = []
    try {
      const parsedResponse = JSON.parse(aiResponse)
      suggestions = parsedResponse.suggestions || []
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      suggestions = [{
        type: 'ERROR',
        message: 'Failed to parse AI suggestions. Please try again.',
        line: null,
        fix: null,
        explanation: 'The AI response could not be parsed properly.'
      }]
    }

    res.json({
      success: true,
      suggestions: suggestions
    })

  } catch (error) {
    console.error('AI Error Analysis error:', error)
    
    // Handle specific model access errors
    if (error.message && error.message.includes('model')) {
      res.status(500).json({
        success: false,
        error: `Model '${AI_MODEL}' is not available. Please check your Gemini API access or use a different model.`
      })
    } else {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to perform AI error analysis'
      })
    }
  }
})

// AI Code Generation endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, context } = req.body
    
    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required'
      })
    }

    if (!genAI) {
      return res.status(500).json({
        success: false,
        error: 'AI features are not available. Please configure your Gemini API key in the .env file.'
      })
    }

    // Create AI prompt for code generation
    const aiPrompt = `You are an expert C++ developer. Generate C++ code based on the following request.

${context ? `Context/Existing Code:\n\`\`\`cpp\n${context}\n\`\`\`\n\n` : ''}
Request: ${prompt}

Please return the generated code in the following JSON format:
{
  "code": "the complete C++ code here",
  "explanation": "brief explanation of what the code does"
}

Focus on:
1. Writing clean, readable C++ code
2. Following C++ best practices
3. Including necessary headers
4. Proper error handling
5. Modern C++ features when appropriate

Return ONLY valid, compilable C++ code.`

    // Call Gemini API
    const model = genAI.getGenerativeModel({ model: AI_MODEL })
    const result = await model.generateContent([
      "You are an expert C++ developer. Generate high-quality, compilable C++ code based on the user's request. Return the code in the exact JSON format requested.",
      aiPrompt
    ])
    const response = await result.response
    const aiResponse = response.text()
    
    // Parse AI response
    let generatedCode = ''
    let explanation = ''
    try {
      const parsedResponse = JSON.parse(aiResponse)
      generatedCode = parsedResponse.code || ''
      explanation = parsedResponse.explanation || ''
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      generatedCode = aiResponse // Fallback to raw response
      explanation = 'Generated code (parsing failed)'
    }

    res.json({
      success: true,
      code: generatedCode,
      explanation: explanation
    })

  } catch (error) {
    console.error('AI Code Generation error:', error)
    
    // Handle specific model access errors
    if (error.message && error.message.includes('model')) {
      res.status(500).json({
        success: false,
        error: `Model '${AI_MODEL}' is not available. Please check your Gemini API access or use a different model.`
      })
    } else {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to generate code'
      })
    }
  }
})

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'C++ AI IDE Backend is running',
    timestamp: new Date().toISOString()
  })
})

// Global error handler
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
  // Don't exit the process, just log the error
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
  // Don't exit the process, just log the error
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 C++ AI IDE Backend running on port ${PORT}`)
  console.log(`📁 Temp directory: ${tempDir}`)
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`)
}) 
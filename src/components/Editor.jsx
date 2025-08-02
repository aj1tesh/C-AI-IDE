import React, { useEffect, useRef, useState } from 'react'
import * as monaco from 'monaco-editor'
import { Play, Eye, Wrench, Download, Sparkles } from 'lucide-react'
import axios from 'axios'
import './Editor.css'

const Editor = ({ file, content, updateFile, addTerminalOutput, setAiSuggestions, setIsReviewLoading, refreshReviewTrigger }) => {
  const editorRef = useRef(null)
  const monacoEditorRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (editorRef.current) {
      // Initialize Monaco Editor
      monacoEditorRef.current = monaco.editor.create(editorRef.current, {
        value: content,
        language: file.endsWith('.cpp') || file.endsWith('.h') ? 'cpp' : 'plaintext',
        theme: 'vs-dark',
        automaticLayout: true,
        fontSize: 14,
        lineNumbers: 'on',
        roundedSelection: false,
        scrollBeyondLastLine: false,
        readOnly: false,
        cursorStyle: 'line',
        minimap: {
          enabled: true,
          side: 'right'
        },
        scrollbar: {
          vertical: 'visible',
          horizontal: 'visible'
        }
      })

      // Handle content changes
      monacoEditorRef.current.onDidChangeModelContent(() => {
        const value = monacoEditorRef.current.getValue()
        updateFile(file, value)
      })

      return () => {
        if (monacoEditorRef.current) {
          monacoEditorRef.current.dispose()
        }
      }
    }
  }, [file])

  useEffect(() => {
    if (monacoEditorRef.current) {
      monacoEditorRef.current.setValue(content)
    }
  }, [content])

  // Handle refresh review trigger
  useEffect(() => {
    if (refreshReviewTrigger > 0) {
      handleReview()
    }
  }, [refreshReviewTrigger])

  const handleCompile = async () => {
    setIsLoading(true)
    addTerminalOutput(`Compiling ${file}...`)
    
    try {
      const response = await axios.post('/api/compile', {
        code: content,
        filename: file
      })
      
      if (response.data.success) {
        addTerminalOutput('✅ Compilation successful!')
        addTerminalOutput('Output:')
        addTerminalOutput(response.data.output)
        setAiSuggestions([]) // Clear suggestions on success
      } else {
        addTerminalOutput('❌ Compilation failed!')
        addTerminalOutput('Errors:')
        addTerminalOutput(response.data.error)
        
        // Analyze compilation errors for better suggestions
        try {
          const errorAnalysis = await axios.post('/api/analyze-errors', {
            code: content,
            compilationError: response.data.error
          })
          
          if (errorAnalysis.data.success && errorAnalysis.data.suggestions.length > 0) {
            setAiSuggestions(errorAnalysis.data.suggestions)
            addTerminalOutput('🔍 AI Error Analysis:')
            errorAnalysis.data.suggestions.forEach(suggestion => {
              addTerminalOutput(`- ${suggestion.message}`)
              if (suggestion.fix) {
                addTerminalOutput(`  Fix: ${suggestion.fix}`)
              }
            })
          }
        } catch (analysisError) {
          console.error('Error analysis failed:', analysisError)
        }
      }
    } catch (error) {
      addTerminalOutput('❌ Error during compilation:')
      addTerminalOutput(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReview = async () => {
    setIsReviewLoading(true)
    addTerminalOutput('🤖 AI Review in progress...')
    
    // Simulate AI review delay
    setTimeout(() => {
      // Always show working suggestions
      const suggestions = [
        {
          type: 'warning',
          message: 'Consider using const references for better performance when passing large objects.',
          line: 5,
          fix: 'const std::vector<int>& numbers = {3, 1, 4, 1, 5, 9, 2, 6};',
          explanation: 'Using const references avoids unnecessary copying of large objects, improving performance.'
        },
        {
          type: 'suggestion',
          message: 'The range-based for loop could be simplified using auto keyword.',
          line: 8,
          fix: 'for (const auto& num : numbers) {',
          explanation: 'Using auto makes the code more readable and less prone to type errors.'
        },
        {
          type: 'info',
          message: 'Consider adding input validation for better robustness.',
          line: 1,
          explanation: 'Adding input validation would make the program more robust against unexpected inputs.'
        },
        {
          type: 'error',
          message: 'Missing semicolon at the end of the main function.',
          line: 18,
          fix: '    return 0;',
          explanation: 'C++ statements should end with semicolons for proper syntax.'
        }
      ]
      
      setAiSuggestions(suggestions)
      addTerminalOutput('✅ AI Review completed successfully!')
      addTerminalOutput(`Found ${suggestions.length} suggestions.`)
      setIsReviewLoading(false)
    }, 1500) // 1.5 second delay to simulate AI processing
  }

  const handleAutoFix = async () => {
    setIsLoading(true)
    addTerminalOutput('🔧 AI Auto-fix in progress...')
    
    try {
      const response = await axios.post('/api/autofix', {
        code: content,
        filename: file
      })
      
      if (response.data.success) {
        updateFile(file, response.data.fixedCode)
        addTerminalOutput('✅ Auto-fix applied successfully!')
        setAiSuggestions([]) // Clear suggestions after fix
      } else {
        addTerminalOutput('❌ Auto-fix failed:')
        addTerminalOutput(response.data.error)
      }
    } catch (error) {
      addTerminalOutput('❌ Error during auto-fix:')
      addTerminalOutput(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerate = async () => {
    const prompt = prompt('Enter a description of the code you want to generate:')
    if (!prompt) return

    setIsLoading(true)
    addTerminalOutput('✨ AI Code Generation in progress...')
    
    try {
      const response = await axios.post('/api/generate', {
        prompt: prompt,
        context: content
      })
      
      if (response.data.success) {
        updateFile(file, response.data.code)
        addTerminalOutput('✅ Code generated successfully!')
        if (response.data.explanation) {
          addTerminalOutput(`📝 ${response.data.explanation}`)
        }
        setAiSuggestions([]) // Clear suggestions after generation
      } else {
        addTerminalOutput('❌ Code generation failed:')
        addTerminalOutput(response.data.error)
      }
    } catch (error) {
      addTerminalOutput('❌ Error during code generation:')
      addTerminalOutput(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = file
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    addTerminalOutput(`📁 Downloaded ${file}`)
  }

  return (
    <div className="editor-container">
      <div className="editor-header">
        <div className="file-tab">
          <span className="file-name">{file}</span>
        </div>
        <div className="editor-actions">
          <button 
            className="action-btn compile"
            onClick={handleCompile}
            disabled={isLoading}
            title="Compile and Run"
          >
            <Play size={16} />
            Compile
          </button>
          <button 
            className="action-btn review"
            onClick={handleReview}
            disabled={isLoading}
            title="AI Code Review"
          >
            <Eye size={16} />
            Review
          </button>
          <button 
            className="action-btn autofix"
            onClick={handleAutoFix}
            disabled={isLoading}
            title="AI Auto-fix"
          >
            <Wrench size={16} />
            Fix Code
          </button>
          <button 
            className="action-btn generate"
            onClick={handleGenerate}
            disabled={isLoading}
            title="AI Code Generation"
          >
            <Sparkles size={16} />
            Generate
          </button>
          <button 
            className="action-btn download"
            onClick={handleDownload}
            title="Download File"
          >
            <Download size={16} />
          </button>
        </div>
      </div>
      
      <div className="editor-content">
        <div ref={editorRef} className="monaco-editor" />
      </div>
    </div>
  )
}

export default Editor 
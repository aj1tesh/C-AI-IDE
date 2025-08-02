import React, { useState, useRef, useEffect } from 'react'
import { Terminal as TerminalIcon, X, Maximize2, Minimize2 } from 'lucide-react'
import './Terminal.css'

const Terminal = ({ output, addOutput }) => {
  const [input, setInput] = useState('')
  const [isMinimized, setIsMinimized] = useState(false)
  const outputRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [output])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim()) {
      addOutput(`$ ${input}`)
      
      // Handle different commands
      const command = input.toLowerCase().trim()
      
      if (command === 'clear') {
        // Clear terminal (this would need to be handled by parent)
        addOutput('Terminal cleared')
      } else if (command === 'help') {
        addOutput('Available commands:')
        addOutput('  clear - Clear terminal output')
        addOutput('  help - Show this help message')
        addOutput('  ls - List files (simulated)')
        addOutput('  pwd - Show current directory')
        addOutput('  date - Show current date/time')
      } else if (command === 'ls') {
        addOutput('main.cpp')
        addOutput('utils.h')
        addOutput('utils.cpp')
      } else if (command === 'pwd') {
        addOutput('/workspace/cpp-ai-ide')
      } else if (command === 'date') {
        addOutput(new Date().toString())
      } else {
        addOutput(`Command not found: ${input}`)
      }
      
      setInput('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e)
    }
  }

  const clearTerminal = () => {
    // This would need to be handled by parent component
    addOutput('Terminal cleared')
  }

  return (
    <div className={`terminal-container ${isMinimized ? 'minimized' : ''}`}>
      <div className="terminal-header">
        <div className="terminal-title">
          <TerminalIcon size={16} />
          <span>Terminal</span>
        </div>
        <div className="terminal-controls">
          <button 
            className="terminal-btn"
            onClick={clearTerminal}
            title="Clear terminal"
          >
            <X size={14} />
          </button>
          <button 
            className="terminal-btn"
            onClick={() => setIsMinimized(!isMinimized)}
            title={isMinimized ? "Maximize" : "Minimize"}
          >
            {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
          </button>
        </div>
      </div>
      
      {!isMinimized && (
        <>
          <div className="terminal-output" ref={outputRef}>
            {output.map((line, index) => (
              <div key={index} className="output-line">
                {line}
              </div>
            ))}
          </div>
          
          <form className="terminal-input-container" onSubmit={handleSubmit}>
            <span className="prompt">$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter command..."
              className="terminal-input"
            />
          </form>
        </>
      )}
    </div>
  )
}

export default Terminal 
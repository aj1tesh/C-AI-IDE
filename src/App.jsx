import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import Editor from './components/Editor'
import Terminal from './components/Terminal'
import AIReviewPane from './components/AIReviewPane'
import './App.css'

function App() {
  const [activeFile, setActiveFile] = useState('main.cpp')
  const [files, setFiles] = useState({
    'main.cpp': `#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> numbers = {3, 1, 4, 1, 5, 9, 2, 6};
    
    std::cout << "Original array: ";
    for (int num : numbers) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    
    std::sort(numbers.begin(), numbers.end());
    
    std::cout << "Sorted array: ";
    for (int num : numbers) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    
    return 0;
}`,
    'utils.h': `#ifndef UTILS_H
#define UTILS_H

#include <vector>
#include <string>

namespace Utils {
    std::vector<std::string> split(const std::string& str, char delimiter);
    std::string trim(const std::string& str);
    bool isNumber(const std::string& str);
}

#endif`,
    'utils.cpp': `#include "utils.h"
#include <sstream>
#include <algorithm>
#include <cctype>

namespace Utils {
    std::vector<std::string> split(const std::string& str, char delimiter) {
        std::vector<std::string> tokens;
        std::stringstream ss(str);
        std::string token;
        
        while (std::getline(ss, token, delimiter)) {
            tokens.push_back(token);
        }
        
        return tokens;
    }
    
    std::string trim(const std::string& str) {
        size_t start = str.find_first_not_of(" \\t\\n\\r");
        if (start == std::string::npos) return "";
        
        size_t end = str.find_last_not_of(" \\t\\n\\r");
        return str.substr(start, end - start + 1);
    }
    
    bool isNumber(const std::string& str) {
        return !str.empty() && std::all_of(str.begin(), str.end(), ::isdigit);
    }
}`
  })
  const [terminalOutput, setTerminalOutput] = useState(['Welcome to C++ AI IDE!', 'Type "help" for available commands.'])
  const [showTerminal, setShowTerminal] = useState(true)
  const [aiSuggestions, setAiSuggestions] = useState([
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
    }
  ])
  const [isReviewLoading, setIsReviewLoading] = useState(false)
  const [refreshReviewTrigger, setRefreshReviewTrigger] = useState(0)

  const updateFile = (filename, content) => {
    setFiles(prev => ({
      ...prev,
      [filename]: content
    }))
  }

  const addTerminalOutput = (output) => {
    setTerminalOutput(prev => [...prev, output])
  }

  const handleApplyFix = (fix, line) => {
    const currentContent = files[activeFile] || ''
    const lines = currentContent.split('\n')
    
    if (line && line > 0 && line <= lines.length) {
      // Replace the specific line with the fix
      lines[line - 1] = fix
      const newContent = lines.join('\n')
      updateFile(activeFile, newContent)
      addTerminalOutput(`✅ Applied fix at line ${line}`)
    } else {
      // If no specific line, append the fix at the end
      const newContent = currentContent + '\n' + fix
      updateFile(activeFile, newContent)
      addTerminalOutput('✅ Applied fix to the end of file')
    }
  }

  const handleRefreshReview = () => {
    // Trigger a new AI review by calling the review function
    const currentContent = files[activeFile] || ''
    if (currentContent.trim()) {
      setIsReviewLoading(true)
      setRefreshReviewTrigger(prev => prev + 1)
    } else {
      // If no content, show a message
      addTerminalOutput('⚠️ No code to review. Please add some code first.')
    }
  }

  return (
    <div className="app">
      <Sidebar 
        files={files} 
        activeFile={activeFile} 
        setActiveFile={setActiveFile}
        setFiles={setFiles}
      />
      <div className="main-content">
        <Editor 
          file={activeFile}
          content={files[activeFile] || ''}
          updateFile={updateFile}
          addTerminalOutput={addTerminalOutput}
          setAiSuggestions={setAiSuggestions}
          setIsReviewLoading={setIsReviewLoading}
          refreshReviewTrigger={refreshReviewTrigger}
        />
        {showTerminal && (
          <Terminal 
            output={terminalOutput}
            addOutput={addTerminalOutput}
          />
        )}
      </div>
      <AIReviewPane 
        suggestions={aiSuggestions}
        onApplyFix={handleApplyFix}
        onRefresh={handleRefreshReview}
        isLoading={isReviewLoading}
      />
    </div>
  )
}

export default App 
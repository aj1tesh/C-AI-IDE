import React, { useState } from 'react'
import { Folder, File, Plus, Trash2 } from 'lucide-react'
import './Sidebar.css'

const Sidebar = ({ files, activeFile, setActiveFile, setFiles }) => {
  const [newFileName, setNewFileName] = useState('')
  const [showNewFileInput, setShowNewFileInput] = useState(false)

  const handleFileClick = (filename) => {
    setActiveFile(filename)
  }

  const handleNewFile = () => {
    if (newFileName.trim()) {
      const filename = newFileName.endsWith('.cpp') || newFileName.endsWith('.h') 
        ? newFileName 
        : `${newFileName}.cpp`
      
      setFiles(prev => ({
        ...prev,
        [filename]: `#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`
      }))
      setActiveFile(filename)
      setNewFileName('')
      setShowNewFileInput(false)
    }
  }

  const handleDeleteFile = (filename) => {
    if (Object.keys(files).length > 1) {
      const newFiles = { ...files }
      delete newFiles[filename]
      setFiles(newFiles)
      
      if (activeFile === filename) {
        const remainingFiles = Object.keys(newFiles)
        setActiveFile(remainingFiles[0])
      }
    }
  }

  const getFileIcon = (filename) => {
    if (filename.endsWith('.h')) {
      return <File className="file-icon header" />
    }
    return <File className="file-icon cpp" />
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>EXPLORER</h3>
        <button 
          className="new-file-btn"
          onClick={() => setShowNewFileInput(true)}
          title="New File"
        >
          <Plus size={16} />
        </button>
      </div>
      
      {showNewFileInput && (
        <div className="new-file-input">
          <input
            type="text"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            placeholder="filename.cpp"
            onKeyPress={(e) => e.key === 'Enter' && handleNewFile()}
            autoFocus
          />
          <button onClick={handleNewFile}>Create</button>
          <button onClick={() => setShowNewFileInput(false)}>Cancel</button>
        </div>
      )}
      
      <div className="file-list">
        {Object.keys(files).map(filename => (
          <div 
            key={filename}
            className={`file-item ${activeFile === filename ? 'active' : ''}`}
            onClick={() => handleFileClick(filename)}
          >
            {getFileIcon(filename)}
            <span className="file-name">{filename}</span>
            <button 
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation()
                handleDeleteFile(filename)
              }}
              title="Delete file"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Sidebar 
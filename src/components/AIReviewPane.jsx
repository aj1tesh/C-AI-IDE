import React, { useState } from 'react'
import { MessageCircle, Lightbulb, AlertTriangle, CheckCircle, X, RefreshCw } from 'lucide-react'
import './AIReviewPane.css'

const AIReviewPane = ({ suggestions, onApplyFix, onRefresh, isLoading }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const getSuggestionIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'error':
        return <AlertTriangle size={16} className="icon error" />
      case 'warning':
        return <AlertTriangle size={16} className="icon warning" />
      case 'suggestion':
        return <Lightbulb size={16} className="icon suggestion" />
      case 'info':
        return <MessageCircle size={16} className="icon info" />
      default:
        return <CheckCircle size={16} className="icon success" />
    }
  }

  const getSuggestionClass = (type) => {
    switch (type?.toLowerCase()) {
      case 'error':
        return 'suggestion-error'
      case 'warning':
        return 'suggestion-warning'
      case 'suggestion':
        return 'suggestion-suggestion'
      case 'info':
        return 'suggestion-info'
      default:
        return 'suggestion-success'
    }
  }

  if (isCollapsed) {
    return (
      <div className="ai-review-pane collapsed">
        <button 
          className="expand-btn"
          onClick={() => setIsCollapsed(false)}
          title="Expand AI Review"
        >
          <MessageCircle size={20} />
        </button>
      </div>
    )
  }

  return (
    <div className="ai-review-pane">
      <div className="review-header">
        <div className="header-content">
          <MessageCircle size={18} />
          <span>AI Review</span>
          {suggestions.length > 0 && (
            <span className="suggestion-count">{suggestions.length}</span>
          )}
        </div>
        <div className="header-actions">
          <button 
            className="refresh-btn"
            onClick={onRefresh}
            disabled={isLoading}
            title="Refresh Review"
          >
            <RefreshCw size={16} className={isLoading ? 'spinning' : ''} />
          </button>
          <button 
            className="collapse-btn"
            onClick={() => setIsCollapsed(true)}
            title="Collapse"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="review-content">
        {isLoading ? (
          <div className="loading-state">
            <RefreshCw size={20} className="spinning" />
            <span>Analyzing code...</span>
          </div>
        ) : suggestions.length === 0 ? (
          <div className="empty-state">
            <MessageCircle size={32} />
            <p>No suggestions yet</p>
            <span>Run AI review to get suggestions</span>
          </div>
        ) : (
          <div className="suggestions-list">
            {suggestions.map((suggestion, index) => (
              <div 
                key={index} 
                className={`suggestion-card ${getSuggestionClass(suggestion.type)}`}
              >
                <div className="suggestion-header">
                  {getSuggestionIcon(suggestion.type)}
                  <span className="suggestion-type">
                    {suggestion.type || 'Suggestion'}
                  </span>
                </div>
                
                <div className="suggestion-message">
                  {suggestion.message}
                </div>
                
                {suggestion.line && (
                  <div className="suggestion-location">
                    Line {suggestion.line}
                  </div>
                )}
                
                {suggestion.fix && (
                  <div className="suggestion-fix">
                    <div className="fix-header">
                      <Lightbulb size={14} />
                      <span>Suggested Fix:</span>
                    </div>
                    <div className="fix-content">
                      <code>{suggestion.fix}</code>
                    </div>
                    <button 
                      className="apply-fix-btn"
                      onClick={() => onApplyFix(suggestion.fix, suggestion.line)}
                      title="Apply this fix"
                    >
                      Apply Fix
                    </button>
                  </div>
                )}
                
                {suggestion.explanation && (
                  <div className="suggestion-explanation">
                    <div className="explanation-header">
                      <MessageCircle size={14} />
                      <span>Explanation:</span>
                    </div>
                    <div className="explanation-content">
                      {suggestion.explanation}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AIReviewPane 
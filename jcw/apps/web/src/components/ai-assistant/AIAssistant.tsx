'use client'

import React, { useState, useRef, useEffect } from 'react'
import ContentIndexer from '@/services/contentIndexer'

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

interface AIAssistantProps {
  className?: string
}

export default function AIAssistant({ className = '' }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your Just Code Works assistant. I can help you choose the perfect website solution and answer any questions about our services. What can I help you with today?",
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Initialize content indexing on component mount
  useEffect(() => {
    const initializeContentIndex = async () => {
      try {
        const contentIndexer = ContentIndexer.getInstance()
        await contentIndexer.indexAllContent()
        console.log('AI Assistant: Content indexed successfully')
      } catch (error) {
        console.error('AI Assistant: Error indexing content:', error)
      }
    }

    initializeContentIndex()
  }, [])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      // Call AI API endpoint
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.text,
          context: window.location.pathname
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        isUser: false,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment or contact us directly for assistance.",
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleAssistant = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <style jsx>{`
        .ai-assistant-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 9999;
          font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
        }

        .ai-toggle-button {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2152ff 0%, #0a1a5e 100%);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 24px;
          box-shadow: 0 4px 20px rgba(33, 82, 255, 0.3);
          transition: all 0.3s ease;
          position: relative;
        }

        .ai-toggle-button:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 25px rgba(33, 82, 255, 0.4);
        }

        .ai-toggle-button::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 50%;
          background: linear-gradient(45deg, #2152ff, #0a1a5e, #2152ff);
          z-index: -1;
          animation: rotate 3s linear infinite;
          opacity: 0.8;
        }

        .ai-toggle-button:hover::before {
          opacity: 1;
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .ai-pulse {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { box-shadow: 0 4px 20px rgba(33, 82, 255, 0.3); }
          50% { box-shadow: 0 4px 30px rgba(33, 82, 255, 0.5); }
          100% { box-shadow: 0 4px 20px rgba(33, 82, 255, 0.3); }
        }

        .ai-chat-window {
          position: absolute;
          bottom: 80px;
          right: 0;
          width: 380px;
          height: 500px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
          border: 1px solid #e6ecff;
          display: flex;
          flex-direction: column;
          transform: translateY(20px);
          opacity: 0;
          pointer-events: none;
          transition: all 0.3s ease;
        }

        .ai-chat-window.open {
          transform: translateY(0);
          opacity: 1;
          pointer-events: all;
        }

        .ai-chat-header {
          padding: 20px;
          background: linear-gradient(135deg, #2152ff 0%, #0a1a5e 100%);
          color: white;
          border-radius: 16px 16px 0 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ai-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        .ai-chat-info h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }

        .ai-chat-info p {
          margin: 2px 0 0 0;
          font-size: 12px;
          opacity: 0.8;
        }

        .ai-messages {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .ai-message {
          max-width: 80%;
          padding: 12px 16px;
          border-radius: 18px;
          font-size: 14px;
          line-height: 1.4;
          word-wrap: break-word;
        }

        .ai-message.user {
          background: #2152ff;
          color: white;
          align-self: flex-end;
          border-bottom-right-radius: 6px;
        }

        .ai-message.assistant {
          background: #f8f9ff;
          color: #0a1a5e;
          align-self: flex-start;
          border-bottom-left-radius: 6px;
          border: 1px solid #e6ecff;
        }

        .ai-input-area {
          padding: 20px;
          border-top: 1px solid #e6ecff;
          display: flex;
          gap: 12px;
          align-items: flex-end;
        }

        .ai-input {
          flex: 1;
          border: 1px solid #e6ecff;
          border-radius: 20px;
          padding: 12px 16px;
          font-size: 14px;
          resize: none;
          outline: none;
          max-height: 100px;
          font-family: inherit;
        }

        .ai-input:focus {
          border-color: #2152ff;
          box-shadow: 0 0 0 3px rgba(33, 82, 255, 0.1);
        }

        .ai-send-button {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #2152ff;
          border: none;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .ai-send-button:hover:not(:disabled) {
          background: #1e47ff;
          transform: scale(1.05);
        }

        .ai-send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .ai-loading {
          display: flex;
          gap: 4px;
          padding: 12px 16px;
          align-self: flex-start;
        }

        .ai-loading-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #2152ff;
          animation: loading 1.4s ease-in-out infinite both;
        }

        .ai-loading-dot:nth-child(1) { animation-delay: -0.32s; }
        .ai-loading-dot:nth-child(2) { animation-delay: -0.16s; }

        @keyframes loading {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }

        @media (max-width: 480px) {
          .ai-chat-window {
            width: calc(100vw - 40px);
            height: calc(100vh - 140px);
            bottom: 80px;
            right: 20px;
            left: 20px;
          }
        }
      `}</style>

      <div className={`ai-assistant-container ${className}`}>
        {/* Chat Window */}
        <div className={`ai-chat-window ${isOpen ? 'open' : ''}`}>
          {/* Header */}
          <div className="ai-chat-header">
            <div className="ai-avatar">🤖</div>
            <div className="ai-chat-info">
              <h3>JCW Assistant</h3>
              <p>Here to help you find the perfect website</p>
            </div>
          </div>

          {/* Messages */}
          <div className="ai-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`ai-message ${message.isUser ? 'user' : 'assistant'}`}
              >
                {message.text}
              </div>
            ))}
            {isLoading && (
              <div className="ai-loading">
                <div className="ai-loading-dot"></div>
                <div className="ai-loading-dot"></div>
                <div className="ai-loading-dot"></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="ai-input-area">
            <input
              ref={inputRef}
              type="text"
              className="ai-input"
              placeholder="Ask me anything about our services..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <button
              className="ai-send-button"
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
            >
              {isLoading ? '⋯' : '→'}
            </button>
          </div>
        </div>

        {/* Toggle Button */}
        <button
          className={`ai-toggle-button ${!isOpen ? 'ai-pulse' : ''}`}
          onClick={toggleAssistant}
          aria-label="Toggle AI Assistant"
          title="AI Assistant - Ask me anything about our services!"
        >
          {isOpen ? '✕' : '🤖'}
        </button>
      </div>
    </>
  )
}
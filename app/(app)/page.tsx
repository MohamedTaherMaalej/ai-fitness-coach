'use client'

import { ThreadMessage } from 'openai/resources/beta/threads/index.mjs'
import React, { useState } from 'react'

function ChatPage() {
  const [fetching, setFetching] = useState(false)
  const [messages, setMessages] = useState<ThreadMessage[]>([])

  const fetchMessages = async () => {
    const response = await fetch('/api/messages')
    const data = await response.json()
    setMessages(data)
    setFetching(false)
  }

  return (
    <div className="w-screen h-screen flex flex-col bg-black text-white">
      <div className="flex-grow overflow-y-hidden p-8 space-y-8">
        {fetching && <div className='text-center font-blod'>Fetching...</div>}
        {messages.length === 0 && !fetching && <div className='text-center font-blod'>No messages.</div>}
      </div>
      
      
    </div>

  )
}

export default ChatPage
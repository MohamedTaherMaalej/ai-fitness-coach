'use client'

import { userThreadAtom } from '@/atoms'
import axios from 'axios'
import { useAtom } from 'jotai'
import { ThreadMessage } from 'openai/resources/beta/threads/index.mjs'
import React, { useCallback, useEffect, useState } from 'react'

const POLLING_FREQUENCY_MS = 1000

function ChatPage() {
  // Atom State
  const [userThread] = useAtom(userThreadAtom)

  // State
  const [fetching, setFetching] = useState(false)
  const [messages, setMessages] = useState<ThreadMessage[]>([])

  console.log('userThread', userThread)
  console.log('messages', messages)

  const fetchMessages = useCallback(async () => {
      if(!userThread) {
        return
      }
      setFetching(true)
      try{
        const response = await axios.post<{ success: boolean; error?: string; messages?: ThreadMessage[] }>('/api/message/list', {threadId: userThread.threadId})
  
      // Validation
      if(!response.data.success || !response.data.messages) {
        console.error(response.data.error ?? 'Unknown error')
        return
      }
  
      let newMessages = response.data.messages ?? []

      console.log('newMessages', newMessages)
  
      // Sort in descending order
      newMessages = newMessages.sort((a, b) => {return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()}).filter((message) => message.content[0].type === "text" && message.content[0].text.value.trim() !== "") 
  
      setMessages(newMessages)
      } catch (error) {
        console.error(error)
        setFetching(false)
        setMessages([])
      } finally {
        setFetching(false)
      }
    }, [userThread])


  useEffect(() => {
    const interval = setInterval(fetchMessages, POLLING_FREQUENCY_MS)
    // Clean up on unmount
    return () => clearInterval(interval)
  }
  , [fetchMessages])

  return (
    <div className="w-screen h-screen flex flex-col bg-black text-white">
      <div className="flex-grow overflow-y-hidden p-8 space-y-8">
        {fetching && messages.length === 0 && (<div className='text-center font-blod'>Fetching...</div>)}
        {messages.length === 0 && !fetching && <div className='text-center font-blod'>No messages.</div>}
        {messages.map((message) => (
          <div key={message.id}>{message.content[0].type === "text" ? message.content[0].text.value.split("\n").map((text, index) => ( <p key={index}>{text}</p>)) : null}</div>
        ))}
      </div>
      
      
    </div>

  )
}

export default ChatPage
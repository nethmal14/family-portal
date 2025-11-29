'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

interface Message {
  id: number
  user_id: string
  content: string
  created_at: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
    fetchMessages()
  }, [])

  async function fetchMessages() {
    const { data: messagesData, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching messages:', error)
      return
    }

    setMessages(messagesData || [])
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!newMessage) return

    const { data, error } = await supabase.from('messages').insert([
      {
        content: newMessage,
        user_id: (await supabase.auth.getUser()).data.user?.id || 'anonymous',
      },
    ])

    if (error) {
      console.error('Error sending message:', error)
      return
    }

    setNewMessage('')
    fetchMessages()
  }

  return (
    <div>
      <h1>Group Chat</h1>
      <ul>
        {messages.map((msg) => (
          <li key={msg.id}>
            {msg.user_id}: {msg.content}
          </li>
        ))}
      </ul>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}

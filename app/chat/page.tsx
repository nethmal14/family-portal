'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function Chat() {
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')

  useEffect(() => {
    async function fetchMessages() {
      const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: true })
      setMessages(data || [])
    }
    fetchMessages()
  }, [])

  async function sendMessage() {
    if (!input) return
    await supabase.from('messages').insert([{ text: input }])
    setInput('')
    const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: true })
    setMessages(data || [])
  }

  return (
    <div>
      <h1>Chat</h1>
      <div>
        {messages.map((msg) => (
          <p key={msg.id}>{msg.text}</p>
        ))}
      </div>
      <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message" />
      <button onClick={sendMessage}>Send</button>
    </div>
  )
}

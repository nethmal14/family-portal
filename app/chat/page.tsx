"use client"

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import Layout from '../../components/Layout'

export default function ChatPage() {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [username, setUsername] = useState('')

  useEffect(() => {
    fetchMessages()
    const interval = setInterval(fetchMessages, 3000) // refresh every 3 sec
    return () => clearInterval(interval)
  }, [])

  async function fetchMessages() {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true })
    setMessages(data || [])
  }

  async function sendMessage(e) {
    e.preventDefault()
    if (!newMessage || !username) return
    await supabase.from('messages').insert([{ username, body: newMessage }])
    setNewMessage('')
    fetchMessages()
  }

  return (
    <Layout>
      <h2>Group Chat</h2>

      <form onSubmit={sendMessage}>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Your name"
          required
        />
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Message"
          required
        />
        <button type="submit">Send</button>
      </form>

      <ul>
        {messages.map((msg) => (
          <li key={msg.id}>
            <strong>{msg.username}:</strong> {msg.body}
          </li>
        ))}
      </ul>
    </Layout>
  )
}

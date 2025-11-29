"use client"

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import Layout from '../../components/Layout'

export default function TripPlanner() {
  const [trips, setTrips] = useState([])
  const [name, setName] = useState('')

  useEffect(() => {
    fetchTrips()
  }, [])

  async function fetchTrips() {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) return console.error(error)
    setTrips(data)
  }

  async function createTrip(e) {
    e.preventDefault()
    const user = supabase.auth.user()
    const { data, error } = await supabase
      .from('trips')
      .insert([{ name, created_by: user?.id || null, participants: [user?.id || null] }])
    if (error) return console.error(error)
    setName('')
    fetchTrips()
  }

  return (
    <Layout>
      <h2>Trip Planner</h2>
      <form onSubmit={createTrip}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Trip name"
          required
        />
        <button type="submit">Create Trip</button>
      </form>

      <ul>
        {trips.map((t) => (
          <li key={t.id}>
            <a href={`/trip-planner/${t.id}`}>{t.name}</a>
          </li>
        ))}
      </ul>
    </Layout>
  )
}

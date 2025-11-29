'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function TripPlanner() {
  const [trips, setTrips] = useState<any[]>([])
  const [name, setName] = useState('')
  const [destination, setDestination] = useState('')

  useEffect(() => {
    async function fetchTrips() {
      const { data } = await supabase.from('trips').select('*').order('id', { ascending: true })
      setTrips(data || [])
    }
    fetchTrips()
  }, [])

  async function addTrip() {
    if (!name || !destination) return
    await supabase.from('trips').insert([{ name, destination }])
    setName('')
    setDestination('')
    const { data } = await supabase.from('trips').select('*').order('id', { ascending: true })
    setTrips(data || [])
  }

  return (
    <div>
      <h1>Trip Planner</h1>
      <input placeholder="Trip Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="Destination" value={destination} onChange={(e) => setDestination(e.target.value)} />
      <button onClick={addTrip}>Add Trip</button>

      <h2>Your Trips</h2>
      {trips.map((trip) => (
        <div key={trip.id}>
          <strong>{trip.name}</strong>: {trip.destination}
        </div>
      ))}
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

interface Trip {
  id: number
  user_id: string
  destination: string
  date: string
}

export default function TripPlannerPage() {
  const [trips, setTrips] = useState<Trip[]>([])

  useEffect(() => {
    fetchTrips()
  }, [])

  async function fetchTrips() {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) {
      console.error(userError)
      return
    }
    if (!user) return

    const { data: tripsData, error: tripsError } = await supabase
      .from('trips')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: true })

    if (tripsError) {
      console.error(tripsError)
      return
    }

    setTrips(tripsData || [])
  }

  return (
    <div>
      <h1>Trip Planner</h1>
      <ul>
        {trips.map(trip => (
          <li key={trip.id}>{trip.destination} — {trip.date}</li>
        ))}
      </ul>
    </div>
  )
}

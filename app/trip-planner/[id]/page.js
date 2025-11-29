"use client"

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import Layout from '../../../components/Layout'

export default function TripDetail({ params }) {
  const { id } = params
  const [trip, setTrip] = useState(null)
  const [destinations, setDestinations] = useState([])
  const [newDest, setNewDest] = useState('')
  const [distances, setDistances] = useState([])

  useEffect(() => {
    if (!id) return
    fetchTrip()
  }, [id])

  async function fetchTrip() {
    const { data: t } = await supabase.from('trips').select('*').eq('id', id).single()
    setTrip(t)
    const { data: d } = await supabase
      .from('destinations')
      .select('*')
      .eq('trip_id', id)
      .order('position')
    setDestinations(d || [])
  }

  async function addDestination(e) {
    e.preventDefault()
    await supabase.from('destinations').insert([{ trip_id: id, place_name: newDest }])
    setNewDest('')
    fetchTrip()
  }

  // Haversine formula
  function getDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  function checkDistances() {
    if (!navigator.geolocation) return alert('Geolocation not available')
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords
      const results = destinations.map((d) => {
        // For now we use fake coordinates for testing (replace with real lat/lng)
        const destLat = latitude + 0.01
        const destLng = longitude + 0.01
        return { name: d.place_name, distance: getDistanceKm(latitude, longitude, destLat, destLng).toFixed(1) }
      })
      setDistances(results)
    })
  }

  return (
    <Layout>
      <h2>{trip?.name}</h2>
      <form onSubmit={addDestination}>
        <input
          value={newDest}
          onChange={(e) => setNewDest(e.target.value)}
          placeholder="Add destination"
          required
        />
        <button type="submit">Add</button>
      </form>

      <ul>
        {destinations.map((d) => (
          <li key={d.id}>{d.place_name}</li>
        ))}
      </ul>

      <button onClick={checkDistances}>Check Distance from Current Location</button>

      <ul>
        {distances.map((d, i) => (
          <li key={i}>
            {d.name}: {d.distance} km away
          </li>
        ))}
      </ul>
    </Layout>
  )
}

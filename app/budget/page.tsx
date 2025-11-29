'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function Budget() {
  const [budget, setBudget] = useState<any[]>([])
  const [item, setItem] = useState('')
  const [amount, setAmount] = useState('')

  useEffect(() => {
    async function fetchBudget() {
      const { data } = await supabase.from('budgets').select('*').order('id', { ascending: true })
      setBudget(data || [])
    }
    fetchBudget()
  }, [])

  async function addBudget() {
    if (!item || !amount) return
    await supabase.from('budgets').insert([{ item, amount: Number(amount) }])
    setItem('')
    setAmount('')
    const { data } = await supabase.from('budgets').select('*').order('id', { ascending: true })
    setBudget(data || [])
  }

  return (
    <div>
      <h1>Budget</h1>
      <input placeholder="Item" value={item} onChange={(e) => setItem(e.target.value)} />
      <input placeholder="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <button onClick={addBudget}>Add</button>

      <h2>Your Budget</h2>
      {budget.map((b) => (
        <div key={b.id}>
          {b.item}: ${b.amount}
        </div>
      ))}
    </div>
  )
}

"use client"

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import Layout from '../../components/Layout'

export default function BudgetPage() {
  const [budgetId, setBudgetId] = useState(null)
  const [entries, setEntries] = useState([])
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('expense')
  const [note, setNote] = useState('')

  useEffect(() => {
    fetchBudget()
  }, [])

  async function fetchBudget() {
    const user = supabase.auth.user()
    if (!user) return
    const { data: budget } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', user.id)
      .single()
    if (budget) {
      setBudgetId(budget.id)
      fetchEntries(budget.id)
    } else {
      const { data: newBudget } = await supabase
        .from('budgets')
        .insert([{ user_id: user.id }])
        .select()
        .single()
      setBudgetId(newBudget.id)
      setEntries([])
    }
  }

  async function fetchEntries(id) {
    const { data } = await supabase
      .from('budget_entries')
      .select('*')
      .eq('budget_id', id)
      .order('created_at', { ascending: false })
    setEntries(data || [])
  }

  async function addEntry(e) {
    e.preventDefault()
    if (!budgetId) return
    await supabase
      .from('budget_entries')
      .insert([{ budget_id: budgetId, amount, entry_type: type, note }])
    setAmount('')
    setNote('')
    fetchEntries(budgetId)
  }

  return (
    <Layout>
      <h2>Budget Tracker</h2>

      <form onSubmit={addEntry}>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          required
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Note"
        />
        <button type="submit">Add Entry</button>
      </form>

      <ul>
        {entries.map((entry) => (
          <li key={entry.id}>
            {entry.entry_type}: {entry.amount} ({entry.note})
          </li>
        ))}
      </ul>
    </Layout>
  )
}

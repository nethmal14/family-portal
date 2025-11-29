'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

interface BudgetItem {
  id: number
  user_id: string
  description: string
  amount: number
}

export default function BudgetPage() {
  const [budget, setBudget] = useState<BudgetItem[]>([])

  useEffect(() => {
    fetchBudget()
  }, [])

  async function fetchBudget() {
    // v2 way to get the user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) {
      console.error('Error fetching user:', userError)
      return
    }
    if (!user) return

    // fetch budgets for this user
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', user.id)

    if (error) {
      console.error('Error fetching budget:', error)
      return
    }

    setBudget(data || [])
  }

  return (
    <div>
      <h1>Your Budget</h1>
      <ul>
        {budget.map((item) => (
          <li key={item.id}>
            {item.description}: ${item.amount}
          </li>
        ))}
      </ul>
    </div>
  )
}

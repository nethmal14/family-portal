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
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) {
      console.error(userError)
      return
    }
    if (!user) return

    const { data: budgetData, error: budgetError } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', user.id)

    if (budgetError) {
      console.error(budgetError)
      return
    }

    setBudget(budgetData || [])
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

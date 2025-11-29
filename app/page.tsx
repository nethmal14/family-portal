import Link from 'next/link'

export default function HomePage() {
  return (
    <div>
      <h1>Welcome to Family Portal</h1>
      <ul>
        <li><Link href="/trip-planner">Trip Planner</Link></li>
        <li><Link href="/budget">Budget Tracker</Link></li>
        <li><Link href="/chat">Group Chat</Link></li>
      </ul>
    </div>
  )
}

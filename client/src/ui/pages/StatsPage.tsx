import { useEffect, useMemo, useState } from 'react'
import { api } from '../../api'
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  ScatterChart, Scatter, LineChart, Line, Legend } from 'recharts'

type Weekly = {
  perDayUser: Record<string, Record<number, number>>
  perGameUser: Record<string, Record<number, number>>
  leaderboard: Record<number, number>
}

export default function StatsPage(){
  const [data, setData] = useState<Weekly | null>(null)
  useEffect(()=>{ (async()=> setData(await api('/api/stats/weekly')))() },[])

  const barData = useMemo(()=>{
    // amount of minutes per day (sum over users)
    if (!data) return []
    return Object.entries(data.perDayUser).map(([day, userMap]) => ({
      day, minutes: Object.values(userMap).reduce((a,b)=>a+b,0)
    }))
  }, [data])

  const scatterData = useMemo(()=>{
    // each dot: one user aggregated minutes for a game in last 7 days
    if (!data) return []
    const out: { game: string, x: number, y: number }[] = []
    Object.entries(data.perGameUser).forEach(([game, byUser]) => {
      Object.entries(byUser).forEach(([userId, minutes]) => {
        out.push({ game, x: Number(userId), y: minutes })
      })
    })
    return out
  }, [data])

  const lineData = useMemo(()=>{
    // per day per user series — but we flatten to per-day totals per "user 1..N"
    if (!data) return []
    const days = Object.keys(data.perDayUser).sort()
    const users = new Set<number>()
    Object.values(data.perDayUser).forEach(m => Object.keys(m).forEach(u => users.add(Number(u))))
    return days.map(d => {
      const entry: { day: string; [key: string]: number | string } = { day: d }
      users.forEach(u => { entry['u'+u] = data.perDayUser[d]?.[u] ?? 0 })
      return entry
    })
  }, [data])

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Game Statistics</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card">
          <div className="mb-2 font-medium">Bar: Minutes per day</div>
          <BarChart width={350} height={250} data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="minutes" />
          </BarChart>
        </div>

        <div className="card">
          <div className="mb-2 font-medium">Dots: Users per game (last 7 days)</div>
          <ScatterChart width={350} height={250}>
            <CartesianGrid />
            <XAxis dataKey="x" name="UserId" />
            <YAxis dataKey="y" name="Minutes" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter data={scatterData} name="Users" />
          </ScatterChart>
        </div>

        <div className="card">
          <div className="mb-2 font-medium">Lines: Minutes per user per day</div>
          <LineChart width={350} height={250} data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            {lineData.length>0 && Object.keys(lineData[0]).filter(k=>k!=='day').map((k,i)=>(
              <Line key={k} type="monotone" dataKey={k} dot={false} />
            ))}
          </LineChart>
        </div>
      </div>

      <div className="card">
        <div className="mb-2 font-medium">Leaderboard (last 4 weeks)</div>
        <table className="w-full">
          <thead><tr><th className="text-left">User ID</th><th className="text-left">Minutes played</th></tr></thead>
          <tbody>
            {data && Object.entries(data.leaderboard).sort((a,b)=>b[1]-a[1]).map(([uid, mins]) => (
              <tr key={uid}><td>#{uid}</td><td>{mins}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
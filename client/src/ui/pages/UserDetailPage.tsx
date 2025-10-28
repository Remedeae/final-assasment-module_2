
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, Game, User } from '../../api'
import React from 'react';

export default function UserDetailPage(){
  const { id } = useParams()
  const [user, setUser] = useState<User | null>(null)
  const [games, setGames] = useState<Game[]>([])
  const [stats, setStats] = useState<{total:number, byGame:{gameId:number, minutes:number}[]} | null>(null)

  useEffect(()=>{ (async()=>{
    const u = await api<User>(`/api/users/${id}`); setUser(u)
    const g = await api<Game[]>(`/api/games`); setGames(g)
    const s = await api<{total:number, byGame:{gameId:number, minutes:number}[]}>(`/api/stats/user/${id}`); setStats(s)
  })() },[id])

  const byGameMap = useMemo(()=>{
    const m = new Map<number, number>()
    stats?.byGame.forEach(x=>m.set(x.gameId, x.minutes))
    return m
  }, [stats])

  const total = stats?.total ?? 0

  return (
    <div className="space-y-4">
      {user && (
        <div className="card flex items-center gap-4">
          <img className="w-20 h-20 rounded-full object-cover" src={user.profilePic || '/uploads/dummy.png'} />
          <div>
            <div className="text-xl font-semibold">{user.firstName} {user.lastName}</div>
            <div className="text-slate-600">{user.email}</div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-4 gap-4">
        {games.map(g => (
          <div key={g.id} className="card">
            <div className="font-medium">{g.name}</div>
            <div className="text-2xl">{byGameMap.get(g.id) ?? 0} min</div>
          </div>
        ))}
      </div>
      <div className="card">Total time played: <strong>{total} minutes</strong></div>
      <div className="flex gap-2">
        <Link className="btn" to="/users">Choose new player</Link>
        {user && <Link className="btn" to={`/choose?userId=${user.id}`}>Play new Game</Link>}
      </div>
    </div>
  )
}

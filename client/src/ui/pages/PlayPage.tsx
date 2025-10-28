
import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../../api'

export default function PlayPage(){
  const { userId, gameId } = useParams()
  const nav = useNavigate()
  const [sessionId, setSessionId] = useState<number | null>(null)
  const [seconds, setSeconds] = useState(0)
  const timerRef = useRef<number | null>(null)

  useEffect(()=>{ (async()=>{
    const s = await api<{id:number}>(`/api/sessions/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: Number(userId), gameId: Number(gameId) })
    })
    setSessionId(s.id)
    timerRef.current = window.setInterval(()=>setSeconds(x=>x+1), 1000)
  })(); return ()=>{ if (timerRef.current) window.clearInterval(timerRef.current) } }, [userId, gameId])

  async function stop(){
    if (!sessionId) return
    if (timerRef.current) window.clearInterval(timerRef.current)
    await api(`/api/sessions/stop/${sessionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ simulate: true })
    })
    nav(`/users/${userId}`)
  }

  const mm = String(Math.floor(seconds/60)).padStart(2,'0')
  const ss = String(seconds%60).padStart(2,'0')

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Game Timer</h2>
      <div className="card text-3xl font-mono">TIME PLAYING: 00:{mm}:{ss}</div>
      <button className="btn" onClick={stop}>STOP</button>
      <div className="text-sm text-slate-600">Every second counts as a minute.</div>
    </div>
  )
}

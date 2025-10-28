
import { useEffect, useState } from 'react'

export default function Weather(){
  const [text, setText] = useState('Loading weather...')
  useEffect(() => {
    async function load(){
      try {
        // Stockholm coords as a default example
        const url = 'https://api.open-meteo.com/v1/forecast?latitude=59.3293&longitude=18.0686&current_weather=true'
        const res = await fetch(url)
        const data = await res.json()
        const t = Math.round(data.current_weather.temperature)
        const dateStr = new Date().toLocaleDateString(undefined, { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric'})
        setText(`${dateStr} · ${t} °C`)
      } catch {
        setText('Weather unavailable')
      }
    }
    load()
  }, [])
  return <div className="text-sm text-slate-600">{text}</div>
}

import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {api} from '../../api'
import React from 'react';


interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  profilePic?: string | null
}

export default function UsersPage(){
  const [q, setQ] = useState('')
  const [index, setIndex] = useState(0)     // which user (0-based)
  const pageSize = 1                        // show ONE user per "page"
  const [total, setTotal] = useState(0)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const data = await api<{items: User[]; total: number}>(
      `/api/users?q=${encodeURIComponent(q)}&page=${index + 1}&pageSize=${pageSize}`
      // ^^^^^^^^^^ NOTE camelCase pageSize (was 'pagesize')
    )
    setUser(data.items[0] ?? null)
    setTotal(data.total ?? 0)
    setLoading(false)
  }, [q, index])

  useEffect(() => { load() }, [load])

  function onSearch(v: string){
    setQ(v)
    setIndex(0)
  }
  function prev(){ if (index > 0) setIndex(i => i - 1) }
  function next(){ if ((index + 1) < total) setIndex(i => i + 1) }

  return (
    <div className="space-y-4 max-w-xl">
      <div className="flex gap-2">
        <input
          className="input flex-1"
          placeholder="Search users..."
          value={q}
          onChange={e => onSearch(e.target.value)}
        />
        <Link className="btn" to="/">Add User</Link>
      </div>

      <div className="flex items-center justify-between">
        <button className="btn" onClick={prev} disabled={index === 0}>◀</button>
        <div className="text-sm text-slate-600">
          {total === 0 ? 'No users' : `User ${index + 1} of ${total}`}
        </div>
        <button className="btn" onClick={next} disabled={(index + 1) >= total}>▶</button>
      </div>

      <div className="card flex items-center gap-4 justify-between min-h-[120px]">
        {loading && <div className="text-slate-500">Loading...</div>}
        {!loading && !user && <div className="text-slate-500">No matching users</div>}
        {!loading && user && (
          <>
            <div className="flex items-center gap-4">
              <img className="w-20 h-20 rounded-full object-cover" src={user.profilePic || '/uploads/dummy.png'} />
              <div>
                <div className="text-lg font-semibold">{user.firstName} {user.lastName}</div>
                <div className="text-slate-600">{user.email}</div>
              </div>
            </div>
            <Link className="btn" to={`/users/${user.id}`}>Open</Link>
          </>
        )}
      </div>
    </div>
  )
}

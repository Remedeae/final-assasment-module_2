import { FormEvent, useState } from 'react'
import { api, User } from '../../api'
import styles from './ProfilePage.module.css'
import React from 'react';



export default function ProfilePage(){
  const [email, setEmail] = useState('')
  const [firstName, setFirst] = useState('')
  const [lastName, setLast] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [created, setCreated] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function submit(e: FormEvent){
    e.preventDefault()
    setError(null)
    const form = new FormData()
    form.append('email', email)
    form.append('firstName', firstName)
    form.append('lastName', lastName)
    if (file) form.append('profilePic', file)
    try {
      const user = await api<User>('/api/users', { method: 'POST', body: form })
      setCreated(user)
      setEmail(''); setFirst(''); setLast(''); setFile(null)
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message || 'Failed to register user')
      } else {
        setError('Failed to register user')
      }
    }
  }

  return (
    <div className={styles.center}>
      <div className={styles.box}>
        <h2 className={styles.title}>Welcome</h2>

        <form onSubmit={submit} className="grid gap-3 px-4">
          <div>
            <label className="label">Email address *</label>
            <input
              className={`input ${styles.field}`}
              required type="email"
              value={email}
              onChange={e=>setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">First Name *</label>
              <input
                className={`input ${styles.field}`}
                required value={firstName}
                onChange={e=>setFirst(e.target.value)}
                placeholder="Jane"
              />
            </div>
            <div>
              <label className="label">Last Name *</label>
              <input
                className={`input ${styles.field}`}
                required value={lastName}
                onChange={e=>setLast(e.target.value)}
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label className="label">Profile Picture</label>
            <input
              className={`input ${styles.field}`}
              type="file"
              accept="image/*"
              onChange={e=>setFile(e.target.files?.[0] ?? null)}
            />
          </div>

          <div className={styles.buttonBox}>
            <button className="btn w-full">REGISTER</button>
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        </form>

        {created && (
          <div className="grid gap-2 px-4 pb-4">
            <div className="card flex items-center gap-3 bg-[#1e1e1e] text-white">
              <img className="w-16 h-16 rounded-full object-cover" src={created.profilePic || '/uploads/dummy.png'} />
              <div>
                <div className="font-medium">{created.firstName} {created.lastName}</div>
                <div className="text-sm opacity-80">{created.email}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

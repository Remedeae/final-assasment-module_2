// client/src/ui/App.tsx
import { NavLink, Route, Routes } from 'react-router-dom'
import ProfilePage from './pages/ProfilePage'
import UsersPage from './pages/UsersPage'
import UserDetailPage from './pages/UserDetailPage'
import ChooseGamePage from './pages/ChooseGamePage'
import PlayPage from './pages/PlayPage'
import StatsPage from './pages/StatsPage'
import Weather from './components/Weather'
import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-4 flex flex-col sticky top-0 h-screen">
        {/* Title with emoji */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-5xl leading-none">🎮</span>
          <h1 className="text-4xl font-extrabold tracking-tight text-purple-700">GameOn!</h1>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          <NavLink className="sidebar-item" to="/">Profile</NavLink>
          <NavLink className="sidebar-item" to="/users">All Users</NavLink>
          <NavLink className="sidebar-item" to="/choose">Choose Game</NavLink>
          <NavLink className="sidebar-item" to="/stats">Statistics</NavLink>
        </nav>

        {/* Weather pinned bottom */}
        <div className="mt-auto pt-4 border-t">
          <Weather />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 space-y-4 overflow-y-auto">
        <Routes>
          <Route path="/" element={<ProfilePage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/users/:id" element={<UserDetailPage />} />
          <Route path="/choose" element={<ChooseGamePage />} />
          <Route path="/play/:userId/:gameId" element={<PlayPage />} />
          <Route path="/stats" element={<StatsPage />} />
        </Routes>
      </main>
    </div>
  )
}

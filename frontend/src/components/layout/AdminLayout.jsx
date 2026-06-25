import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, User, Briefcase, GraduationCap, Code2, 
  FolderOpen, Award, MessageSquare, Link2, Search, 
  LogOut, Menu, X, ChevronRight, Settings
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { toast } from 'sonner'

const navItems = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Profile', to: '/admin/profile', icon: User },
  { label: 'Experiences', to: '/admin/experiences', icon: Briefcase },
  { label: 'Education', to: '/admin/education', icon: GraduationCap },
  { label: 'Skills', to: '/admin/skills', icon: Code2 },
  { label: 'Projects', to: '/admin/projects', icon: FolderOpen },
  { label: 'Certifications', to: '/admin/certifications', icon: Award },
  { label: 'Messages', to: '/admin/messages', icon: MessageSquare },
  { label: 'Social Links', to: '/admin/social-links', icon: Link2 },
  { label: 'SEO', to: '/admin/seo', icon: Search },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
    toast.success('Logged out successfully')
  }

  return (
    <div className="min-h-screen bg-bg-primary flex">
      {/* Sidebar */}
      <aside className={`${
        sidebarOpen ? 'w-64' : 'w-16'
      } transition-all duration-300 bg-bg-secondary border-r border-border-color flex flex-col shrink-0`}>
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border-color">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-accent rounded-lg flex items-center justify-center">
                <Code2 size={14} className="text-white" />
              </div>
              <span className="font-semibold text-text-primary text-sm">Admin Panel</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="btn-ghost p-1.5 ml-auto"
          >
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              title={!sidebarOpen ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-accent/20 text-accent-light border border-accent/30'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                }`
              }
            >
              <item.icon size={16} className="shrink-0" />
              {sidebarOpen && (
                <>
                  <span className="flex-1">{item.label}</span>
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-50 transition-opacity" />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="p-3 border-t border-border-color space-y-1">
          {sidebarOpen && user && (
            <div className="px-3 py-2 mb-1">
              <p className="text-xs text-text-muted">Signed in as</p>
              <p className="text-sm text-text-secondary font-medium truncate">{user.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            title={!sidebarOpen ? 'Logout' : undefined}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
          >
            <LogOut size={16} className="shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

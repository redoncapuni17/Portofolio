import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FolderOpen, Code2, Briefcase, Award, MessageSquare,
  GraduationCap, Star, Mail, ArrowRight, TrendingUp
} from 'lucide-react'
import {
  RadialBarChart, RadialBar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts'
import api from '../../lib/api'
import { useAuth } from '../../hooks/useAuth'

const StatCard = ({ icon: Icon, label, value, to, color = 'accent', extra }) => (
  <Link to={to} className="card group flex items-start gap-4 hover:scale-[1.01] transition-transform">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
      color === 'accent' ? 'bg-accent/15 text-accent-light' :
      color === 'green' ? 'bg-emerald-500/15 text-emerald-400' :
      color === 'blue' ? 'bg-blue-500/15 text-blue-400' :
      color === 'amber' ? 'bg-amber-500/15 text-amber-400' :
      'bg-purple-500/15 text-purple-400'
    }`}>
      <Icon size={22} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-text-muted text-xs mb-0.5">{label}</p>
      <p className="text-3xl font-bold text-text-primary">{value ?? '—'}</p>
      {extra && <p className="text-xs text-text-muted mt-1">{extra}</p>}
    </div>
    <ArrowRight size={16} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
  </Link>
)

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface border border-border-color rounded-lg px-3 py-2 text-sm">
        <p className="text-text-secondary">{label}</p>
        <p className="text-accent-light font-semibold">{payload[0].value}</p>
      </div>
    )
  }
  return null
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    api.get('/dashboard/stats').then(r => setStats(r.data)).catch(() => {})
  }, [])

  const chartData = stats ? [
    { name: 'Projects', value: stats.projects, fill: '#7c3aed' },
    { name: 'Skills', value: stats.skills, fill: '#8b5cf6' },
    { name: 'Experience', value: stats.experiences, fill: '#6d28d9' },
    { name: 'Certs', value: stats.certifications, fill: '#a78bfa' },
  ] : []

  const barData = stats ? [
    { name: 'Projects', count: stats.projects },
    { name: 'Skills', count: stats.skills },
    { name: 'Experiences', count: stats.experiences },
    { name: 'Certifications', count: stats.certifications },
    { name: 'Education', count: stats.education },
    { name: 'Messages', count: stats.messages },
  ] : []

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-text-secondary text-sm mt-1">
          Welcome back, <span className="text-accent-light">{user?.full_name || user?.email}</span>
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: FolderOpen, label: 'Total Projects', value: stats?.projects, to: '/admin/projects', color: 'accent', extra: `${stats?.featured_projects || 0} featured` },
          { icon: Code2, label: 'Skills', value: stats?.skills, to: '/admin/skills', color: 'blue' },
          { icon: Briefcase, label: 'Experiences', value: stats?.experiences, to: '/admin/experiences', color: 'purple' },
          { icon: Award, label: 'Certifications', value: stats?.certifications, to: '/admin/certifications', color: 'amber' },
        ].map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <StatCard {...card} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { icon: GraduationCap, label: 'Education', value: stats?.education, to: '/admin/education', color: 'green' },
          { icon: MessageSquare, label: 'Messages', value: stats?.messages, to: '/admin/messages', color: 'accent', extra: `${stats?.unread_messages || 0} unread` },
          { icon: Star, label: 'Featured Projects', value: stats?.featured_projects, to: '/admin/projects', color: 'amber' },
          { icon: Mail, label: 'Unread Messages', value: stats?.unread_messages, to: '/admin/messages', color: 'blue' },
        ].map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 + i * 0.08 }}>
            <StatCard {...card} />
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={18} className="text-accent-light" />
            <h3 className="font-semibold text-text-primary">Content Overview</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2f" />
              <XAxis dataKey="name" tick={{ fill: '#71717a', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#71717a', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(124,58,237,0.08)' }} />
              <Bar dataKey="count" fill="#7c3aed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Radial Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="card">
          <div className="flex items-center gap-2 mb-6">
            <Award size={18} className="text-accent-light" />
            <h3 className="font-semibold text-text-primary">Portfolio Breakdown</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <RadialBarChart innerRadius={30} outerRadius={90} data={chartData} startAngle={90} endAngle={-270}>
              <RadialBar dataKey="value" cornerRadius={4} background={{ fill: '#2a2a2f' }} />
              <Tooltip content={<CustomTooltip />} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {chartData.map(item => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs text-text-muted">
                <span className="w-2 h-2 rounded-full" style={{ background: item.fill }} />
                {item.name}: {item.value}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Links */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="mt-6 card">
        <h3 className="font-semibold text-text-primary mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'Add Project', to: '/admin/projects' },
            { label: 'Add Skill', to: '/admin/skills' },
            { label: 'View Messages', to: '/admin/messages' },
            { label: 'Edit Profile', to: '/admin/profile' },
            { label: 'Update SEO', to: '/admin/seo' },
          ].map(link => (
            <Link key={link.label} to={link.to} className="btn-secondary text-sm">
              {link.label}
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

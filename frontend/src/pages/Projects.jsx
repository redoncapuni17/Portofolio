import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FolderOpen, Github, ExternalLink, Search, Filter, Star } from 'lucide-react'
import api from '../lib/api'

const STATUS_OPTIONS = ['all', 'completed', 'in-progress', 'archived']

export default function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [showFeatured, setShowFeatured] = useState(false)

  const fetchProjects = () => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (status !== 'all') params.set('status', status)
    if (showFeatured) params.set('featured', 'true')
    api.get(`/projects/?${params}`).then(r => setProjects(r.data.projects || [])).finally(() => setLoading(false))
  }

  useEffect(() => { fetchProjects() }, [search, status, showFeatured])

  const statusBadge = (s) => {
    const map = {
      completed: 'badge-green',
      'in-progress': 'badge-blue',
      archived: 'badge text-text-muted bg-surface-hover border-border-color',
    }
    return map[s] || 'badge-purple'
  }

  return (
    <div className="section-container py-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <p className="text-accent-light text-sm font-medium mb-2 font-mono">// portfolio</p>
        <h1 className="section-title">Projects</h1>
        <p className="section-subtitle">Things I've built, experiments I've run</p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>
        <div className="flex gap-2">
          {STATUS_OPTIONS.map(s => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize ${
                status === s
                  ? 'bg-accent text-white'
                  : 'bg-surface border border-border-color text-text-secondary hover:text-text-primary'
              }`}
            >
              {s}
            </button>
          ))}
          <button
            onClick={() => setShowFeatured(!showFeatured)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
              showFeatured
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-surface border border-border-color text-text-secondary hover:text-text-primary'
            }`}
          >
            <Star size={14} />
            Featured
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-64 shimmer rounded-xl" />)}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16 text-text-muted">
          <FolderOpen size={40} className="mx-auto mb-4 opacity-30" />
          <p>No projects found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="card group flex flex-col"
            >
              {project.image && (
                <div className="w-full h-44 rounded-lg overflow-hidden mb-4 bg-surface-hover shrink-0">
                  <img src={project.image} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}

              <div className="flex items-start justify-between mb-2 gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-text-primary">{project.name}</h3>
                  {project.is_featured && <Star size={14} className="text-amber-400 fill-amber-400 shrink-0" />}
                </div>
                <span className={`${statusBadge(project.status)} shrink-0`}>{project.status}</span>
              </div>

              <p className="text-text-secondary text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                {project.short_description || project.description}
              </p>

              {project.technologies && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.technologies.split(',').slice(0, 5).map(t => (
                    <span key={t.trim()} className="badge-purple">{t.trim()}</span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-3 pt-4 border-t border-border-color">
                {project.github_url && (
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-1.5 text-text-secondary hover:text-text-primary text-xs transition-colors">
                    <Github size={14} /> Source
                  </a>
                )}
                {project.live_url && (
                  <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-1.5 text-text-secondary hover:text-accent-light text-xs transition-colors ml-auto">
                    <ExternalLink size={14} /> Live Demo
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

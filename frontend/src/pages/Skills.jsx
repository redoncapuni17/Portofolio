import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Code2 } from 'lucide-react'
import api from '../lib/api'

const categoryColors = {
  Backend: 'from-purple-500 to-violet-600',
  Frontend: 'from-blue-500 to-cyan-500',
  DevOps: 'from-orange-500 to-amber-500',
  Databases: 'from-green-500 to-emerald-500',
  Mobile: 'from-pink-500 to-rose-500',
  Other: 'from-gray-500 to-slate-500',
}

function SkillBar({ skill, inView }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-text-primary text-sm font-medium">{skill.name}</span>
        <span className="text-text-muted text-xs font-mono">{skill.proficiency}%</span>
      </div>
      <div className="h-1.5 bg-surface-hover rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-accent to-accent-light rounded-full"
          initial={{ width: 0 }}
          animate={inView ? { width: `${skill.proficiency}%` } : { width: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        />
      </div>
    </div>
  )
}

export default function SkillsPage() {
  const [grouped, setGrouped] = useState({})
  const [loading, setLoading] = useState(true)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    api.get('/skills/').then(r => {
      setGrouped(r.data.grouped || {})
    }).finally(() => setLoading(false))
    const t = setTimeout(() => setInView(true), 300)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="section-container py-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
        <p className="text-accent-light text-sm font-medium mb-2 font-mono">// technologies</p>
        <h1 className="section-title">Skills & Expertise</h1>
        <p className="section-subtitle">Technologies I work with and my proficiency levels</p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1,2,3,4].map(i => <div key={i} className="h-48 shimmer rounded-xl" />)}
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="text-center py-16 text-text-muted">
          <Code2 size={40} className="mx-auto mb-4 opacity-30" />
          <p>No skills added yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.entries(grouped).map(([category, skills], catIdx) => {
            const gradient = categoryColors[category] || categoryColors.Other
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: catIdx * 0.1 }}
                className="card"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-2.5 h-8 rounded-full bg-gradient-to-b ${gradient}`} />
                  <h3 className="text-lg font-semibold text-text-primary">{category}</h3>
                  <span className="ml-auto text-xs text-text-muted">{skills.length} skills</span>
                </div>
                <div className="space-y-4">
                  {skills.map(skill => (
                    <SkillBar key={skill.id} skill={skill} inView={inView} />
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

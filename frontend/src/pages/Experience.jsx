import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Briefcase, ExternalLink, Calendar } from 'lucide-react'
import api from '../lib/api'

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/experiences/').then(r => setExperiences(r.data)).finally(() => setLoading(false))
  }, [])

  const formatDate = (d) => {
    if (!d) return 'Present'
    return new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  return (
    <div className="section-container py-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
        <p className="text-accent-light text-sm font-medium mb-2 font-mono">// career</p>
        <h1 className="section-title">Work Experience</h1>
        <p className="section-subtitle">My professional journey and the companies I've worked with</p>
      </motion.div>

      {loading ? (
        <div className="space-y-6">
          {[1,2,3].map(i => <div key={i} className="h-40 shimmer rounded-xl" />)}
        </div>
      ) : experiences.length === 0 ? (
        <div className="text-center py-16 text-text-muted">
          <Briefcase size={40} className="mx-auto mb-4 opacity-30" />
          <p>No experience added yet.</p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-accent via-accent/30 to-transparent hidden md:block" />

          <div className="space-y-8">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative md:pl-16"
              >
                {/* Timeline dot */}
                <div className="hidden md:flex absolute left-0 top-6 w-12 h-12 bg-bg-secondary border-2 border-accent/50 rounded-full items-center justify-center">
                  <Briefcase size={18} className="text-accent-light" />
                </div>

                <div className="card hover:border-accent/40">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary">{exp.position}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-accent-light font-medium">{exp.company_name}</span>
                        {exp.company_website && (
                          <a href={exp.company_website} target="_blank" rel="noopener noreferrer"
                             className="text-text-muted hover:text-text-primary transition-colors">
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-text-muted text-sm whitespace-nowrap">
                      <Calendar size={14} />
                      <span>{formatDate(exp.start_date)} — {exp.is_current ? 'Present' : formatDate(exp.end_date)}</span>
                      {exp.is_current && (
                        <span className="badge-green ml-1">Current</span>
                      )}
                    </div>
                  </div>

                  {exp.description && (
                    <p className="text-text-secondary text-sm leading-relaxed mb-4 whitespace-pre-line">
                      {exp.description}
                    </p>
                  )}

                  {exp.technologies && (
                    <div className="flex flex-wrap gap-1.5">
                      {exp.technologies.split(',').map(t => (
                        <span key={t.trim()} className="badge-purple">{t.trim()}</span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

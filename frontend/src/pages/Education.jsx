import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { GraduationCap, Calendar } from 'lucide-react'
import api from '../lib/api'

export default function EducationPage() {
  const [education, setEducation] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/education/').then(r => setEducation(r.data)).finally(() => setLoading(false))
  }, [])

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'

  return (
    <div className="section-container py-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
        <p className="text-accent-light text-sm font-medium mb-2 font-mono">// background</p>
        <h1 className="section-title">Education</h1>
        <p className="section-subtitle">My academic journey and qualifications</p>
      </motion.div>

      {loading ? (
        <div className="space-y-6">{[1,2].map(i => <div key={i} className="h-40 shimmer rounded-xl" />)}</div>
      ) : education.length === 0 ? (
        <div className="text-center py-16 text-text-muted">
          <GraduationCap size={40} className="mx-auto mb-4 opacity-30" />
          <p>No education added yet.</p>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-accent via-accent/30 to-transparent hidden md:block" />
          <div className="space-y-8">
            {education.map((edu, i) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative md:pl-16"
              >
                <div className="hidden md:flex absolute left-0 top-6 w-12 h-12 bg-bg-secondary border-2 border-accent/50 rounded-full items-center justify-center">
                  <GraduationCap size={18} className="text-accent-light" />
                </div>
                <div className="card">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary">{edu.degree}</h3>
                      {edu.field_of_study && (
                        <p className="text-accent-light font-medium text-sm">{edu.field_of_study}</p>
                      )}
                      <p className="text-text-secondary text-sm mt-1">{edu.institution_name}</p>
                    </div>
                    <div className="flex items-center gap-2 text-text-muted text-sm whitespace-nowrap">
                      <Calendar size={14} />
                      <span>{formatDate(edu.start_date)} — {formatDate(edu.end_date)}</span>
                    </div>
                  </div>
                  {edu.description && (
                    <p className="text-text-secondary text-sm leading-relaxed">{edu.description}</p>
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

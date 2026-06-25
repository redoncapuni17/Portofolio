import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Mail, Phone, Calendar, Languages, Briefcase, CheckCircle } from 'lucide-react'
import api from '../lib/api'

export default function AboutPage() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/profile/').then(r => setProfile(r.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="section-container py-24">
      <div className="h-8 shimmer rounded w-48 mb-12" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          {[1,2,3,4].map(i => <div key={i} className="h-4 shimmer rounded" />)}
        </div>
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-16 shimmer rounded" />)}
        </div>
      </div>
    </div>
  )

  const highlights = [
    { icon: Briefcase, label: 'Years of Experience', value: profile?.years_of_experience ? `${profile.years_of_experience}+ years` : 'N/A' },
    { icon: MapPin, label: 'Location', value: profile?.address || profile?.location || 'N/A' },
    { icon: Languages, label: 'Languages', value: profile?.languages || 'English' },
    { icon: Calendar, label: 'Current Role', value: profile?.current_role || profile?.job_title || 'Developer' },
  ]

  return (
    <div className="section-container py-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
        <p className="text-accent-light text-sm font-medium mb-2 font-mono">// about me</p>
        <h1 className="section-title">Who I Am</h1>
        <p className="section-subtitle">A bit about my background and what drives me</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Left: Photo + Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          {profile?.profile_photo ? (
            <div className="w-48 h-48 rounded-2xl overflow-hidden border-2 border-border-color mx-auto lg:mx-0">
              <img src={profile.profile_photo} alt={profile.full_name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-accent/30 to-purple-900/30 border border-accent/30 mx-auto lg:mx-0 flex items-center justify-center">
              <span className="text-5xl font-bold gradient-text">{profile?.full_name?.[0] || '?'}</span>
            </div>
          )}

          <div>
            <h2 className="text-2xl font-bold text-text-primary">{profile?.full_name}</h2>
            <p className="text-accent-light font-medium">{profile?.job_title}</p>
          </div>

          <div className="space-y-3">
            {profile?.email && (
              <a href={`mailto:${profile.email}`} className="flex items-center gap-3 text-text-secondary hover:text-text-primary transition-colors">
                <Mail size={16} className="text-accent-light shrink-0" />
                <span className="text-sm">{profile.email}</span>
              </a>
            )}
            {profile?.phone && (
              <div className="flex items-center gap-3 text-text-secondary">
                <Phone size={16} className="text-accent-light shrink-0" />
                <span className="text-sm">{profile.phone}</span>
              </div>
            )}
            {(profile?.address || profile?.location) && (
              <div className="flex items-center gap-3 text-text-secondary">
                <MapPin size={16} className="text-accent-light shrink-0" />
                <span className="text-sm">{profile.address || profile.location}</span>
              </div>
            )}
          </div>

          {profile?.available_for_work && (
            <div className="flex items-center gap-2 text-emerald-400 text-sm">
              <CheckCircle size={16} />
              <span>Available for new opportunities</span>
            </div>
          )}
        </motion.div>

        {/* Right: Bio + Highlights */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-3 space-y-8"
        >
          {/* Bio */}
          <div className="card">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Biography</h3>
            <p className="text-text-secondary leading-relaxed whitespace-pre-line">
              {profile?.bio || 'No biography added yet.'}
            </p>
          </div>

          {/* Summary */}
          {profile?.summary && (
            <div className="card border-l-2 border-l-accent">
              <h3 className="text-lg font-semibold text-text-primary mb-3">Professional Summary</h3>
              <p className="text-text-secondary leading-relaxed">{profile.summary}</p>
            </div>
          )}

          {/* Highlights Grid */}
          <div className="grid grid-cols-2 gap-4">
            {highlights.map(({ icon: Icon, label, value }) => (
              <div key={label} className="card">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Icon size={16} className="text-accent-light" />
                  </div>
                  <span className="text-xs text-text-muted">{label}</span>
                </div>
                <p className="text-text-primary font-medium text-sm">{value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

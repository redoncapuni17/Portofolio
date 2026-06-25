import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Award, ExternalLink, Calendar, Shield } from 'lucide-react'
import api from '../lib/api'

export default function CertificationsPage() {
  const [certs, setCerts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/certifications/').then(r => setCerts(r.data)).finally(() => setLoading(false))
  }, [])

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : null
  const isExpired = (d) => d && new Date(d) < new Date()

  return (
    <div className="section-container py-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
        <p className="text-accent-light text-sm font-medium mb-2 font-mono">// credentials</p>
        <h1 className="section-title">Certifications</h1>
        <p className="section-subtitle">Professional certifications and credentials I've earned</p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-48 shimmer rounded-xl" />)}
        </div>
      ) : certs.length === 0 ? (
        <div className="text-center py-16 text-text-muted">
          <Award size={40} className="mx-auto mb-4 opacity-30" />
          <p>No certifications added yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certs.map((cert, i) => {
            const expired = isExpired(cert.expiration_date)
            return (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card group"
              >
                <div className="flex items-start gap-4 mb-4">
                  {cert.image ? (
                    <img src={cert.image} alt={cert.name} className="w-14 h-14 object-contain rounded-lg border border-border-color" />
                  ) : (
                    <div className="w-14 h-14 bg-accent/10 rounded-lg flex items-center justify-center shrink-0">
                      <Award size={24} className="text-accent-light" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-text-primary leading-tight mb-1">{cert.name}</h3>
                    <p className="text-accent-light text-sm">{cert.issuing_organization}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-text-muted text-xs">
                    <Calendar size={12} />
                    <span>Issued {formatDate(cert.issue_date)}</span>
                  </div>
                  {cert.expiration_date && (
                    <div className={`flex items-center gap-2 text-xs ${expired ? 'text-red-400' : 'text-text-muted'}`}>
                      <Shield size={12} />
                      <span>{expired ? 'Expired' : 'Expires'} {formatDate(cert.expiration_date)}</span>
                    </div>
                  )}
                  {cert.credential_id && (
                    <p className="text-text-muted text-xs font-mono">ID: {cert.credential_id}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className={`badge ${expired ? 'text-red-400 bg-red-500/10 border-red-500/30' : 'badge-green'}`}>
                    {expired ? 'Expired' : 'Active'}
                  </span>
                  {cert.verification_url && (
                    <a href={cert.verification_url} target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-1.5 text-accent-light text-xs hover:underline">
                      Verify <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

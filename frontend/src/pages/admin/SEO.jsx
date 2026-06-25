import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Save, Loader2, Search, Globe } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import api from '../../lib/api'

const PAGES = ['global', 'home', 'about', 'experience', 'skills', 'projects', 'certifications', 'education', 'contact']

export default function AdminSEO() {
  const [activePage, setActivePage] = useState('global')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const { register, handleSubmit, reset } = useForm()

  const fetch = (page) => {
    setLoading(true)
    api.get(`/seo/${page}`).then(r => {
      reset(r.data || {})
    }).catch(() => reset({})).finally(() => setLoading(false))
  }

  useEffect(() => { fetch(activePage) }, [activePage])

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      await api.put(`/seo/${activePage}`, data)
      toast.success('SEO settings saved!')
    } catch { toast.error('Failed to save') } finally { setSaving(false) }
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">SEO Settings</h1>
        <p className="text-text-secondary text-sm mt-1">Configure meta tags and SEO for each page</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Page selector */}
        <div className="card h-fit">
          <h3 className="text-sm font-medium text-text-secondary mb-3 flex items-center gap-2">
            <Globe size={14} /> Pages
          </h3>
          <div className="space-y-1">
            {PAGES.map(page => (
              <button
                key={page}
                onClick={() => setActivePage(page)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm capitalize transition-all ${
                  activePage === page
                    ? 'bg-accent/20 text-accent-light border border-accent/30'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>

        {/* SEO Form */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="h-96 shimmer rounded-xl" />
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="card space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-border-color">
                <Search size={18} className="text-accent-light" />
                <h3 className="font-semibold text-text-primary capitalize">
                  {activePage === 'global' ? 'Global SEO Settings' : `${activePage} Page SEO`}
                </h3>
              </div>

              {activePage === 'global' && (
                <div>
                  <label className="label">Site Title</label>
                  <input {...register('site_title')} className="input-field" placeholder="My Portfolio" />
                  <p className="text-text-muted text-xs mt-1">Shown in browser tab and header</p>
                </div>
              )}

              <div>
                <label className="label">Meta Title</label>
                <input {...register('meta_title')} className="input-field" placeholder="Your Name - Full Stack Developer" />
                <p className="text-text-muted text-xs mt-1">60–70 characters recommended</p>
              </div>

              <div>
                <label className="label">Meta Description</label>
                <textarea {...register('meta_description')} rows={3} className="input-field resize-none"
                  placeholder="A brief, compelling description of this page..." />
                <p className="text-text-muted text-xs mt-1">150–160 characters recommended</p>
              </div>

              <div>
                <label className="label">Keywords</label>
                <input {...register('keywords')} className="input-field"
                  placeholder="developer, portfolio, react, python" />
                <p className="text-text-muted text-xs mt-1">Comma-separated keywords</p>
              </div>

              {activePage === 'global' && (
                <div>
                  <label className="label">Robots.txt Content</label>
                  <textarea {...register('robots_txt')} rows={4} className="input-field resize-none font-mono text-xs"
                    placeholder="User-agent: *&#10;Allow: /&#10;Sitemap: https://yoursite.com/sitemap.xml" />
                </div>
              )}

              {/* Preview */}
              <div className="bg-surface-hover rounded-xl p-4 border border-border-color">
                <p className="text-xs text-text-muted mb-2">Search Engine Preview</p>
                <div className="space-y-1">
                  <p className="text-blue-400 text-sm">yourwebsite.com/{activePage !== 'global' ? activePage : ''}</p>
                  <p className="text-blue-300 text-base hover:underline cursor-pointer">{`[Meta Title will appear here]`}</p>
                  <p className="text-text-muted text-xs">{`[Meta description will appear here]`}</p>
                </div>
              </div>

              <div>
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Settings</>}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

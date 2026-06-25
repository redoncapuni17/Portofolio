import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, Loader2, Link2, Globe } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import api from '../../lib/api'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'

const PLATFORMS = ['github', 'linkedin', 'twitter', 'facebook', 'instagram', 'youtube', 'email', 'website', 'other']
const defaultValues = { platform: 'github', url: '', is_active: true, display_order: 0 }

export default function AdminSocialLinks() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteItem, setDeleteItem] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [saving, setSaving] = useState(false)
  const { register, handleSubmit, reset } = useForm({ defaultValues })

  const fetch = () => api.get('/social-links/all').then(r => setItems(r.data)).finally(() => setLoading(false))
  useEffect(() => { fetch() }, [])

  const openCreate = () => { setEditing(null); reset(defaultValues); setModalOpen(true) }
  const openEdit = (item) => { setEditing(item); reset(item); setModalOpen(true) }

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      if (editing) await api.put(`/social-links/${editing.id}`, data)
      else await api.post('/social-links/', data)
      toast.success(editing ? 'Updated!' : 'Created!')
      setModalOpen(false); fetch()
    } catch { toast.error('Failed') } finally { setSaving(false) }
  }

  const onDelete = async () => {
    setDeleting(true)
    try { await api.delete(`/social-links/${deleteItem.id}`); toast.success('Deleted'); setDeleteItem(null); fetch() }
    catch { toast.error('Failed') } finally { setDeleting(false) }
  }

  const platformColors = {
    github: 'bg-gray-500/15 text-gray-300', linkedin: 'bg-blue-500/15 text-blue-400',
    twitter: 'bg-sky-500/15 text-sky-400', instagram: 'bg-pink-500/15 text-pink-400',
    youtube: 'bg-red-500/15 text-red-400', email: 'bg-accent/15 text-accent-light',
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Social Links</h1>
          <p className="text-text-secondary text-sm mt-1">{items.length} links</p>
        </div>
        <button onClick={openCreate} className="btn-primary"><Plus size={16} /> Add Link</button>
      </motion.div>

      {loading ? (
        <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-16 shimmer rounded-xl" />)}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-text-muted">
          <Link2 size={40} className="mx-auto mb-4 opacity-30" />
          <p className="mb-4">No social links yet.</p>
          <button onClick={openCreate} className="btn-primary"><Plus size={16} /> Add First Link</button>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
              className="card flex items-center gap-4">
              <span className={`w-10 h-10 rounded-lg flex items-center justify-center capitalize text-sm font-bold ${platformColors[item.platform] || 'bg-surface-hover text-text-secondary'}`}>
                {item.platform[0].toUpperCase()}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-text-primary capitalize">{item.platform}</p>
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-text-muted text-xs hover:text-accent-light transition-colors truncate block">{item.url}</a>
              </div>
              <span className={`badge ${item.is_active ? 'badge-green' : 'badge text-text-muted bg-surface-hover border-border-color'}`}>
                {item.is_active ? 'Active' : 'Hidden'}
              </span>
              <div className="flex gap-2">
                <button onClick={() => openEdit(item)} className="btn-ghost p-2"><Pencil size={15} /></button>
                <button onClick={() => setDeleteItem(item)} className="btn-ghost p-2 hover:text-red-400"><Trash2 size={15} /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Social Link' : 'Add Social Link'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Platform</label>
            <select {...register('platform')} className="input-field">
              {PLATFORMS.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className="label">URL *</label>
            <input {...register('url', { required: true })} className="input-field" placeholder="https://..." />
          </div>
          <div>
            <label className="label">Display Order</label>
            <input {...register('display_order', { valueAsNumber: true })} type="number" className="input-field" />
          </div>
          <div className="flex items-center gap-2">
            <input {...register('is_active')} type="checkbox" id="is_active" className="w-4 h-4 accent-violet-600" />
            <label htmlFor="is_active" className="text-sm text-text-secondary cursor-pointer">Show on website</label>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving && <Loader2 size={14} className="animate-spin" />}
              {editing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={onDelete} loading={deleting}
        title={`Delete "${deleteItem?.platform}" link?`} message="This link will be permanently removed." />
    </div>
  )
}

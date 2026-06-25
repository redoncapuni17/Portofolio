import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, Loader2, FolderOpen, Star, Upload } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import api from '../../lib/api'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'

const STATUS_OPTIONS = ['completed', 'in-progress', 'archived']
const defaultValues = {
  name: '', description: '', short_description: '', technologies: '',
  github_url: '', live_url: '', is_featured: false, status: 'completed', display_order: 0
}

export default function AdminProjects() {
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteItem, setDeleteItem] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [imgUploading, setImgUploading] = useState(false)
  const { register, handleSubmit, reset } = useForm({ defaultValues })

  const fetch = () => api.get('/projects/?limit=100').then(r => { setItems(r.data.projects || []); setTotal(r.data.total) }).finally(() => setLoading(false))
  useEffect(() => { fetch() }, [])

  const openCreate = () => { setEditing(null); reset(defaultValues); setModalOpen(true) }
  const openEdit = (item) => { setEditing(item); reset(item); setModalOpen(true) }

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      if (editing) await api.put(`/projects/${editing.id}`, data)
      else await api.post('/projects/', data)
      toast.success(editing ? 'Updated!' : 'Created!')
      setModalOpen(false); fetch()
    } catch { toast.error('Failed') } finally { setSaving(false) }
  }

  const onDelete = async () => {
    setDeleting(true)
    try { await api.delete(`/projects/${deleteItem.id}`); toast.success('Deleted'); setDeleteItem(null); fetch() }
    catch { toast.error('Failed') } finally { setDeleting(false) }
  }

  const uploadImage = async (projectId, file) => {
    setImgUploading(true)
    const fd = new FormData(); fd.append('file', file)
    try {
      await api.post(`/media/project-image/${projectId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Image uploaded!'); fetch()
    } catch { toast.error('Upload failed') } finally { setImgUploading(false) }
  }

  const statusColors = { completed: 'badge-green', 'in-progress': 'badge-blue', archived: 'badge text-text-muted bg-surface-hover border-border-color' }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Projects</h1>
          <p className="text-text-secondary text-sm mt-1">{total} projects total</p>
        </div>
        <button onClick={openCreate} className="btn-primary"><Plus size={16} /> Add Project</button>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{[1,2,3].map(i => <div key={i} className="h-48 shimmer rounded-xl" />)}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-text-muted">
          <FolderOpen size={40} className="mx-auto mb-4 opacity-30" />
          <p className="mb-4">No projects yet.</p>
          <button onClick={openCreate} className="btn-primary"><Plus size={16} /> Add First Project</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="card flex flex-col">
              {item.image ? (
                <div className="w-full h-36 rounded-lg overflow-hidden mb-3 bg-surface-hover relative group">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                    {imgUploading ? <Loader2 size={20} className="animate-spin text-white" /> : <Upload size={20} className="text-white" />}
                    <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files[0] && uploadImage(item.id, e.target.files[0])} />
                  </label>
                </div>
              ) : (
                <label className="w-full h-36 rounded-lg mb-3 bg-surface-hover border border-dashed border-border-color flex items-center justify-center cursor-pointer hover:border-accent/50 transition-colors">
                  {imgUploading ? <Loader2 size={20} className="animate-spin text-text-muted" /> : <Upload size={20} className="text-text-muted" />}
                  <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files[0] && uploadImage(item.id, e.target.files[0])} />
                </label>
              )}

              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-semibold text-text-primary text-sm">{item.name}</h3>
                  {item.is_featured && <Star size={12} className="text-amber-400 fill-amber-400 shrink-0" />}
                </div>
                <span className={`${statusColors[item.status] || 'badge-purple'} text-xs shrink-0`}>{item.status}</span>
              </div>

              <p className="text-text-secondary text-xs line-clamp-2 flex-1 mb-3">
                {item.short_description || item.description}
              </p>

              {item.technologies && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {item.technologies.split(',').slice(0, 4).map(t => <span key={t.trim()} className="badge-purple text-xs">{t.trim()}</span>)}
                </div>
              )}

              <div className="flex gap-2 pt-3 border-t border-border-color mt-auto">
                <button onClick={() => openEdit(item)} className="btn-secondary text-xs flex-1 justify-center py-1.5"><Pencil size={13} /> Edit</button>
                <button onClick={() => setDeleteItem(item)} className="btn-ghost p-2 hover:text-red-400"><Trash2 size={14} /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Project' : 'Add Project'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Project Name *</label>
            <input {...register('name', { required: true })} className="input-field" placeholder="My Awesome Project" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Status</label>
              <select {...register('status')} className="input-field">
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Display Order</label>
              <input {...register('display_order', { valueAsNumber: true })} type="number" className="input-field" />
            </div>
          </div>
          <div>
            <label className="label">Short Description</label>
            <input {...register('short_description')} className="input-field" placeholder="One-line summary" />
          </div>
          <div>
            <label className="label">Full Description</label>
            <textarea {...register('description')} rows={3} className="input-field resize-none" />
          </div>
          <div>
            <label className="label">Technologies (comma separated)</label>
            <input {...register('technologies')} className="input-field" placeholder="React, Python, PostgreSQL" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">GitHub URL</label>
              <input {...register('github_url')} className="input-field" placeholder="https://github.com/..." />
            </div>
            <div>
              <label className="label">Live Demo URL</label>
              <input {...register('live_url')} className="input-field" placeholder="https://..." />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input {...register('is_featured')} type="checkbox" id="is_featured" className="w-4 h-4 accent-violet-600" />
            <label htmlFor="is_featured" className="text-sm text-text-secondary cursor-pointer flex items-center gap-1.5">
              <Star size={14} className="text-amber-400" /> Featured project (shown on homepage)
            </label>
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
        title={`Delete "${deleteItem?.name}"?`} message="This project will be permanently removed." />
    </div>
  )
}

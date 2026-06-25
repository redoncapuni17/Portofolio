import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, Loader2, Briefcase } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import api from '../../lib/api'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'

const defaultValues = {
  company_name: '', position: '', start_date: '', end_date: '',
  is_current: false, description: '', technologies: '', company_website: '', display_order: 0
}

export default function AdminExperiences() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteItem, setDeleteItem] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [saving, setSaving] = useState(false)
  const { register, handleSubmit, reset, watch } = useForm({ defaultValues })
  const isCurrent = watch('is_current')

  const fetch = () => api.get('/experiences/').then(r => setItems(r.data)).finally(() => setLoading(false))
  useEffect(() => { fetch() }, [])

  const openCreate = () => { setEditing(null); reset(defaultValues); setModalOpen(true) }
  const openEdit = (item) => {
    setEditing(item)
    reset({
      ...item,
      start_date: item.start_date?.split('T')[0] || item.start_date,
      end_date: item.end_date?.split('T')[0] || item.end_date || '',
    })
    setModalOpen(true)
  }

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      const payload = { ...data, end_date: data.is_current ? null : (data.end_date || null) }
      if (editing) await api.put(`/experiences/${editing.id}`, payload)
      else await api.post('/experiences/', payload)
      toast.success(editing ? 'Updated!' : 'Created!')
      setModalOpen(false)
      fetch()
    } catch { toast.error('Failed to save') }
    finally { setSaving(false) }
  }

  const onDelete = async () => {
    setDeleting(true)
    try {
      await api.delete(`/experiences/${deleteItem.id}`)
      toast.success('Deleted')
      setDeleteItem(null)
      fetch()
    } catch { toast.error('Failed to delete') }
    finally { setDeleting(false) }
  }

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Experiences</h1>
          <p className="text-text-secondary text-sm mt-1">{items.length} work experiences</p>
        </div>
        <button onClick={openCreate} className="btn-primary"><Plus size={16} /> Add Experience</button>
      </motion.div>

      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-28 shimmer rounded-xl" />)}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-text-muted">
          <Briefcase size={40} className="mx-auto mb-4 opacity-30" />
          <p className="mb-4">No experiences yet.</p>
          <button onClick={openCreate} className="btn-primary"><Plus size={16} /> Add First Experience</button>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="card flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-semibold text-text-primary">{item.position}</h3>
                  {item.is_current && <span className="badge-green">Current</span>}
                </div>
                <p className="text-accent-light text-sm">{item.company_name}</p>
                <p className="text-text-muted text-xs mt-1">{fmt(item.start_date)} — {item.is_current ? 'Present' : fmt(item.end_date)}</p>
                {item.technologies && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.technologies.split(',').slice(0, 5).map(t => <span key={t.trim()} className="badge-purple">{t.trim()}</span>)}
                  </div>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(item)} className="btn-ghost p-2"><Pencil size={15} /></button>
                <button onClick={() => setDeleteItem(item)} className="btn-ghost p-2 hover:text-red-400"><Trash2 size={15} /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Experience' : 'Add Experience'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Company Name *</label>
              <input {...register('company_name', { required: true })} className="input-field" placeholder="Acme Corp" />
            </div>
            <div>
              <label className="label">Position *</label>
              <input {...register('position', { required: true })} className="input-field" placeholder="Senior Developer" />
            </div>
            <div>
              <label className="label">Start Date *</label>
              <input {...register('start_date', { required: true })} type="date" className="input-field" />
            </div>
            <div>
              <label className="label">End Date</label>
              <input {...register('end_date')} type="date" className="input-field" disabled={isCurrent} />
            </div>
            <div>
              <label className="label">Company Website</label>
              <input {...register('company_website')} className="input-field" placeholder="https://example.com" />
            </div>
            <div>
              <label className="label">Display Order</label>
              <input {...register('display_order', { valueAsNumber: true })} type="number" className="input-field" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input {...register('is_current')} type="checkbox" id="is_current" className="w-4 h-4 accent-violet-600" />
            <label htmlFor="is_current" className="text-sm text-text-secondary cursor-pointer">Currently working here</label>
          </div>
          <div>
            <label className="label">Technologies (comma separated)</label>
            <input {...register('technologies')} className="input-field" placeholder="React, Python, Docker" />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea {...register('description')} rows={4} className="input-field resize-none" placeholder="Describe your responsibilities and achievements..." />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? <Loader2 size={14} className="animate-spin" /> : null}
              {editing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={onDelete}
        loading={deleting}
        title={`Delete "${deleteItem?.position}"?`}
        message="This experience will be permanently removed."
      />
    </div>
  )
}

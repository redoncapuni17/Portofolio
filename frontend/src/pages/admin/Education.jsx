import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, Loader2, GraduationCap } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import api from '../../lib/api'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'

const defaultValues = { institution_name: '', degree: '', field_of_study: '', start_date: '', end_date: '', description: '', display_order: 0 }

export default function AdminEducation() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteItem, setDeleteItem] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [saving, setSaving] = useState(false)
  const { register, handleSubmit, reset } = useForm({ defaultValues })

  const fetch = () => api.get('/education/').then(r => setItems(r.data)).finally(() => setLoading(false))
  useEffect(() => { fetch() }, [])

  const openCreate = () => { setEditing(null); reset(defaultValues); setModalOpen(true) }
  const openEdit = (item) => {
    setEditing(item)
    reset({ ...item, start_date: item.start_date?.split('T')[0] || '', end_date: item.end_date?.split('T')[0] || '' })
    setModalOpen(true)
  }

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      if (editing) await api.put(`/education/${editing.id}`, data)
      else await api.post('/education/', data)
      toast.success(editing ? 'Updated!' : 'Created!')
      setModalOpen(false); fetch()
    } catch { toast.error('Failed to save') } finally { setSaving(false) }
  }

  const onDelete = async () => {
    setDeleting(true)
    try { await api.delete(`/education/${deleteItem.id}`); toast.success('Deleted'); setDeleteItem(null); fetch() }
    catch { toast.error('Failed') } finally { setDeleting(false) }
  }

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Education</h1>
          <p className="text-text-secondary text-sm mt-1">{items.length} entries</p>
        </div>
        <button onClick={openCreate} className="btn-primary"><Plus size={16} /> Add Education</button>
      </motion.div>

      {loading ? (
        <div className="space-y-4">{[1,2].map(i => <div key={i} className="h-28 shimmer rounded-xl" />)}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-text-muted">
          <GraduationCap size={40} className="mx-auto mb-4 opacity-30" />
          <p className="mb-4">No education added yet.</p>
          <button onClick={openCreate} className="btn-primary"><Plus size={16} /> Add Education</button>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="card flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-text-primary">{item.degree}</h3>
                {item.field_of_study && <p className="text-accent-light text-sm">{item.field_of_study}</p>}
                <p className="text-text-secondary text-sm">{item.institution_name}</p>
                <p className="text-text-muted text-xs mt-1">{fmt(item.start_date)} — {fmt(item.end_date)}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(item)} className="btn-ghost p-2"><Pencil size={15} /></button>
                <button onClick={() => setDeleteItem(item)} className="btn-ghost p-2 hover:text-red-400"><Trash2 size={15} /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Education' : 'Add Education'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label">Institution Name *</label>
              <input {...register('institution_name', { required: true })} className="input-field" placeholder="MIT, Stanford..." />
            </div>
            <div>
              <label className="label">Degree *</label>
              <input {...register('degree', { required: true })} className="input-field" placeholder="Bachelor of Science" />
            </div>
            <div>
              <label className="label">Field of Study</label>
              <input {...register('field_of_study')} className="input-field" placeholder="Computer Science" />
            </div>
            <div>
              <label className="label">Start Date *</label>
              <input {...register('start_date', { required: true })} type="date" className="input-field" />
            </div>
            <div>
              <label className="label">End Date</label>
              <input {...register('end_date')} type="date" className="input-field" />
            </div>
            <div>
              <label className="label">Display Order</label>
              <input {...register('display_order', { valueAsNumber: true })} type="number" className="input-field" />
            </div>
          </div>
          <div>
            <label className="label">Description</label>
            <textarea {...register('description')} rows={3} className="input-field resize-none" />
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
        title={`Delete "${deleteItem?.degree}"?`} message="This education entry will be permanently removed." />
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, Loader2, Code2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import api from '../../lib/api'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'

const CATEGORIES = ['Backend', 'Frontend', 'DevOps', 'Databases', 'Mobile', 'Cloud', 'Tools', 'Other']
const defaultValues = { name: '', category: 'Backend', proficiency: 80, display_order: 0 }

export default function AdminSkills() {
  const [items, setItems] = useState([])
  const [grouped, setGrouped] = useState({})
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteItem, setDeleteItem] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [saving, setSaving] = useState(false)
  const { register, handleSubmit, reset, watch } = useForm({ defaultValues })
  const proficiency = watch('proficiency')

  const fetch = () => api.get('/skills/').then(r => {
    setItems(r.data.skills || [])
    setGrouped(r.data.grouped || {})
  }).finally(() => setLoading(false))
  useEffect(() => { fetch() }, [])

  const openCreate = () => { setEditing(null); reset(defaultValues); setModalOpen(true) }
  const openEdit = (item) => { setEditing(item); reset(item); setModalOpen(true) }

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      const payload = { ...data, proficiency: Number(data.proficiency) }
      if (editing) await api.put(`/skills/${editing.id}`, payload)
      else await api.post('/skills/', payload)
      toast.success(editing ? 'Updated!' : 'Created!')
      setModalOpen(false); fetch()
    } catch { toast.error('Failed') } finally { setSaving(false) }
  }

  const onDelete = async () => {
    setDeleting(true)
    try { await api.delete(`/skills/${deleteItem.id}`); toast.success('Deleted'); setDeleteItem(null); fetch() }
    catch { toast.error('Failed') } finally { setDeleting(false) }
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Skills</h1>
          <p className="text-text-secondary text-sm mt-1">{items.length} skills across {Object.keys(grouped).length} categories</p>
        </div>
        <button onClick={openCreate} className="btn-primary"><Plus size={16} /> Add Skill</button>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{[1,2,3,4].map(i => <div key={i} className="h-48 shimmer rounded-xl" />)}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-text-muted">
          <Code2 size={40} className="mx-auto mb-4 opacity-30" />
          <p className="mb-4">No skills yet.</p>
          <button onClick={openCreate} className="btn-primary"><Plus size={16} /> Add First Skill</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(grouped).map(([cat, skills]) => (
            <motion.div key={cat} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card">
              <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent" />
                {cat}
                <span className="text-text-muted text-xs ml-auto">{skills.length}</span>
              </h3>
              <div className="space-y-3">
                {skills.map(skill => (
                  <div key={skill.id} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-text-primary">{skill.name}</span>
                        <span className="text-text-muted text-xs">{skill.proficiency}%</span>
                      </div>
                      <div className="h-1.5 bg-border-color rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-accent to-accent-light rounded-full transition-all duration-500"
                          style={{ width: `${skill.proficiency}%` }} />
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => openEdit(skill)} className="btn-ghost p-1.5"><Pencil size={13} /></button>
                      <button onClick={() => setDeleteItem(skill)} className="btn-ghost p-1.5 hover:text-red-400"><Trash2 size={13} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Skill' : 'Add Skill'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Skill Name *</label>
            <input {...register('name', { required: true })} className="input-field" placeholder="React, Python..." />
          </div>
          <div>
            <label className="label">Category</label>
            <select {...register('category')} className="input-field">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Proficiency: <span className="text-accent-light">{proficiency}%</span></label>
            <input {...register('proficiency')} type="range" min="0" max="100" className="w-full accent-violet-600 cursor-pointer" />
          </div>
          <div>
            <label className="label">Display Order</label>
            <input {...register('display_order', { valueAsNumber: true })} type="number" className="input-field" />
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
        title={`Delete "${deleteItem?.name}"?`} message="This skill will be permanently removed." />
    </div>
  )
}

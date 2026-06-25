import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, Loader2, Award, Upload } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import api from '../../lib/api'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'

const defaultValues = { name: '', issuing_organization: '', issue_date: '', expiration_date: '', verification_url: '', credential_id: '', display_order: 0 }

export default function AdminCertifications() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteItem, setDeleteItem] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [saving, setSaving] = useState(false)
  const { register, handleSubmit, reset } = useForm({ defaultValues })

  const fetch = () => api.get('/certifications/').then(r => setItems(r.data)).finally(() => setLoading(false))
  useEffect(() => { fetch() }, [])

  const openCreate = () => { setEditing(null); reset(defaultValues); setModalOpen(true) }
  const openEdit = (item) => {
    setEditing(item)
    reset({ ...item, issue_date: item.issue_date?.split('T')[0] || '', expiration_date: item.expiration_date?.split('T')[0] || '' })
    setModalOpen(true)
  }

  const onSubmit = async (data) => {
    setSaving(true)
    const payload = { ...data, expiration_date: data.expiration_date || null }
    try {
      if (editing) await api.put(`/certifications/${editing.id}`, payload)
      else await api.post('/certifications/', payload)
      toast.success(editing ? 'Updated!' : 'Created!')
      setModalOpen(false); fetch()
    } catch { toast.error('Failed') } finally { setSaving(false) }
  }

  const onDelete = async () => {
    setDeleting(true)
    try { await api.delete(`/certifications/${deleteItem.id}`); toast.success('Deleted'); setDeleteItem(null); fetch() }
    catch { toast.error('Failed') } finally { setDeleting(false) }
  }

  const uploadImg = async (certId, file) => {
    const fd = new FormData(); fd.append('file', file)
    try {
      await api.post(`/media/certification-image/${certId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Image uploaded!'); fetch()
    } catch { toast.error('Upload failed') }
  }

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : null
  const isExpired = (d) => d && new Date(d) < new Date()

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Certifications</h1>
          <p className="text-text-secondary text-sm mt-1">{items.length} certifications</p>
        </div>
        <button onClick={openCreate} className="btn-primary"><Plus size={16} /> Add Certification</button>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{[1,2,3].map(i => <div key={i} className="h-36 shimmer rounded-xl" />)}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-text-muted">
          <Award size={40} className="mx-auto mb-4 opacity-30" />
          <p className="mb-4">No certifications yet.</p>
          <button onClick={openCreate} className="btn-primary"><Plus size={16} /> Add Certification</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="card flex items-start gap-4">
              <label className="shrink-0 cursor-pointer group">
                {item.image ? (
                  <div className="w-14 h-14 rounded-lg overflow-hidden border border-border-color relative">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Upload size={14} className="text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="w-14 h-14 bg-accent/10 rounded-lg flex items-center justify-center border border-border-color group-hover:border-accent/50 transition-colors">
                    <Award size={22} className="text-accent-light" />
                  </div>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files[0] && uploadImg(item.id, e.target.files[0])} />
              </label>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-text-primary text-sm leading-tight">{item.name}</h3>
                <p className="text-accent-light text-xs mt-0.5">{item.issuing_organization}</p>
                <p className="text-text-muted text-xs mt-1">
                  Issued {fmt(item.issue_date)}
                  {item.expiration_date && (
                    <span className={isExpired(item.expiration_date) ? ' · Expired' : ` · Expires ${fmt(item.expiration_date)}`} />
                  )}
                </p>
                {item.credential_id && <p className="text-text-muted text-xs font-mono mt-0.5">ID: {item.credential_id}</p>}
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => openEdit(item)} className="btn-ghost p-2"><Pencil size={14} /></button>
                <button onClick={() => setDeleteItem(item)} className="btn-ghost p-2 hover:text-red-400"><Trash2 size={14} /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Certification' : 'Add Certification'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Certification Name *</label>
            <input {...register('name', { required: true })} className="input-field" placeholder="AWS Solutions Architect" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Issuing Organization *</label>
              <input {...register('issuing_organization', { required: true })} className="input-field" placeholder="Amazon Web Services" />
            </div>
            <div>
              <label className="label">Credential ID</label>
              <input {...register('credential_id')} className="input-field" placeholder="ABC-123" />
            </div>
            <div>
              <label className="label">Issue Date *</label>
              <input {...register('issue_date', { required: true })} type="date" className="input-field" />
            </div>
            <div>
              <label className="label">Expiration Date</label>
              <input {...register('expiration_date')} type="date" className="input-field" />
            </div>
          </div>
          <div>
            <label className="label">Verification URL</label>
            <input {...register('verification_url')} className="input-field" placeholder="https://..." />
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
        title={`Delete "${deleteItem?.name}"?`} message="This certification will be permanently removed." />
    </div>
  )
}

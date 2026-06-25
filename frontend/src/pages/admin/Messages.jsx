import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Mail, MailOpen, Archive, ArchiveRestore, Trash2, Clock } from 'lucide-react'
import { toast } from 'sonner'
import api from '../../lib/api'
import ConfirmDialog from '../../components/ui/ConfirmDialog'

export default function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [deleteItem, setDeleteItem] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [filter, setFilter] = useState('all') // all, unread, archived

  const fetch = () => {
    let params = ''
    if (filter === 'unread') params = '?is_read=false'
    else if (filter === 'archived') params = '?is_archived=true'
    api.get(`/contact/${params}`).then(r => {
      setMessages(r.data.messages || [])
      setTotal(r.data.total)
    }).finally(() => setLoading(false))
  }
  useEffect(() => { fetch() }, [filter])

  const markRead = async (msg) => {
    if (msg.is_read) return
    try {
      await api.put(`/contact/${msg.id}/read`)
      setMessages(ms => ms.map(m => m.id === msg.id ? { ...m, is_read: true } : m))
    } catch { }
  }

  const archive = async (msg) => {
    try {
      await api.put(`/contact/${msg.id}/archive`)
      toast.success('Archived')
      if (selected?.id === msg.id) setSelected(null)
      fetch()
    } catch { toast.error('Failed') }
  }

  const unarchive = async (msg) => {
    try {
      await api.put(`/contact/${msg.id}/unarchive`)
      toast.success('Unarchived')
      if (selected?.id === msg.id) setSelected(null)
      fetch()
    } catch { toast.error('Failed') }
  }

  const onDelete = async () => {
    setDeleting(true)
    try {
      await api.delete(`/contact/${deleteItem.id}`)
      toast.success('Deleted')
      if (selected?.id === deleteItem.id) setSelected(null)
      setDeleteItem(null); fetch()
    } catch { toast.error('Failed') } finally { setDeleting(false) }
  }

  const selectMsg = (msg) => {
    setSelected(msg)
    markRead(msg)
  }

  const fmt = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Messages</h1>
          <p className="text-text-secondary text-sm mt-1">{total} messages</p>
        </div>
        <div className="flex gap-2">
          {['all', 'unread', 'archived'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
                filter === f ? 'bg-accent text-white' : 'btn-secondary'
              }`}>{f}</button>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[calc(100vh-12rem)]">
        {/* Message List */}
        <div className="lg:col-span-2 space-y-2 overflow-y-auto pr-1">
          {loading ? (
            [1,2,3,4].map(i => <div key={i} className="h-24 shimmer rounded-xl" />)
          ) : messages.length === 0 ? (
            <div className="text-center py-16 text-text-muted">
              <MessageSquare size={36} className="mx-auto mb-3 opacity-30" />
              <p>No messages</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => selectMsg(msg)}
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                  selected?.id === msg.id
                    ? 'border-accent/50 bg-accent/10'
                    : msg.is_read
                      ? 'border-border-color bg-surface hover:bg-surface-hover'
                      : 'border-accent/30 bg-accent/5 hover:bg-accent/10'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    {!msg.is_read && <span className="w-2 h-2 bg-accent rounded-full shrink-0" />}
                    <span className="font-medium text-text-primary text-sm truncate">{msg.name}</span>
                  </div>
                  <span className="text-text-muted text-xs shrink-0 flex items-center gap-1">
                    <Clock size={11} /> {fmt(msg.created_at).split(',')[0]}
                  </span>
                </div>
                <p className="text-text-muted text-xs truncate">{msg.email}</p>
                {msg.subject && <p className="text-text-secondary text-xs mt-1 truncate font-medium">{msg.subject}</p>}
                <p className="text-text-muted text-xs mt-1 line-clamp-2">{msg.message}</p>
              </motion.div>
            ))
          )}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-3">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card h-full flex flex-col"
            >
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-text-primary">{selected.subject || 'No Subject'}</h2>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-text-secondary text-sm">{selected.name}</span>
                    <a href={`mailto:${selected.email}`} className="text-accent-light text-sm hover:underline">{selected.email}</a>
                  </div>
                  <p className="text-text-muted text-xs mt-1">{fmt(selected.created_at)}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {selected.is_archived ? (
                    <button onClick={() => unarchive(selected)} className="btn-ghost p-2 text-text-muted hover:text-emerald-400" title="Unarchive">
                      <ArchiveRestore size={16} />
                    </button>
                  ) : (
                    <button onClick={() => archive(selected)} className="btn-ghost p-2 text-text-muted hover:text-amber-400" title="Archive">
                      <Archive size={16} />
                    </button>
                  )}
                  <a href={`mailto:${selected.email}`} className="btn-secondary text-sm px-3 py-1.5 flex items-center gap-1.5">
                    <Mail size={14} /> Reply
                  </a>
                  <button onClick={() => setDeleteItem(selected)} className="btn-ghost p-2 hover:text-red-400" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                <div className="bg-surface-hover rounded-xl p-4">
                  <p className="text-text-secondary leading-relaxed whitespace-pre-wrap text-sm">{selected.message}</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="card h-full flex items-center justify-center">
              <div className="text-center text-text-muted">
                <MailOpen size={40} className="mx-auto mb-3 opacity-30" />
                <p>Select a message to read</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog open={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={onDelete} loading={deleting}
        title="Delete this message?" message="This message will be permanently deleted." />
    </div>
  )
}

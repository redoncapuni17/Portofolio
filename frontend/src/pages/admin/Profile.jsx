import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Save, Upload, Loader2, User } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import api from '../../lib/api'

export default function AdminProfile() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState(null)
  const [photoUploading, setPhotoUploading] = useState(false)
  const [cvUploading, setCvUploading] = useState(false)
  const { register, handleSubmit, reset } = useForm()

  useEffect(() => {
    api.get('/profile/').then(r => {
      setProfile(r.data)
      reset(r.data)
    }).finally(() => setLoading(false))
  }, [])

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      const res = await api.put('/profile/', data)
      setProfile(res.data)
      toast.success('Profile updated!')
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const uploadPhoto = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPhotoUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await api.post('/media/profile-photo', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setProfile(p => ({ ...p, profile_photo: res.data.url }))
      toast.success('Photo updated!')
    } catch {
      toast.error('Upload failed')
    } finally {
      setPhotoUploading(false)
    }
  }

  const uploadCV = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setCvUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await api.post('/media/cv', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setProfile(p => ({ ...p, cv_file: res.data.url }))
      toast.success('CV uploaded!')
    } catch {
      toast.error('Upload failed')
    } finally {
      setCvUploading(false)
    }
  }

  if (loading) return <div className="h-64 shimmer rounded-xl" />

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Profile</h1>
        <p className="text-text-secondary text-sm mt-1">Manage your personal information</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Photo & CV */}
        <div className="space-y-4">
          {/* Profile Photo */}
          <div className="card text-center">
            <div className="w-28 h-28 rounded-2xl mx-auto mb-4 overflow-hidden bg-surface-hover border border-border-color">
              {profile?.profile_photo ? (
                <img src={profile.profile_photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User size={36} className="text-text-muted" />
                </div>
              )}
            </div>
            <p className="text-text-primary font-medium text-sm mb-3">{profile?.full_name || 'Your Name'}</p>
            <label className="btn-secondary w-full justify-center cursor-pointer text-sm">
              {photoUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              {photoUploading ? 'Uploading...' : 'Upload Photo'}
              <input type="file" accept="image/*" className="hidden" onChange={uploadPhoto} />
            </label>
          </div>

          {/* CV Upload */}
          <div className="card">
            <h3 className="text-sm font-medium text-text-primary mb-3">Curriculum Vitae</h3>
            {profile?.cv_file && (
              <a href={profile.cv_file} target="_blank" rel="noopener noreferrer"
                 className="block text-accent-light text-xs mb-3 hover:underline truncate">
                Current: {profile.cv_file.split('/').pop()}
              </a>
            )}
            <label className="btn-secondary w-full justify-center cursor-pointer text-sm">
              {cvUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              {cvUploading ? 'Uploading...' : 'Upload CV (PDF)'}
              <input type="file" accept=".pdf" className="hidden" onChange={uploadCV} />
            </label>
          </div>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="card space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name</label>
                <input {...register('full_name')} className="input-field" placeholder="John Doe" />
              </div>
              <div>
                <label className="label">Job Title</label>
                <input {...register('job_title')} className="input-field" placeholder="Full Stack Developer" />
              </div>
              <div>
                <label className="label">Email</label>
                <input {...register('email')} type="email" className="input-field" />
              </div>
              <div>
                <label className="label">Phone</label>
                <input {...register('phone')} className="input-field" placeholder="+1 234 567 8900" />
              </div>
              <div>
                <label className="label">Address / Location</label>
                <input {...register('address')} className="input-field" placeholder="New York, USA" />
              </div>
              <div>
                <label className="label">Years of Experience</label>
                <input {...register('years_of_experience', { valueAsNumber: true })} type="number" className="input-field" min="0" max="50" />
              </div>
              <div>
                <label className="label">Current Role</label>
                <input {...register('current_role')} className="input-field" placeholder="Senior Developer at ..." />
              </div>
              <div>
                <label className="label">Languages</label>
                <input {...register('languages')} className="input-field" placeholder="English, Spanish" />
              </div>
            </div>

            <div>
              <label className="label">Biography</label>
              <textarea {...register('bio')} rows={4} className="input-field resize-none" placeholder="Tell your story..." />
            </div>

            <div>
              <label className="label">Professional Summary</label>
              <textarea {...register('summary')} rows={3} className="input-field resize-none" placeholder="Short professional summary for SEO and intro..." />
            </div>

            <div className="flex items-center gap-3">
              <input {...register('available_for_work')} type="checkbox" id="available" className="w-4 h-4 accent-violet-600 rounded" />
              <label htmlFor="available" className="text-sm text-text-secondary cursor-pointer">
                Available for new work / opportunities
              </label>
            </div>

            <div className="pt-2">
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Changes</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, Send, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import api from '../lib/api'

const iconMap = { github: Github, linkedin: Linkedin, twitter: Twitter, email: Mail }

export default function ContactPage() {
  const [profile, setProfile] = useState(null)
  const [socialLinks, setSocialLinks] = useState([])
  const [submitting, setSubmitting] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => {
    api.get('/profile/').then(r => setProfile(r.data)).catch(() => {})
    api.get('/social-links/').then(r => setSocialLinks(r.data)).catch(() => {})
  }, [])

  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      await api.post('/contact/', data)
      toast.success('Message sent! I\'ll get back to you soon.')
      reset()
    } catch {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="section-container py-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16 text-center">
        <p className="text-accent-light text-sm font-medium mb-2 font-mono">// reach out</p>
        <h1 className="section-title">Get In Touch</h1>
        <p className="section-subtitle max-w-xl mx-auto">
          Whether you have a project in mind, want to collaborate, or just want to say hello — I'd love to hear from you.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-8"
        >
          <div>
            <h2 className="text-xl font-semibold text-text-primary mb-6">Contact Information</h2>
            <div className="space-y-4">
              {profile?.email && (
                <a href={`mailto:${profile.email}`} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center border border-accent/20 group-hover:border-accent/50 transition-colors">
                    <Mail size={18} className="text-accent-light" />
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Email</p>
                    <p className="text-text-primary text-sm group-hover:text-accent-light transition-colors">{profile.email}</p>
                  </div>
                </a>
              )}
              {profile?.phone && (
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center border border-accent/20">
                    <Phone size={18} className="text-accent-light" />
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Phone</p>
                    <p className="text-text-primary text-sm">{profile.phone}</p>
                  </div>
                </div>
              )}
              {(profile?.address || profile?.location) && (
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center border border-accent/20">
                    <MapPin size={18} className="text-accent-light" />
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Location</p>
                    <p className="text-text-primary text-sm">{profile.address || profile.location}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {socialLinks.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-text-secondary mb-4">Find me online</h3>
              <div className="flex gap-3 flex-wrap">
                {socialLinks.map(link => {
                  const Icon = iconMap[link.platform] || Mail
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-surface border border-border-color rounded-lg text-text-secondary hover:text-text-primary hover:border-accent/50 transition-all text-sm"
                    >
                      <Icon size={15} />
                      <span className="capitalize">{link.platform}</span>
                    </a>
                  )
                })}
              </div>
            </div>
          )}
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-3"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="card space-y-5">
            <h2 className="text-xl font-semibold text-text-primary mb-2">Send a Message</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="label">Name *</label>
                <input
                  {...register('name', { required: 'Name is required' })}
                  className="input-field"
                  placeholder="Your name"
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="label">Email *</label>
                <input
                  {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })}
                  className="input-field"
                  placeholder="your@email.com"
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
              </div>
            </div>

            <div>
              <label className="label">Subject</label>
              <input
                {...register('subject')}
                className="input-field"
                placeholder="What's this about?"
              />
            </div>

            <div>
              <label className="label">Message *</label>
              <textarea
                {...register('message', { required: 'Message is required', minLength: { value: 10, message: 'At least 10 characters' } })}
                rows={5}
                className="input-field resize-none"
                placeholder="Tell me about your project or question..."
              />
              {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full justify-center py-3">
              {submitting ? (
                <><Loader2 size={16} className="animate-spin" /> Sending...</>
              ) : (
                <><Send size={16} /> Send Message</>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

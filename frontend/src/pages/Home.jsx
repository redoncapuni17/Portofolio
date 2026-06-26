import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Download, Mail, ArrowRight, Github, Linkedin, Twitter, ExternalLink, ChevronDown } from 'lucide-react'
import api from '../lib/api'
import { useReducedMotion, getFadeUp, getInViewProps } from '../lib/motion'

const iconMap = { github: Github, linkedin: Linkedin, twitter: Twitter, email: Mail }

export default function HomePage() {
  const [profile, setProfile] = useState(null)
  const [socialLinks, setSocialLinks] = useState([])
  const [featuredProjects, setFeaturedProjects] = useState([])
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const reducedMotion = useReducedMotion()
  const fadeUp = getFadeUp(reducedMotion)

  useEffect(() => {
    Promise.all([
      api.get('/profile/'),
      api.get('/social-links/'),
      api.get('/projects/?featured=true&limit=3'),
      api.get('/skills/list'),
    ]).then(([p, s, proj, sk]) => {
      setProfile(p.data)
      setSocialLinks(s.data)
      setFeaturedProjects(proj.data.projects || [])
      setSkills(sk.data.slice(0, 8))
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center hero-grid overflow-hidden">
        {/* Background glow — desktop only (blur is expensive on mobile GPUs) */}
        <div className="absolute inset-0 bg-hero-glow pointer-events-none hidden md:block" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[100px] pointer-events-none hidden md:block" />

        <div className="section-container relative py-20">
          <div className="max-w-3xl">
            {/* Status badge */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
              {profile?.available_for_work && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium mb-8">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  Available for work
                </div>
              )}
            </motion.div>

            {/* Name & Title */}
            <motion.h1
              variants={fadeUp} initial="hidden" animate="visible" custom={1}
              className="text-5xl md:text-7xl font-bold leading-tight mb-4"
            >
              {loading ? (
                <div className="h-16 shimmer rounded-lg w-64" />
              ) : (
                <>
                  <span className="text-text-primary">{profile?.full_name || 'Your Name'}</span>
                </>
              )}
            </motion.h1>

            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
              <p className="text-xl md:text-2xl gradient-text font-semibold mb-6">
                {profile?.job_title || 'Full Stack Developer'}
              </p>
            </motion.div>

            <motion.p
              variants={fadeUp} initial="hidden" animate="visible" custom={3}
              className="text-text-secondary text-lg leading-relaxed mb-10 max-w-2xl"
            >
              {profile?.bio || 'Building modern web applications with clean code and great user experiences.'}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeUp} initial="hidden" animate="visible" custom={4}
              className="flex flex-wrap items-center gap-4 mb-12"
            >
              {profile?.cv_file && (
                <a href={profile.cv_file} download className="btn-primary text-base px-6 py-3">
                  <Download size={18} />
                  Download CV
                </a>
              )}
              <Link to="/contact" className="btn-secondary text-base px-6 py-3">
                <Mail size={18} />
                Contact Me
              </Link>
              <Link to="/projects" className="btn-ghost text-base">
                View Projects <ArrowRight size={16} />
              </Link>
            </motion.div>

            {/* Social Links */}
            <motion.div
              variants={fadeUp} initial="hidden" animate="visible" custom={5}
              className="flex items-center gap-3"
            >
              {socialLinks.map(link => {
                const Icon = iconMap[link.platform] || ExternalLink
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-surface border border-border-color rounded-lg flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-accent/50 hover:bg-surface-hover transition-all duration-200"
                    title={link.platform}
                  >
                    <Icon size={18} />
                  </a>
                )
              })}
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-text-muted flex flex-col items-center gap-2"
          >
            <span className="text-xs">Scroll to explore</span>
            <ChevronDown size={16} className="animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="py-24 border-t border-border-color">
          <div className="section-container">
            <motion.div
              {...getInViewProps(reducedMotion)}
              className="flex items-end justify-between mb-12"
            >
              <div>
                <p className="text-accent-light text-sm font-medium mb-2 font-mono">// featured work</p>
                <h2 className="section-title">Selected Projects</h2>
              </div>
              <Link to="/projects" className="btn-ghost hidden md:flex">
                All projects <ArrowRight size={16} />
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project, i) => (
                <motion.div
                  key={project.id}
                  {...getInViewProps(reducedMotion, i * 0.1)}
                  className="card group cursor-pointer"
                >
                  {project.image && (
                    <div className="w-full h-40 rounded-lg overflow-hidden mb-4 bg-surface-hover">
                      <img
                        src={project.image}
                        alt={project.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-text-primary">{project.name}</h3>
                    <div className="flex gap-2 shrink-0 ml-2">
                      {project.github_url && (
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer" 
                           className="text-text-muted hover:text-text-primary transition-colors"
                           onClick={e => e.stopPropagation()}>
                          <Github size={16} />
                        </a>
                      )}
                      {project.live_url && (
                        <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                           className="text-text-muted hover:text-text-primary transition-colors"
                           onClick={e => e.stopPropagation()}>
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                    {project.short_description || project.description}
                  </p>
                  {project.technologies && (
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.split(',').slice(0, 4).map(t => (
                        <span key={t.trim()} className="badge-purple text-xs">{t.trim()}</span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Link to="/projects" className="btn-secondary">
                View All Projects <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Skills preview */}
      {skills.length > 0 && (
        <section className="py-24 border-t border-border-color bg-bg-secondary">
          <div className="section-container">
            <motion.div
              {...getInViewProps(reducedMotion)}
              className="text-center mb-12"
            >
              <p className="text-accent-light text-sm font-medium mb-2 font-mono">// technologies</p>
              <h2 className="section-title">Skills & Technologies</h2>
              <p className="section-subtitle">Tools and languages I work with</p>
            </motion.div>

            <div className="flex flex-wrap justify-center gap-3">
              {skills.map((skill, i) => (
                <motion.div
                  key={skill.id}
                  {...(reducedMotion
                    ? { initial: false, animate: { opacity: 1, scale: 1 } }
                    : {
                        initial: { opacity: 0, scale: 0.9 },
                        whileInView: { opacity: 1, scale: 1 },
                        viewport: { once: true },
                        transition: { delay: i * 0.05 },
                      })}
                  className="flex items-center gap-2 px-4 py-2 bg-surface border border-border-color rounded-lg hover:border-accent/40 transition-all duration-200"
                >
                  <span className="text-text-primary text-sm font-medium">{skill.name}</span>
                  <span className="text-text-muted text-xs">{skill.proficiency}%</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link to="/skills" className="btn-secondary">
                View All Skills <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

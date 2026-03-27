import SEO from '../../components/ui/SEO'
import { Link } from 'react-router-dom'
import { Shield, Star, Users, Award, ChevronRight, Eye, Lock, Zap } from 'lucide-react'
import ParticleCanvas from '../../components/ui/ParticleCanvas'
import GlowOrb from '../../components/ui/GlowOrb'
import ScrollReveal from '../../components/ui/ScrollReveal'
import ReviewsSection from '../../components/ui/ReviewsSection'
import LatestPosts from '../../components/ui/LatestPosts'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useCounterAnimation } from '../../hooks/useCounterAnimation'
import { useContent } from '../../hooks/useContent'

const serviceIcons = [Shield, Eye, Lock, Zap]

function StatItem({ valeur, label }) {
  const numeric = parseInt(valeur)
  const suffix  = valeur?.replace(/[0-9]/g, '') || ''
  const isNumeric = !isNaN(numeric) && suffix !== valeur

  const { ref, isVisible } = useScrollReveal()
  const count = useCounterAnimation(isNumeric ? numeric : null, 1800, isVisible)

  return (
    <div ref={ref} className="text-center">
      <div className="font-serif text-4xl font-bold text-gold-400 mb-1">
        {isNumeric ? `${count}${suffix}` : valeur}
      </div>
      <div className="text-gray-400 text-sm">{label}</div>
    </div>
  )
}

export default function Home() {
  const { c } = useContent()

  const services = [1,2,3,4].map(i => ({
    icon: serviceIcons[i-1],
    titre: c(`service${i}_titre`),
    desc:  c(`service${i}_desc`),
  }))

  const stats = [1,2,3,4].map(i => ({
    valeur: c(`stat${i}_valeur`),
    label:  c(`stat${i}_label`),
  }))

  return (
    <>
      <SEO
        title="Protection Rapprochée VIP — Paris &amp; International"
        description="Turbo Sécurity, protection rapprochée d'excellence. Garde du corps VIP, escorte sécurisée, sécurité événementielle. Agents certifiés disponibles 24h/24 à Paris et à l'international."
        path="/"
      />
      <div className="bg-dark-900">
      {/* ─── Hero ─────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          autoPlay muted loop playsInline
          poster="/hero-poster.jpg"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
          <source src="/hero-video.webm" type="video/webm" />
        </video>

        <div className="absolute inset-0 bg-dark-900/70 z-[1]" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-dark-900 to-transparent z-[1]" />

        <ParticleCanvas />

        <div className="absolute inset-0 opacity-[0.025] z-[2]"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, #d4971a 0, #d4971a 1px, transparent 0, transparent 50%)', backgroundSize: '22px 22px' }}
        />

        <GlowOrb className="w-[500px] h-[500px] -top-40 -right-40 opacity-15 z-[2]" />
        <GlowOrb className="w-80 h-80 bottom-0 -left-20 opacity-8 z-[2]" slow />

        <div className="relative max-w-5xl mx-auto px-4 text-center" style={{ zIndex: 10 }}>
          <div className="hero-animate inline-flex items-center gap-2 border border-gold-500/30 bg-gold-500/5 px-4 py-2 rounded-sm mb-8 badge-pulse">
            <Shield className="w-4 h-4 text-gold-400" />
            <span className="text-gold-400 text-sm tracking-widest uppercase font-medium">
              {c('hero_badge')}
            </span>
          </div>

          <h1 className="hero-animate-delay-1 font-serif text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="text-shimmer">{c('hero_titre')}</span>
          </h1>

          <p className="hero-animate-delay-2 text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            {c('hero_sous_titre')}
          </p>

          <div className="hero-animate-delay-3 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/reservation" className="btn-gold inline-flex items-center gap-2 text-base">
              {c('hero_cta1')} <ChevronRight className="w-4 h-4" />
            </Link>
            <Link to="/services" className="btn-outline-gold inline-flex items-center gap-2 text-base">
              {c('hero_cta2')}
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="w-px h-10 bg-gradient-to-b from-transparent to-gold-500 animate-pulse" />
        </div>
      </section>

      {/* ─── Stats ────────────────────────────────────────── */}
      <section className="relative border-y border-dark-600 bg-dark-800 overflow-hidden">
        <GlowOrb className="w-96 h-24 top-0 left-1/4 opacity-20" slow />
        <div className="max-w-7xl mx-auto px-4 py-14 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <ScrollReveal key={i} direction="up" delay={`${i * 100}ms`}>
                <StatItem {...s} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Services ─────────────────────────────────────── */}
      <section className="relative py-24 px-4 overflow-hidden">
        <GlowOrb className="w-96 h-96 top-0 right-0 opacity-10" />
        <GlowOrb className="w-72 h-72 bottom-10 left-10 opacity-8" slow />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <ScrollReveal direction="fade">
              <p className="text-shimmer text-sm tracking-widest uppercase font-medium mb-3">Nos Expertises</p>
              <h2 className="section-title mb-4">Des services sur mesure</h2>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map(({ icon: Icon, titre, desc }, i) => (
              <ScrollReveal key={i} direction="up" delay={`${i * 100}ms`}>
                <div className="card-dark glowing-card p-6 h-full">
                  <div className="w-12 h-12 bg-gold-500/10 border border-gold-500/20 rounded-sm flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-gold-400" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{titre}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal direction="up" delay="200ms">
            <div className="text-center mt-10">
              <Link to="/services" className="btn-outline-gold inline-flex items-center gap-2">
                Voir tous les services <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── Why us ───────────────────────────────────────── */}
      <section className="relative py-24 px-4 bg-dark-800 overflow-hidden">
        <GlowOrb className="w-80 h-80 top-0 right-0 opacity-15" slow />
        <GlowOrb className="w-64 h-64 bottom-0 left-0 opacity-10" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left">
              <p className="text-shimmer text-sm tracking-widest uppercase font-medium mb-3">Pourquoi nous choisir</p>
              <h2 className="section-title mb-6">L'excellence au service<br />de votre sécurité</h2>
              <ul className="space-y-4">
                {[
                  { icon: Award, text: 'Agents certifiés et formés aux meilleures techniques' },
                  { icon: Shield, text: 'Protocoles de sécurité adaptés à chaque situation' },
                  { icon: Users, text: "Équipes disponibles sur toute la France et à l'international" },
                  { icon: Star,  text: 'Confidentialité absolue et discrétion professionnelle' },
                ].map(({ icon: Icon, text }, i) => (
                  <ScrollReveal key={text} direction="left" delay={`${i * 80}ms`}>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gold-500/10 rounded-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className="w-4 h-4 text-gold-400" />
                      </div>
                      <span className="text-gray-300 text-sm">{text}</span>
                    </li>
                  </ScrollReveal>
                ))}
              </ul>
              <div className="mt-8">
                <Link to="/a-propos" className="btn-gold inline-flex items-center gap-2">
                  En savoir plus <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay="150ms">
              <div className="border border-dark-500 rounded-sm p-8 bg-dark-700">
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((s, i) => (
                    <div key={i} className="bg-dark-600 border border-dark-500 rounded-sm p-4 text-center glowing-card">
                      <div className="font-serif text-2xl font-bold text-gold-400 mb-1">{s.valeur}</div>
                      <div className="text-gray-400 text-xs">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ─── Dernières actualités ─────────────────────────── */}
      <LatestPosts />

      {/* ─── Avis clients ─────────────────────────────────── */}
      <ReviewsSection />

      {/* ─── CTA ──────────────────────────────────────────── */}
      <section className="relative py-24 px-4 overflow-hidden">
        <GlowOrb className="w-[600px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10" slow />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <ScrollReveal direction="up">
            <div className="border border-gold-500/20 bg-gold-500/5 glowing-card rounded-sm p-12">
              <div className="w-14 h-14 bg-gold-500/10 border border-gold-500/30 rounded-sm flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-gold-400" />
              </div>
              <h2 className="section-title mb-4">{c('cta_titre')}</h2>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto">{c('cta_texte')}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/reservation" className="btn-gold inline-flex items-center gap-2">
                  Faire une réservation <ChevronRight className="w-4 h-4" />
                </Link>
                <Link to="/contact" className="btn-outline-gold">Nous contacter</Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
    </>
  )
}

import SEO from '../../components/ui/SEO'
import Breadcrumb from '../../components/ui/Breadcrumb'
import { Shield, Award, Users, Target } from 'lucide-react'
import { Link } from 'react-router-dom'
import GlowOrb from '../../components/ui/GlowOrb'
import ScrollReveal from '../../components/ui/ScrollReveal'
import { useContent } from '../../hooks/useContent'

const values = [
  { icon: Shield, title: 'Discrétion', desc: 'La confidentialité de nos clients est sacrée. Chaque agent signe un accord de non-divulgation strict.' },
  { icon: Award, title: 'Excellence', desc: 'Nous ne recrutons que des professionnels issus des forces spéciales et des services de renseignement.' },
  { icon: Users, title: 'Équipe', desc: 'Une équipe soudée, entraînée ensemble, capable de coordonner rapidement en situation de crise.' },
  { icon: Target, title: 'Précision', desc: 'Chaque mission est planifiée avec rigueur. Rien n\'est laissé au hasard dans notre préparation.' },
]

const team = [
  { name: 'Jean-Marc Dubois', role: 'Directeur des Opérations', exp: 'Ex-GIGN · 20 ans d\'expérience' },
  { name: 'Sophie Laurent', role: 'Responsable Renseignement', exp: 'Ex-DGSI · 15 ans d\'expérience' },
  { name: 'Karim Benali', role: 'Chef de Protocole VIP', exp: 'Ex-GSPR · 12 ans d\'expérience' },
  { name: 'Thomas Mercier', role: 'Responsable Opérations Int.', exp: 'Ex-RAID · 18 ans d\'expérience' },
]

export default function About() {
  const { c } = useContent()
  return (
    <>
      <SEO
        title="À Propos — Notre Histoire &amp; Notre Équipe"
        description="Fondée par d'anciens membres des forces spéciales, Turbo Sécurity est la référence de la protection rapprochée en France. Découvrez notre histoire, nos valeurs et notre équipe d'élite."
        path="/a-propos"
      />
      <div className="bg-dark-900">
      <Breadcrumb />
      {/* Hero */}
      <section className="relative py-20 px-4 bg-dark-800 border-b border-dark-600 overflow-hidden">
        <GlowOrb className="w-96 h-96 -top-20 -right-20 opacity-15" />
        <GlowOrb className="w-64 h-64 bottom-0 -left-10 opacity-10" slow />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <ScrollReveal direction="fade">
          <p className="text-shimmer text-sm tracking-widest uppercase font-medium mb-3">Qui sommes-nous</p>
          <h1 className="section-title text-4xl md:text-5xl mb-4">{c('apropos_titre')}</h1>
          <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">{c('apropos_sous_titre')}</p>
          </ScrollReveal>
        </div>
      </section>

      {/* Story */}
      <section className="relative py-20 px-4 overflow-hidden">
        <GlowOrb className="w-80 h-80 top-20 right-0 opacity-8" slow />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left">
            <div>
              <p className="text-gold-400 text-sm tracking-widest uppercase font-medium mb-3">Notre Histoire</p>
              <h2 className="section-title mb-6">15 ans d'excellence au service de la sécurité</h2>
              <div className="space-y-4 text-gray-400 leading-relaxed">
                <p>{c('apropos_histoire_p1')}</p>
                <p>{c('apropos_histoire_p2')}</p>
                <p>{c('apropos_histoire_p3')}</p>
              </div>
            </div>
            </ScrollReveal>

            {/* Timeline */}
            <ScrollReveal direction="right" delay="150ms">
            <div className="space-y-4">
              {[
                { year: '2009', event: 'Fondation de Turbo Sécurity à Paris' },
                { year: '2012', event: 'Extension aux missions internationales' },
                { year: '2015', event: 'Création de l\'unité d\'intervention rapide' },
                { year: '2018', event: 'Ouverture du centre de formation interne' },
                { year: '2022', event: '500ème client protégé — couverture dans 12 pays' },
                { year: '2024', event: 'Certification ISO 18788 Sécurité privée' },
              ].map(({ year, event }) => (
                <div key={year} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-gold-400 rounded-full flex-shrink-0 mt-1"></div>
                    <div className="w-px flex-1 bg-dark-500 mt-1"></div>
                  </div>
                  <div className="pb-4">
                    <span className="text-gold-400 text-sm font-semibold">{year}</span>
                    <p className="text-gray-300 text-sm mt-0.5">{event}</p>
                  </div>
                </div>
              ))}
            </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Videos */}
      <section className="relative py-20 px-4 overflow-hidden">
        <GlowOrb className="w-96 h-96 top-0 left-0 opacity-8" slow />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <ScrollReveal direction="fade">
              <p className="text-shimmer text-sm tracking-widest uppercase font-medium mb-3">En Action</p>
              <h2 className="section-title">Nos équipes sur le terrain</h2>
            </ScrollReveal>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {['/video1.mp4', '/video2.mp4'].map((src, i) => (
              <ScrollReveal key={i} direction={i === 0 ? 'left' : 'right'} delay={`${i * 150}ms`}>
                <div className="relative rounded-sm overflow-hidden border border-dark-500 glowing-card group">
                  <video
                    className="w-full aspect-video object-cover"
                    controls
                    playsInline
                    preload="metadata"
                  >
                    <source src={src} type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 border border-gold-500/10 rounded-sm pointer-events-none group-hover:border-gold-500/30 transition-colors duration-300" />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="relative py-20 px-4 bg-dark-800 border-y border-dark-600 overflow-hidden">
        <GlowOrb className="w-96 h-32 top-0 left-1/2 -translate-x-1/2 opacity-15" slow />
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-gold-400 text-sm tracking-widest uppercase font-medium mb-3">Nos Valeurs</p>
            <h2 className="section-title">Ce qui nous définit</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {values.map(({ icon: Icon, title, desc }, i) => (
              <ScrollReveal key={title} direction="up" delay={`${i * 100}ms`}>
              <div className="card-dark glowing-card p-6 text-center h-full">
                <div className="w-12 h-12 bg-gold-500/10 border border-gold-500/20 rounded-sm flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-gold-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="relative py-20 px-4 overflow-hidden">
        <GlowOrb className="w-64 h-64 top-0 right-10 opacity-8" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <ScrollReveal direction="fade">
            <p className="text-shimmer text-sm tracking-widest uppercase font-medium mb-3">Direction</p>
            <h2 className="section-title">Notre équipe de direction</h2>
            </ScrollReveal>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map(({ name, role, exp }, i) => (
              <ScrollReveal key={name} direction="up" delay={`${i * 100}ms`}>
              <div className="card-dark glowing-card p-6 text-center">
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <div className="absolute inset-0 rounded-sm bg-gradient-to-br from-gold-600/30 to-gold-400/10 border border-gold-500/40" />
                  <div className="absolute inset-[3px] rounded-sm bg-dark-600 flex items-center justify-center">
                    <span className="text-gold-400 font-serif font-bold text-xl">
                      {name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="absolute -inset-[1px] rounded-sm border border-gold-500/20" />
                </div>
                <h3 className="text-white font-semibold text-sm mb-1">{name}</h3>
                <p className="text-gold-400 text-xs mb-2">{role}</p>
                <p className="text-gray-500 text-xs">{exp}</p>
              </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Galerie */}
      <section className="relative py-20 px-4 overflow-hidden">
        <GlowOrb className="w-80 h-80 top-0 right-0 opacity-8" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <ScrollReveal direction="fade">
              <p className="text-shimmer text-sm tracking-widest uppercase font-medium mb-3">Galerie</p>
              <h2 className="section-title">Nos missions en images</h2>
            </ScrollReveal>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: 'Protection VIP', col: 'md:col-span-2' },
              { label: 'Escorte sécurisée', col: '' },
              { label: 'Événementiel', col: '' },
              { label: 'Formation', col: '' },
              { label: 'International', col: 'md:col-span-2' },
            ].map(({ label, col }, i) => (
              <ScrollReveal key={i} direction="up" delay={`${i * 80}ms`}>
                <div className={`relative overflow-hidden rounded-sm border border-dark-500 hover:border-gold-500/30 transition-colors duration-300 group ${col}`}>
                  <div className="aspect-video bg-dark-700 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-10 h-10 bg-gold-500/10 border border-gold-500/20 rounded-sm flex items-center justify-center mx-auto mb-2">
                        <Shield className="w-5 h-5 text-gold-400/50" />
                      </div>
                      <p className="text-gray-600 text-xs">{label}</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="text-white text-sm font-medium">{label}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <p className="text-center text-gray-600 text-xs mt-6">Photos disponibles sur demande — confidentialité de nos clients respectée</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-dark-800 border-t border-dark-600">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="section-title mb-4">Rejoignez nos clients protégés</h2>
          <p className="text-gray-400 mb-8">Prenez contact avec notre équipe pour une consultation confidentielle.</p>
          <Link to="/contact" className="btn-gold inline-flex items-center gap-2">
            Nous contacter
          </Link>
        </div>
      </section>
    </div>
    </>
  )
}

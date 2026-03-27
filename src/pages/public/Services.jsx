import { Link } from 'react-router-dom'
import { Shield, Eye, Lock, Zap, Car, Globe, ChevronRight } from 'lucide-react'
import GlowOrb from '../../components/ui/GlowOrb'
import ScrollReveal from '../../components/ui/ScrollReveal'

const services = [
  {
    icon: Shield,
    title: 'Protection VIP',
    desc: 'Service de garde du corps dédié pour personnalités, dirigeants d\'entreprise, artistes et célébrités. Nos agents assurent votre sécurité 24h/24, 7j/7 avec une discrétion absolue.',
    features: ['Analyse des menaces', 'Garde rapprochée permanente', 'Coordination avec les forces de l\'ordre', 'Rapport quotidien'],
  },
  {
    icon: Car,
    title: 'Escorte Sécurisée',
    desc: 'Déplacements sécurisés avec véhicules blindés et chauffeurs formés aux techniques anti-agression et à la conduite d\'exception.',
    features: ['Véhicules blindés de grade B6/B7', 'Chauffeurs certifiés', 'Itinéraires sécurisés', 'Contre-surveillance'],
  },
  {
    icon: Lock,
    title: 'Sécurité Événementielle',
    desc: 'Gestion complète de la sécurité pour vos événements privés, soirées VIP, séminaires et conférences.',
    features: ['Contrôle d\'accès', 'Gestion des foules', 'Agents en civil ou uniforme', 'Coordination logistique'],
  },
  {
    icon: Eye,
    title: 'Surveillance & Reconnaissance',
    desc: 'Missions de surveillance et de renseignement pour identifier et neutraliser les menaces potentielles avant qu\'elles ne se concrétisent.',
    features: ['Surveillance statique', 'Contre-surveillance', 'Rapport de menaces', 'Analyse de risques'],
  },
  {
    icon: Globe,
    title: 'Protection Internationale',
    desc: 'Accompagnement sécurisé lors de vos déplacements à l\'international, avec coordination des équipes locales.',
    features: ['Couverture dans 12 pays', 'Coordination réseau local', 'Analyse géopolitique', 'Gestion de crise'],
  },
  {
    icon: Zap,
    title: 'Intervention Rapide',
    desc: 'Équipes d\'intervention disponibles en moins de 15 minutes sur Paris et la région Île-de-France.',
    features: ['Délai < 15 min à Paris', 'Équipes formées CQC', 'Matériel adapté', 'Disponible 24/7'],
  },
]

export default function Services() {
  return (
    <div className="bg-dark-900">
      {/* Hero */}
      <section className="relative py-20 px-4 bg-dark-800 border-b border-dark-600 overflow-hidden">
        <GlowOrb className="w-96 h-96 -top-20 -right-20 opacity-15" />
        <GlowOrb className="w-64 h-64 bottom-0 left-10 opacity-10" slow />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <ScrollReveal direction="fade">
            <p className="text-shimmer text-sm tracking-widest uppercase font-medium mb-3">Nos Prestations</p>
            <h1 className="section-title text-4xl md:text-5xl mb-4">Services de Protection</h1>
            <p className="text-gray-400 max-w-xl mx-auto">
              Une gamme complète de solutions de sécurité adaptées à vos besoins,
              assurée par des professionnels d'élite.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Services grid */}
      <section className="relative py-20 px-4 overflow-hidden">
        <GlowOrb className="w-80 h-80 top-10 left-0 opacity-8" slow />
        <GlowOrb className="w-72 h-72 bottom-10 right-0 opacity-8" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map(({ icon: Icon, title, desc, features }, i) => (
              <ScrollReveal key={title} direction="up" delay={`${(i % 3) * 100}ms`}>
              <div className="card-dark glowing-card p-8 flex flex-col h-full">
                <div className="w-14 h-14 bg-gold-500/10 border border-gold-500/20 rounded-sm flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7 text-gold-400" />
                </div>
                <h3 className="text-white font-serif font-semibold text-xl mb-3">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">{desc}</p>
                <ul className="space-y-2">
                  {features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 bg-gold-400 rounded-full flex-shrink-0"></div>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 px-4 bg-dark-800 border-t border-dark-600 overflow-hidden">
        <GlowOrb className="w-96 h-32 top-0 left-1/2 -translate-x-1/2 opacity-15" slow />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <ScrollReveal direction="up">
          <h2 className="section-title mb-4">Besoin d'un service personnalisé ?</h2>
          <p className="text-gray-400 mb-8">
            Chaque situation est unique. Contactez-nous pour une évaluation sur mesure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/reservation" className="btn-gold inline-flex items-center gap-2">
              Réserver maintenant <ChevronRight className="w-4 h-4" />
            </Link>
            <Link to="/contact" className="btn-outline-gold">Nous contacter</Link>
          </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}

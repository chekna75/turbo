import { Helmet } from 'react-helmet-async'

const BASE = 'Turbo Sécurity'

export default function SEO({ title, description, path = '' }) {
  const fullTitle = title ? `${title} | ${BASE}` : `${BASE} — Protection Rapprochée VIP`
  const url = `https://turbo-security.vercel.app${path}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
    </Helmet>
  )
}

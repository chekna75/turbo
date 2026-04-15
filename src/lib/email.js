import emailjs from '@emailjs/browser'

// Configure ces 3 valeurs dans ton .env
const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  || ''
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || ''
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  || ''

export async function sendAdminNotification(reservation) {
  const ADMIN_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE_ID || TEMPLATE_ID
  if (!SERVICE_ID || !ADMIN_TEMPLATE_ID || !PUBLIC_KEY) return { success: false }

  try {
    await emailjs.send(
      SERVICE_ID,
      ADMIN_TEMPLATE_ID,
      {
        client_name:  `${reservation.prenom} ${reservation.nom}`,
        client_email: reservation.email,
        client_tel:   reservation.telephone,
        service:      reservation.service,
        date_debut:   new Date(reservation.date_debut).toLocaleDateString('fr-FR'),
        date_fin:     reservation.date_fin ? new Date(reservation.date_fin).toLocaleDateString('fr-FR') : 'Non définie',
        lieu:         reservation.lieu,
        nb_agents:    reservation.nombre_agents,
        details:      reservation.details || 'Aucun',
        to_email:     'contact@turbosecurity.fr',
      },
      PUBLIC_KEY
    )
    return { success: true }
  } catch (err) {
    console.error('Erreur notification admin :', err)
    return { success: false }
  }
}

export async function sendConfirmationEmail(reservation) {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    console.warn('EmailJS non configuré — email non envoyé.')
    return { success: false }
  }

  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        to_name:     `${reservation.prenom} ${reservation.nom}`,
        to_email:    reservation.email,
        service:     reservation.service,
        date_debut:  new Date(reservation.date_debut).toLocaleDateString('fr-FR'),
        date_fin:    reservation.date_fin
          ? new Date(reservation.date_fin).toLocaleDateString('fr-FR')
          : 'Non définie',
        lieu:        reservation.lieu,
        nb_agents:   reservation.nombre_agents,
        reply_to:    'contact@turbosecurity.fr',
      },
      PUBLIC_KEY
    )
    return { success: true }
  } catch (err) {
    console.error('Erreur envoi email :', err)
    return { success: false }
  }
}

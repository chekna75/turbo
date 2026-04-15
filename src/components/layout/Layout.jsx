import Navbar from './Navbar'
import Footer from './Footer'
import CookieBanner from '../ui/CookieBanner'
import ScrollToTop from '../ui/ScrollToTop'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <main className="pt-20">{children}</main>
      <Footer />
      <CookieBanner />
      <ScrollToTop />
    </div>
  )
}

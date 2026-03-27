import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <main className="pt-20">{children}</main>
      <Footer />
    </div>
  )
}

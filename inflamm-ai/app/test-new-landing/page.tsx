import Navbar from '@/components/Navbar'
import NewHeroSection from '@/components/NewHeroSection'
import NewWhatIsSection from '@/components/NewWhatIsSection'
import NewFeaturesSection from '@/components/NewFeaturesSection'
import PartnersSection from '@/components/PartnersSection'
import Footer from '@/components/Footer'

export default function TestNewLanding() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <NewHeroSection />
      <NewWhatIsSection />
      <NewFeaturesSection />
      <PartnersSection />
      <Footer />
    </main>
  )
}

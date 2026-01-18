import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import CoreFeaturesSection from '@/components/CoreFeaturesSection'
import FeaturesSection from '@/components/FeaturesSection'
import PartnersSection from '@/components/PartnersSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <CoreFeaturesSection />
      <FeaturesSection />
      <PartnersSection />
      <Footer />
    </main>
  )
}

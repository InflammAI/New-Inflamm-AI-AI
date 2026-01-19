import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import CoreFeaturesSection from '@/components/CoreFeaturesSection'
import FeaturesSection from '@/components/FeaturesSection'
import PricingSection from '@/components/PricingSection'
import FAQSection from '@/components/FAQSection'
import PartnersSection from '@/components/PartnersSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <CoreFeaturesSection />
      <FeaturesSection />
      <PricingSection />
      <FAQSection />
      <PartnersSection />
      <Footer />
    </main>
  )
}

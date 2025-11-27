import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import WhatIsSection from '@/components/WhatIsSection'
import CoreFeaturesSection from '@/components/CoreFeaturesSection'
import OneProtocolSection from '@/components/OneProtocolSection'
import FeaturesSection from '@/components/FeaturesSection'
import PartnersSection from '@/components/PartnersSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <WhatIsSection />
      <CoreFeaturesSection />
      <OneProtocolSection />
      <FeaturesSection />
      <PartnersSection />
      <Footer />
    </main>
  )
}

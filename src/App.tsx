import React, { useState } from 'react'
import { LanguageProvider } from './context/LanguageContext'
import { LoadingScreen } from './components/LoadingScreen'
import { ScrollProgress } from './components/ScrollProgress'
import { Navbar } from './components/Navbar'
import { CinematicHero } from './components/CinematicHero'
import { AboutSection } from './components/AboutSection'
import { JourneySection } from './components/JourneySection'
import { ServicesSection } from './components/ServicesSection'
import { ContactSection } from './components/ContactSection'
import { Footer } from './components/Footer'

export const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <LanguageProvider>
      <div className="relative min-h-screen bg-[#080B1A] text-[#F4EFE4] selection:bg-[#C6A15B] selection:text-[#080B1A] overflow-x-hidden">
        {/* Preloader */}
        <LoadingScreen
          isLoading={isLoading}
          onComplete={() => setIsLoading(false)}
        />

        {/* Global Scroll Progress Bar */}
        <ScrollProgress />

        {/* Persistent Navigation */}
        <Navbar />

        {/* Main Page Flow */}
        <main id="main-content" tabIndex={-1} className="relative z-10 focus:outline-none">
          {/* Section 1: Cinematic Hero */}
          <CinematicHero />

          {/* Section 2: About / Philosophy */}
          <AboutSection />

          {/* Section: Our Journey / Statistics */}
          <JourneySection />

          {/* Section 3: Services / Consultations */}
          <ServicesSection />

          {/* Section 4: Contact / Appointments */}
          <ContactSection />
        </main>

        {/* Section 5: Footer */}
        <Footer />
      </div>
    </LanguageProvider>
  )
}

export default App

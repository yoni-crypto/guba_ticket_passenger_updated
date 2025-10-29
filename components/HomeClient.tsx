'use client'

import Header from '@/components/Header'
import HeroSlider from '@/components/HeroSlider'
import SearchForm from '@/components/SearchForm'
import GlobalDestinations from '@/components/GlobalDestinations'
import WhyChooseUs from '@/components/WhyChooseUs'
import OfferBanner from '@/components/OfferBanner'
import FAQ from '@/components/FAQ'
import CTABanner from '@/components/CTABanner'
import Footer from '@/components/Footer'

export default function HomeClient() {
  return (
    <div className="font-switzer text-gray flex min-h-screen flex-col bg-white text-base font-normal antialiased">
      <Header />

      <div className="grow">
        <div className="relative">
          <section id="home">
            <HeroSlider />
          </section>
          <section id="search">
            <SearchForm />
          </section>
        </div>
        <section id="destinations">
          <GlobalDestinations />
        </section>
        <section id="why-choose-us">
          <WhyChooseUs />
        </section>
        <section id="offers">
          <OfferBanner />
        </section>
        <section id="faq">
          <FAQ />
        </section>
        <CTABanner />
        <Footer />
      </div>
    </div>
  )
}

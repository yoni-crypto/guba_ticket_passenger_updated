'use client'
import { Phone, Instagram, MessageCircle, Facebook, MoveUpRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="after:from-blue after:to-blue/80 relative mt-auto bg-[url('/footer-banner.jpg')] bg-cover bg-no-repeat text-white after:absolute after:inset-0 after:bg-gradient-to-l sm:after:from-40%">
      <div className="relative z-10 container mx-auto px-4">
        <div className="flex flex-col justify-between gap-10 pt-12 lg:pt-16 xl:flex-row">
          <div className="flex flex-col justify-between gap-8 sm:flex-row lg:gap-10">
            <div>
              <Link href="/" className="inline-flex shrink-0">
                <div className="text-2xl font-bold text-white">
                  GubaBus
                </div>
              </Link>
              <p className="mt-2 mb-4 text-sm font-medium lg:mb-6">
                Your trusted bus booking platform
              </p>

              <div className="flex items-center gap-4">
                <Link href="tel:+441512223344" target="_blank" className="grid size-7.5 place-content-center rounded-full bg-white/20 text-white transition hover:opacity-80">
                  <Phone className="size-4.5 shrink-0" />
                </Link>
                <Link href="https://instagram.com" target="_blank" className="grid size-7.5 place-content-center rounded-full bg-white/20 text-white transition hover:opacity-80">
                  <Instagram className="size-4.5 shrink-0" />
                </Link>
                <Link href="mailto:support@example.com" target="_blank" className="grid size-7.5 place-content-center rounded-full bg-white/20 text-white transition hover:opacity-80">
                  <MessageCircle className="size-4.5 shrink-0" />
                </Link>
                <Link href="https://www.facebook.com" target="_blank" className="grid size-7.5 place-content-center rounded-full bg-white/20 text-white transition hover:opacity-80">
                  <Facebook className="size-4.5 shrink-0" />
                </Link>
              </div>
            </div>
            <div className="w-full space-y-5 sm:max-w-93 lg:space-y-6 xl:hidden">
              <h2 className="text-2xl">Newsletter</h2>
              <div className="space-y-4">
                <form className="relative">
                  <input
                    type="email"
                    className="w-full rounded-full border-0 bg-white py-3 pr-14 pl-4 text-base text-black outline-none placeholder:text-[#848381]"
                    placeholder="Enter your email"
                  />
                  <button type="submit" className="group absolute top-1/2 right-4 -translate-y-1/2 text-black">
                    <MoveUpRight className="size-8 shrink-0 transition duration-300 group-hover:rotate-45" />
                  </button>
                </form>
                <p className="text-sm">
                  Stay updated with our latest offers and news
                </p>
              </div>
            </div>
          </div>

          <div className="grid w-full grid-cols-2 gap-5 gap-y-10 md:flex md:justify-between lg:gap-8 xl:w-auto xl:justify-center 2xl:gap-14">
            <div className="space-y-3.5 sm:space-y-5 lg:space-y-6 2xl:min-w-33.5">
              <h2 className="text-xl">Quick Links</h2>
              <div className="flex flex-col items-start gap-2 sm:gap-3 lg:gap-4">
                <Link href="/" className="footer-links">Home</Link>
                <Link href="/search" className="footer-links">Search Tickets</Link>
                <Link href="/my-tickets" className="footer-links">My Tickets</Link>
                <a href="http://196.190.220.187:3000" target="_blank" rel="noopener noreferrer" className="footer-links">Bus Company Portal</a>
              </div>
            </div>


          </div>

          <div className="hidden w-full max-w-93 space-y-5 lg:space-y-6 xl:block">
            <h2 className="text-2xl">Newsletter</h2>
            <div className="space-y-4">
              <form className="relative">
                <input
                  type="email"
                  className="w-full rounded-full border-0 bg-white py-3 pr-14 pl-4 text-base text-black outline-none placeholder:text-[#848381]"
                  placeholder="Enter your email"
                />
                <button type="submit" className="group absolute top-1/2 right-4 -translate-y-1/2 text-black">
                  <MoveUpRight className="size-8 shrink-0 transition duration-300 group-hover:rotate-45" />
                </button>
              </form>
              <p className="text-sm">
                By subscribing you agree to with our{' '}
                <Link href="/privacy-policy" className="font-medium underline hover:no-underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse items-center justify-between gap-5 py-7.5 md:flex-row">
          <div className="text-center text-base">
            © {currentYear} GubaBus. All rights reserved.
          </div>

        </div>
      </div>
    </footer>
  )
}

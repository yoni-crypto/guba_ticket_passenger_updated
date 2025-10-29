'use client'
import { MoveUpRight } from 'lucide-react'
import Link from 'next/link'

export default function CTABanner() {
  return (
    <div className="relative bg-[url('/cta-banner.jpg')] bg-cover bg-center bg-no-repeat py-16 lg:py-47.5">
      <span className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/60 to-black/40"></span>
      <div className="relative container mx-auto px-4 text-center text-white">
        <div className="mb-8 space-y-4 lg:mb-12">
          <h2 className="w-full text-2xl font-medium sm:text-3xl lg:text-4xl xl:text-5xl">
            Are You a{' '}
            <span className="font-playfair italic">Bus Company?</span>{' '}
            <span className="block">
              Want to{' '}
              <span className="font-playfair italic">Work With Us?</span>
            </span>
          </h2>
          <p className="mx-auto w-full max-w-186 lg:text-lg">
            Register as a bus company to add trips, manage schedules, and reach thousands of passengers across Ethiopia.
          </p>
        </div>
        <a href="http://196.190.220.187:3000" target="_blank" rel="noopener noreferrer" className="btn bg-white/20 text-white px-4 py-2 rounded-full flex items-center gap-2 w-fit mx-auto hover:bg-white/30 transition">
          Register Now
          <MoveUpRight className="size-4" />
        </a>
      </div>
    </div>
  )
}

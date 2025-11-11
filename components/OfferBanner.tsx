'use client'
import { MoveUpRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

export default function OfferBanner() {
  const { t } = useTranslation('home')
  return (
    <div className="bg-[radial-gradient(50%_190.38%_at_55.72%_50%,_rgba(0,117,149,0.1)_0%,_rgba(255,255,255,0.1)_100%)] py-12 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="relative flex flex-col items-center justify-between overflow-hidden rounded-3xl bg-[url('/offer-banner.jpg')] bg-cover bg-no-repeat px-4 text-white lg:flex-row lg:items-end lg:gap-5 lg:pl-10 xl:pr-10 2xl:pr-12.5 2xl:pl-21">
          <span className="absolute inset-0 -z-0 bg-gradient-to-b from-black/70 to-transparent"></span>
          
          <div className="relative max-w-129.75 space-y-4 pt-10 pb-5 text-center lg:py-10 lg:text-left xl:space-y-6">
            <div>
              <h2 className="text-5xl font-bold xl:text-[58px]">
                {t('offers.title')}
              </h2>
              <h3 className="text-2xl xl:text-[40px]">
                {t('offers.subtitle')}
              </h3>
            </div>
            <p className="xl:text-2xl">
              {t('offers.description')}
            </p>
            <Link href="/destination" className="btn bg-white/20 text-white px-4 py-2 rounded-full flex items-center gap-2 w-fit hover:bg-white/30 transition">
              {t('offers.bookNow')}
              <MoveUpRight className="size-4" />
            </Link>
          </div>
          
          <Image 
            src="/offer-img.png" 
            alt="offer-img"
            width={400}
            height={300}
            className="relative z-10 h-full w-120 xl:w-auto xl:object-contain" 
          />
        </div>
      </div>
    </div>
  )
}

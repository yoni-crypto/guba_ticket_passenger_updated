'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade } from 'swiper/modules'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/effect-fade'

interface Slide {
  image: string
  location: string
}

export default function HeroSlider() {
  const { t } = useTranslation('home')
  const slides: Slide[] = [
    { image: 'https://images.unsplash.com/photo-1624314138470-5a2f24623f10?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YWRkaXMlMjBhYmFiYXxlbnwwfHwwfHx8MA%3D%3D&fm=jpg&q=60&w=3000', location: 'Addis Ababa' },
    // { image: 'https://t4.ftcdn.net/jpg/05/42/28/95/360_F_542289514_Sz8JkFAWX2L0btgmEdTce9tYgT6CKOek.jpg', location: 'BahirDar' },
    { image: 'https://images.pexels.com/photos/30177512/pexels-photo-30177512/free-photo-of-addis-ababa-skyline-at-sunset.jpeg', location: 'Addis Ababa' },
  ]

  return (
    <div className="relative h-[550px] sm:h-[600px] lg:h-[700px]">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        className="absolute inset-0 h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="relative">
            <Image
              src={slide.image}
              alt="hero-banner"
              fill
              className="object-cover"
              priority={index === 0}
            />
            <span className="absolute inset-0 z-2 bg-gradient-to-b from-[#013248]/50 to-transparent"></span>
            <span className="absolute inset-0 z-2 bg-gradient-to-t from-[#007595] via-[#007595]/20 to-transparent"></span>
            <div className="absolute inset-0 container mx-auto px-4">
              <div className="vertical-text absolute top-24 left-1/2 z-30 -translate-x-1/2 bg-gradient-to-b from-white to-transparent bg-clip-text text-4xl text-transparent sm:top-22 sm:text-5xl lg:top-1/2 lg:-right-12 lg:left-auto lg:-translate-x-0 lg:-translate-y-1/2 lg:bg-gradient-to-r lg:text-6xl/16 xl:text-[80px]/16">
                {slide.location}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="absolute inset-0 z-20 flex items-end">
        <div className="container mx-auto px-4 pb-20 sm:pb-24 lg:pb-32">
          <h1 className="mx-auto mb-6 max-w-220 text-center text-[26px]/9 text-white sm:mb-10 sm:text-4xl/10 lg:mb-16 lg:px-10 lg:text-5xl/15 xl:text-[56px]/19 2xl:px-0">
            {t('hero.title')}
            <span className="font-playfair font-medium italic"> {t('hero.titleItalic')} </span>
            <span className="block">
              {t('hero.subtitle')}
              <span className="font-playfair font-medium italic"> {t('hero.subtitleItalic')} </span>
            </span>
            <span className="block">
              {t('hero.subtitle2')}
              <span className="font-playfair font-medium italic"> {t('hero.subtitle2Italic')}</span>
            </span>
          </h1>
        </div>
      </div>
    </div>
  )
}

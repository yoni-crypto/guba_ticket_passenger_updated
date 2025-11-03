'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import { ChevronLeft, ChevronRight, Luggage, MoveUpRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import 'swiper/css'
import 'swiper/css/navigation'

interface Destination {
  image: string
  title: string
  description: string
  routes: string
}

export default function GlobalDestinations() {
  const destinations: Destination[] = [
    {
      image: 'https://images.pexels.com/photos/30177512/pexels-photo-30177512/free-photo-of-addis-ababa-skyline-at-sunset.jpeg',
      title: 'Addis Ababa',
      description: 'Ethiopia\'s bustling capital - gateway to all major cities with daily departures.',
      routes: '15+ Daily Routes'
    },
    {
      image: 'https://t3.ftcdn.net/jpg/03/18/86/74/360_F_318867476_VYMDqlKgnMmZ3m28lRuerk0bf54765vR.jpg',
      title: 'Bahir Dar',
      description: 'Scenic lakeside city with comfortable bus services and beautiful routes.',
      routes: '8+ Daily Routes'
    },
    {
      image: 'https://t3.ftcdn.net/jpg/00/31/25/88/360_F_31258890_tmzotBg1byBPaGgCX11iYhuBS34GAcut.jpg',
      title: 'Gondar',
      description: 'Historic city accessible via modern buses through stunning highland scenery.',
      routes: '6+ Daily Routes'
    },
    {
      image: 'https://media.istockphoto.com/id/186914973/photo/obelisk-in-the-aksum-kingdom-ethiopia.jpg?s=612x612&w=0&k=20&c=xcINJxnz71uvfROg0uby9QrRlyNeQesLkWr5JLnXmGE=',
      title: 'Axum',
      description: 'Ancient city connected with reliable bus services to major destinations.',
      routes: '5+ Daily Routes'
    },
    {
      image: 'https://media.istockphoto.com/id/186914973/photo/obelisk-in-the-aksum-kingdom-ethiopia.jpg?s=612x612&w=0&k=20&c=xcINJxnz71uvfROg0uby9QrRlyNeQesLkWr5JLnXmGE=',
      title: 'Hawwasa',
      description: 'Coffee capital with frequent bus connections through scenic landscapes.',
      routes: '10+ Daily Routes'
    }
  ]

  return (
    <div className="bg-blue py-12 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5 lg:mb-12">
          <div className="space-y-3 lg:space-y-4">
            <span className="inline-block rounded-full bg-white/20 px-3 py-1.5 text-sm text-white lg:px-4 lg:py-2.5 lg:text-lg">
              Popular Destinations
            </span>
            <h2 className="w-full max-w-185.75 text-2xl font-medium text-white sm:text-3xl lg:text-4xl xl:text-5xl">
              Travel to{' '}
              <span className="font-playfair italic">amazing</span>{' '}
              cities
              <span className="block">
                across{' '}
                <span className="font-playfair italic">Ethiopia with comfort.</span>
              </span>
            </h2>
          </div>
          <div className="ml-auto flex gap-2">
            <button className="global-destinations-button-prev grid size-10 place-content-center rounded-full bg-white/20 text-white transition hover:text-white/70">
              <ChevronLeft className="size-6" />
            </button>
            <button className="global-destinations-button-next grid size-10 place-content-center rounded-full bg-white/20 text-white transition hover:text-white/70">
              <ChevronRight className="size-6" />
            </button>
          </div>
        </div>

        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: '.global-destinations-button-prev',
            nextEl: '.global-destinations-button-next',
          }}
          slidesPerView="auto"
          spaceBetween={20}
          className="global-destinations-swiper"
        >
          {destinations.map((destination, index) => (
            <SwiperSlide key={index} className="!w-fit">
              <div className="group relative h-96 w-66 overflow-hidden rounded-3xl text-white transition-all duration-300 hover:w-75 lg:h-125 lg:w-85 lg:hover:w-95">
                <Image
                  src={destination.image}
                  alt={destination.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex flex-col justify-between">
                  <div className="p-4 text-center lg:p-6">
                    <span className="inline-flex w-fit gap-2 rounded-full bg-black/20 px-4 py-2.5 text-sm shadow-lg lg:text-lg">
                      <Luggage className="size-5 shrink-0 lg:size-6" />
                      {destination.routes}
                    </span>
                  </div>

                  <div className="relative z-1 bg-gradient-to-t from-black/80 from-10% via-black/20">
                    <span className="absolute inset-0 -z-1 backdrop-blur-[20px]"></span>
                    <div className="relative space-y-3 p-4 pt-6 lg:space-y-4 lg:p-6 lg:pt-12">
                      <h3 className="text-2xl lg:text-[32px]">
                        {destination.title}
                      </h3>
                      <p className="line-clamp-2">
                        {destination.description}
                      </p>
                      <Link href="/search" className="btn w-full flex items-center justify-between bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition">
                        Book to {destination.title}
                        <MoveUpRight className="size-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

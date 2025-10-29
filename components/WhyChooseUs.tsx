'use client'
import { Bus, Shield, Clock } from 'lucide-react'
import Image from 'next/image'

export default function WhyChooseUs() {
  const features = [
    {
      icon: Bus,
      title: 'Modern Fleet',
      description: 'Travel in comfort with our well-maintained buses equipped with comfortable seats and air conditioning.'
    },
    {
      icon: Shield,
      title: 'Safe & Reliable',
      description: 'Your safety is our priority. All our buses are regularly inspected and driven by experienced, licensed drivers.'
    },
    {
      icon: Clock,
      title: 'Easy Booking & Support',
      description: 'Book your tickets online in minutes with secure payment. Get 24/7 customer support for any assistance you need.'
    }
  ]

  return (
    <div className="bg-[url('/choose-us-bg.png')] bg-cover bg-center bg-no-repeat py-12 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex flex-col justify-between gap-4 lg:mb-20 xl:flex-row xl:items-end">
          <div className="w-full space-y-4">
            <span className="bg-blue/10 text-blue inline-block rounded-full px-3 py-1.5 text-sm lg:px-4 lg:py-2.5 lg:text-lg">
              Why choose us
            </span>
            <h2 className="w-full max-w-122.5 text-2xl font-medium text-black sm:text-3xl lg:text-4xl xl:text-5xl">
              Comfortable{' '}
              <span className="font-playfair italic">travel</span>{' '}
              with{' '}
              <span className="font-playfair italic">reliable</span>{' '}
              service{' '}
              <span className="font-playfair italic">guaranteed.</span>
            </h2>
          </div>
          <p className="text-gray w-full max-w-150 lg:text-lg">
            Experience hassle-free bus travel across Ethiopia with affordable prices, convenient schedules, and excellent customer service.
          </p>
        </div>

        <div className="flex flex-col justify-between gap-7 sm:gap-10 lg:flex-row xl:gap-20 2xl:gap-31">
          <div className="relative grow">
            <div className="relative z-1 mx-auto w-full max-w-150 lg:mr-0 lg:-mb-10 lg:-ml-7 lg:max-w-178">
              <Image 
                src="/choose-us-img.png" 
                alt="choose us" 
                width={600}
                height={400}
                className="h-full w-full" 
              />
            </div>
            <Image 
              src="/map-line.png" 
              alt="map line"
              width={600}
              height={400}
              className="absolute -top-5 left-1/2 w-150 -translate-x-1/2 sm:-top-10 lg:-left-5 lg:w-full lg:shrink-0 lg:-translate-x-0 2xl:-top-24 2xl:h-166.75" 
            />
          </div>

          <div className="text-gray relative w-full space-y-4 lg:max-w-120 xl:max-w-150">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-light flex flex-col gap-4 rounded-3xl p-4 sm:flex-row sm:px-5 xl:px-8 xl:py-6">
                <div className="grid size-14 shrink-0 place-content-center rounded-2xl bg-black/5 text-black sm:size-21">
                  <feature.icon className="size-9 stroke-[1.5px] sm:size-13.5" />
                </div>
                <div className="space-y-2.5 xl:space-y-4">
                  <h3 className="text-lg text-black lg:text-xl">
                    {feature.title}
                  </h3>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

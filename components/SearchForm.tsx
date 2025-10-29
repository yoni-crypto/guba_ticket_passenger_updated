'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { fetchCities } from '@/lib/redux/features/citySlice'

export default function SearchForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const { cities, loading } = useAppSelector((state) => state.city)
  
  const [origin, setOrigin] = useState<string>('')
  const [originGuid, setOriginGuid] = useState<string>('')
  const [destination, setDestination] = useState<string>('')
  const [destinationGuid, setDestinationGuid] = useState<string>('')
  const [departureDate, setDepartureDate] = useState<string>('')
  
  const [originSearch, setOriginSearch] = useState<string>('')
  const [destinationSearch, setDestinationSearch] = useState<string>('')
  const [showOriginDropdown, setShowOriginDropdown] = useState(false)
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false)
  
  const originRef = useRef<HTMLDivElement>(null)
  const destinationRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    dispatch(fetchCities({ pageSize: 200 }))
  }, [dispatch])

  useEffect(() => {
    const originParam = searchParams.get('origin')
    const destinationParam = searchParams.get('destination')
    const dateParam = searchParams.get('date')
    
    if (originParam) setOriginGuid(originParam)
    if (destinationParam) setDestinationGuid(destinationParam)
    if (dateParam) setDepartureDate(dateParam)
  }, [searchParams])

  useEffect(() => {
    if (originGuid && cities.length > 0) {
      const city = cities.find(c => c.cityGuid === originGuid)
      if (city) setOrigin(city.name)
    }
  }, [originGuid, cities])

  useEffect(() => {
    if (destinationGuid && cities.length > 0) {
      const city = cities.find(c => c.cityGuid === destinationGuid)
      if (city) setDestination(city.name)
    }
  }, [destinationGuid, cities])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (originRef.current && !originRef.current.contains(event.target as Node)) {
        setShowOriginDropdown(false)
      }
      if (destinationRef.current && !destinationRef.current.contains(event.target as Node)) {
        setShowDestinationDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredOriginCities = cities.filter(city => 
    city.name.toLowerCase().includes(originSearch.toLowerCase())
  )
  
  const filteredDestinationCities = cities.filter(city => 
    city.name.toLowerCase().includes(destinationSearch.toLowerCase())
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (originGuid && destinationGuid && departureDate) {
      router.push(`/search?origin=${originGuid}&destination=${destinationGuid}&date=${departureDate}`)
    }
  }

  return (
    <div className="relative z-20 container mx-auto px-4 -mt-32">
      <form onSubmit={handleSubmit} className="relative z-20 flex w-full flex-col gap-6 rounded-2xl bg-white px-4 py-5 sm:px-8 lg:mx-auto lg:max-w-273 lg:flex-row lg:items-center lg:rounded-full lg:py-4 xl:gap-6">
          
        <div className="flex grow flex-col gap-3 lg:flex-row lg:gap-4 xl:gap-6">
          <div ref={originRef} className="relative w-full space-y-1 lg:space-y-2">
            <label className="block font-medium">From</label>
            <input
              type="text"
              placeholder="Origin City"
              value={origin || originSearch}
              onChange={(e) => {
                setOriginSearch(e.target.value)
                setOrigin('')
                setShowOriginDropdown(true)
              }}
              onFocus={() => setShowOriginDropdown(true)}
              className="w-full text-lg/6 font-medium text-black border-0 outline-none lg:text-xl/6.5"
            />
            {showOriginDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
                {loading ? (
                  <div className="p-4 text-center text-gray-500">Loading cities...</div>
                ) : filteredOriginCities.length > 0 ? (
                  filteredOriginCities.map((city) => (
                    <div
                      key={city.cityGuid}
                      onClick={() => {
                        setOrigin(city.name)
                        setOriginGuid(city.cityGuid)
                        setOriginSearch('')
                        setShowOriginDropdown(false)
                      }}
                      className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                    >
                      <div className="font-medium">{city.name}</div>
                      <div className="text-sm text-gray-500">{city.region.name}</div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">No cities found</div>
                )}
              </div>
            )}
          </div>
          <span className="via-gray/50 bg-gray/20 block h-px shrink-0 from-white to-white lg:h-auto lg:w-0.5 lg:bg-gradient-to-t"></span>
          
          <div ref={destinationRef} className="relative w-full space-y-1 lg:space-y-2">
            <label className="block font-medium">To</label>
            <input
              type="text"
              placeholder="Destination City"
              value={destination || destinationSearch}
              onChange={(e) => {
                setDestinationSearch(e.target.value)
                setDestination('')
                setShowDestinationDropdown(true)
              }}
              onFocus={() => setShowDestinationDropdown(true)}
              className="w-full text-lg/6 font-medium text-black border-0 outline-none lg:text-xl/6.5"
            />
            {showDestinationDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
                {loading ? (
                  <div className="p-4 text-center text-gray-500">Loading cities...</div>
                ) : filteredDestinationCities.length > 0 ? (
                  filteredDestinationCities.map((city) => (
                    <div
                      key={city.cityGuid}
                      onClick={() => {
                        setDestination(city.name)
                        setDestinationGuid(city.cityGuid)
                        setDestinationSearch('')
                        setShowDestinationDropdown(false)
                      }}
                      className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                    >
                      <div className="font-medium">{city.name}</div>
                      <div className="text-sm text-gray-500">{city.region.name}</div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">No cities found</div>
                )}
              </div>
            )}
          </div>
          <span className="via-gray/50 bg-gray/20 block h-px shrink-0 from-white to-white lg:h-auto lg:w-0.5 lg:bg-gradient-to-t"></span>
          
          <div className="w-full space-y-1 lg:space-y-2">
            <label className="block font-medium">Departure Date</label>
            <input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              className="w-full text-lg/6 font-medium text-black border-0 outline-none lg:text-xl/6.5"
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary flex items-center gap-2">
          <Search className="size-4" />
          Search
        </button>
      </form>
    </div>
  )
}

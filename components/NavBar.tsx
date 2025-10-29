'use client'
import { useState, useEffect, useRef } from 'react'
import { Menu, X, MoveUpRight, User, LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { logout, loadFromStorage } from '@/lib/redux/features/authSlice'
import AuthModal from './AuthModal'
import toast from 'react-hot-toast'

export default function NavBar() {
  const dispatch = useAppDispatch()
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    dispatch(loadFromStorage())
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [dispatch])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    dispatch(logout())
    toast.success('Logged out successfully')
    setShowUserMenu(false)
  }

  const navItems = [
    { href: '/', label: 'Home', section: 'home' },
    { href: '/search', label: 'Search', section: 'search' },
    { href: '/my-tickets', label: 'My Tickets', section: 'tickets' },
    { href: '#destinations', label: 'Destinations', section: 'destinations' },
    { href: '#why-choose-us', label: 'Why Choose Us', section: 'why-choose-us' },
    { href: '#offers', label: 'Offers', section: 'offers' },
    { href: '#faq', label: 'FAQ', section: 'faq' },
  ]

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
        setShowMenu(false)
      }
    }
  }

  return (
    <header className={`fixed inset-x-0 z-50 duration-300 transition-all bg-white shadow-md pt-0`}>
      <div className={`${showMenu ? 'block' : 'hidden'} overlay fixed inset-0 z-40 bg-white/10 backdrop-blur-md`} onClick={() => setShowMenu(false)}></div>
      
      <div className="container mx-auto flex items-center justify-between gap-5 py-2.5 px-4">
        <Link href="/" className="inline-flex shrink-0">
          <div className="text-2xl font-bold text-black">
            GubaBus
          </div>
        </Link>

        <nav className={`fixed top-0 -right-full z-50 flex h-screen w-80 flex-col gap-0 overflow-x-hidden overflow-y-auto bg-white/70 pb-5 shadow-sm backdrop-blur-xs transition-all duration-500 xl:static xl:right-auto xl:h-auto xl:w-auto xl:flex-row xl:items-center xl:overflow-hidden xl:bg-transparent xl:p-0 xl:shadow-none xl:backdrop-blur-none ${showMenu ? 'right-0' : ''}`}>
          
          <div className="sticky top-0 z-50 flex shrink-0 justify-between bg-white p-5 shadow-2xs backdrop-blur-xs xl:hidden xl:p-0">
            <Link href="/" className="inline-flex">
              <div className="text-2xl font-bold text-black">
                GubaBus
              </div>
            </Link>
            <button onClick={() => setShowMenu(false)} className="group cursor-pointer text-black transition hover:opacity-70">
              <X className="size-5 shrink-0" />
            </button>
          </div>

          <ul className="flex flex-col justify-center gap-2 p-5 xl:flex-row xl:items-center xl:rounded-full xl:px-2 xl:py-2.5 xl:bg-transparent xl:backdrop-blur-none">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href === '/' && pathname === '/')
              return (
                <li key={item.href}>
                  <Link 
                    href={item.href} 
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`relative inline-flex items-center gap-2.5 rounded-full px-4 py-2.5 text-base font-medium whitespace-nowrap transition-colors duration-300 ${
                      isActive ? 'bg-white text-black xl:bg-white xl:text-black' : ''
                    } text-black hover:bg-white/40 hover:text-black`}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2.5">
          {isAuthenticated && user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all"
              >
                <div className="size-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </div>
                <span className="font-medium text-black">
                  {user.firstName}
                </span>
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-gray-500">{user.email || user.countryCode + user.mobileNumber}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="size-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={() => setShowAuthModal(true)}
              className="btn btn-primary flex items-center gap-2 px-4 py-2 rounded-full"
            >
              Login
              <MoveUpRight className="size-4" />
            </button>
          )}
          <button onClick={() => setShowMenu(!showMenu)} className="group cursor-pointer text-black transition hover:opacity-70 xl:hidden">
            <Menu className="size-6 shrink-0" />
          </button>
        </div>
      </div>
      
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </header>
  )
}
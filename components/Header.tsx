'use client'
import { useState, useEffect, useRef } from 'react'
import { Menu, X, MoveUpRight, User, LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { logout, loadFromStorage } from '@/lib/redux/features/authSlice'
import AuthModal from './AuthModal'
import { LanguageSwitcher } from './language-switcher'
import toast from 'react-hot-toast'

export default function Header() {
  const { t, i18n } = useTranslation(['navbar', 'auth'])
  const dispatch = useAppDispatch()
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const isOromo = i18n.language === 'or'

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
    toast.success(t('navbar:loggedOutSuccessfully'))
    setShowUserMenu(false)
  }

  const navItems = [
    { href: '/', label: t('navbar:home'), section: 'home' },
    { href: '/search', label: t('navbar:search'), section: 'search' },
    { href: '/my-tickets', label: t('navbar:myTickets'), section: 'tickets' },
    { href: '#destinations', label: t('navbar:destinations'), section: 'destinations' },
    { href: '#why-choose-us', label: t('navbar:whyChooseUs'), section: 'why-choose-us' },
    { href: '#offers', label: t('navbar:offers'), section: 'offers' },
    { href: '#faq', label: t('navbar:faq'), section: 'faq' },
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
    <header className={`fixed inset-x-0 z-50 duration-300 transition-all ${isScrolled ? 'pt-0 bg-white xl:backdrop-blur-xl shadow-md' : 'pt-3 lg:pt-10'}`}>
      <div className={`${showMenu ? 'block' : 'hidden'} overlay fixed inset-0 z-40 bg-white/10 backdrop-blur-md`} onClick={() => setShowMenu(false)}></div>
      
      <div className="container mx-auto flex items-center justify-between gap-5 py-2.5 px-4">
        <Link href="/" className="inline-flex shrink-0">
          <div className={`text-2xl font-bold transition-colors ${isScrolled ? 'text-black' : 'text-white'}`}>
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

          <ul className={`flex flex-col justify-center gap-2 p-5 xl:flex-row xl:items-center xl:rounded-full xl:px-2 xl:py-2.5 transition-all ${isScrolled ? 'xl:bg-transparent xl:backdrop-blur-none' : 'xl:bg-white/30 xl:backdrop-blur-xs'}`}>
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href === '/' && pathname === '/')
              return (
                <li key={item.href}>
                  <Link 
                    href={item.href} 
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`relative inline-flex items-center gap-2.5 rounded-full font-medium whitespace-nowrap transition-colors duration-300 ${
                      isOromo ? 'px-2.5 py-2 text-sm xl:text-sm' : 'px-4 py-2.5 text-base'
                    } ${
                      isActive ? (isScrolled ? 'bg-white text-black xl:bg-white xl:text-black' : 'text-blue bg-white xl:bg-white xl:text-black') : ''
                    } ${
                      isScrolled 
                        ? 'text-black hover:bg-white/40 hover:text-black' 
                        : 'text-black xl:text-white xl:hover:bg-white/40 xl:hover:text-black'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2.5">
          <LanguageSwitcher isScrolled={isScrolled} />
          {isAuthenticated && user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${isScrolled ? 'bg-gray-100 hover:bg-gray-200' : 'bg-white/20 hover:bg-white/30'}`}
              >
                <div className={`size-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium`}>
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </div>
                <span className={`font-medium ${isScrolled ? 'text-black' : 'text-white'}`}>
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
                    {t('navbar:logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={() => setShowAuthModal(true)}
              className={`btn flex items-center gap-2 px-4 py-2 rounded-full transition-all ${isScrolled ? 'btn-primary' : 'bg-white/20 text-white hover:bg-white/30'}`}
            >
              {t('navbar:login')}
              <MoveUpRight className="size-4" />
            </button>
          )}
          <button onClick={() => setShowMenu(!showMenu)} className={`group cursor-pointer transition hover:opacity-70 xl:hidden ${isScrolled ? 'text-black' : 'text-white'}`}>
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

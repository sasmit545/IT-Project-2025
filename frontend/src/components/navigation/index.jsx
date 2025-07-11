"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronDown, Menu, Settings, User, LogOut } from "lucide-react"
import PropTypes from "prop-types"
import { cn } from '../../lib/utils'
import { BuildingLibraryIcon } from '@heroicons/react/24/outline';
export default function Navigation({ userData, onMenuAction }) {
  const [isMobile, setIsMobile] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const mobileMenuRef = useRef(null)
  const userMenuRef = useRef(null)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }

      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleMenuItemClick = (action) => {
    onMenuAction(action)
    setUserMenuOpen(false)
    setMenuOpen(false)
  }

  const username = userData?.username || "User"
  const firstLetter = username.charAt(0).toUpperCase()

  return (
    <header className="sticky flex justify-center top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-18 items-center justify-between">



        <a href="/dashboard">
          <div className="logo">
            <span className="logo-square"></span>
            <span className="logo-text">SiteBuilder</span>
          </div>
        </a>

        <div className="flex items-center gap-4">
          {isMobile ? (
            <div ref={mobileMenuRef} className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-muted/50 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-full z-50 mt-2 w-56 origin-top-right rounded-lg border border-border bg-card text-card-foreground shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-in slide-in-from-top-5 fade-in-50">
                    <div className="p-2 space-y-1">
                      <button
                        onClick={() => handleMenuItemClick("profile")}
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        <User className="h-4 w-4" />
                        Profile
                      </button>
                      <button
                        onClick={() => handleMenuItemClick("settings")}
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </button>
                      <div className="h-px bg-border my-1" />
                      <button
                        onClick={() => handleMenuItemClick("logout")}
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-full border border-border bg-background px-2 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
                aria-label="User menu"
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-400 to-indigo-600 text-white shadow-sm",
                    userData?.avatar ? "p-0" : "p-2",
                  )}
                >
                  {userData?.avatar ? (
                    <img
                      src={userData.avatar || "/placeholder.svg"}
                      alt={username}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-medium">{firstLetter}</span>
                  )}
                </div>
                <span className="max-w-[100px] truncate">{username}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform duration-200",
                    userMenuOpen && "rotate-180",
                  )}
                />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-56 origin-top-right rounded-lg border border-border bg-card text-card-foreground shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-in slide-in-from-top-2 fade-in-50">
                  <div className="p-2 space-y-1">
                    <button
                      onClick={() => handleMenuItemClick("profile")}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </button>
                    <button
                      onClick={() => handleMenuItemClick("settings")}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </button>
                    <div className="h-px bg-border my-1" />
                    <button
                      onClick={() => handleMenuItemClick("logout")}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

// Add prop validation with PropTypes
Navigation.propTypes = {
  userData: PropTypes.shape({
    username: PropTypes.string,
    avatar: PropTypes.string,
  }),
  onMenuAction: PropTypes.func.isRequired,
}

// Default props
Navigation.defaultProps = {
  userData: {
    username: "User",
  },
}

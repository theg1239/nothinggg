"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-4 z-50 mx-4 rounded-full border border-gray-200 bg-white/60 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/60">
      <div className="container mx-auto max-w-7xl px-8 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <img src="/logo.svg" alt="logo" className="h-8 w-8" />
          <span className="text-xl font-bold">MCPVerse</span>
        </Link>
        <div className="hidden md:flex md:items-center md:space-x-4">
          <Button variant="outline" size="sm">
            Log In
          </Button>
          <Button size="sm" className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-700">
            Try MCPVerse
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="sr-only">Open main menu</span>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            <div className="mt-4 flex flex-col space-y-2 px-3">
              <Button variant="outline" size="sm" className="w-full justify-center">
                Log In
              </Button>
              <Button
                size="sm"
                className="w-full justify-center bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-700"
              >
                Try MCPVerse
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}


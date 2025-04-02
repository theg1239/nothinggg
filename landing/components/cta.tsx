"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useState } from "react"

export default function CTA() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setEmail("")
    }, 1500)
  }

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-1/3 left-1/4 w-1/2 h-1/2 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/3 right-1/4 w-1/2 h-1/2 rounded-full blur-[100px]"></div>
      </div>
      
      <div className="container px-4 md:px-6 mx-auto max-w-6xl">
        <div className="relative bg-gradient-to-r rounded-3xl border border-gray-800 p-8 md:p-12 shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r rounded-t-3xl"></div>
          
          <div className="md:flex items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Ready to transform your Git workflow?
              </h2>
              <p className="text-gray-400 md:text-lg mb-0">
                Join thousands of developers who are already saving time and reducing friction with GitConverse.
              </p>
            </div>
            
            <div className="md:w-1/2">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="sr-only">Email</label>
                    <input
                      type="email"
                      id="email"
                      placeholder="Enter your email"
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white py-3 rounded-xl font-medium hover:from-teal-400 hover:to-blue-400 transition-all flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <>
                        Get Early Access <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="bg-gray-800 border border-teal-500/50 rounded-xl p-6 text-center">
                  <svg className="w-12 h-12 text-teal-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <h4 className="text-xl font-bold text-white mb-2">You're on the list!</h4>
                  <p className="text-gray-400">We'll be in touch soon with early access instructions.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


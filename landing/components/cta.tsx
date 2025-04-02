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
                Join thousands of developers who are already saving time and reducing friction with MCPVerse.
              </p>
            </div>
            
            
          </div>
        </div>
      </div>
    </section>
  )
}


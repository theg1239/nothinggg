"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

const testimonials = [
  {
    quote: "GitConverse has completely transformed our team's workflow. Even junior developers can navigate complex Git operations with ease.",
    author: "Alex Johnson",
    role: "CTO at TechFlow",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    quote: "The natural language interface is a game-changer. I can't imagine going back to memorizing Git commands.",
    author: "Samantha Chen",
    role: "Lead Developer at Innovate Labs",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    quote: "The visualization features have helped our team understand our codebase's evolution in ways we never thought possible.",
    author: "Miguel Rodriguez",
    role: "Engineering Manager at DevSphere",
    avatar: "https://randomuser.me/api/portraits/men/67.jpg",
  },
]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFading, setIsFading] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length)
        setIsFading(false)
      }, 500)
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-24 bg-gradient-to-b from-black to-gray-900">
      <div className="container px-4 md:px-6 mx-auto max-w-6xl">
        <div className="relative">
          {/* Background elements */}
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
          
          <div className="max-w-3xl mx-auto">
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Loved by Developers
              </h2>
              <div className="h-1 w-16 bg-gradient-to-r from-teal-400 to-blue-500 mx-auto"></div>
            </div>
            
            <div className="relative">
              <div 
                className={`transition-opacity duration-500 ${isFading ? 'opacity-0' : 'opacity-100'}`}
              >
                <div className="bg-gray-900/50 backdrop-blur-sm p-8 md:p-10 rounded-2xl border border-gray-800">
                  <div className="mb-6">
                    <svg 
                      className="h-8 w-8 text-teal-500 mb-4" 
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z" />
                    </svg>
                    <p className="text-xl md:text-2xl text-white leading-relaxed">
                      {testimonials[currentIndex].quote}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="relative h-12 w-12 mr-4 rounded-full overflow-hidden">
                      <Image 
                        src={testimonials[currentIndex].avatar} 
                        alt={testimonials[currentIndex].author}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        {testimonials[currentIndex].author}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {testimonials[currentIndex].role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-center space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setIsFading(true)
                      setTimeout(() => {
                        setCurrentIndex(index)
                        setIsFading(false)
                      }, 500)
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      currentIndex === index 
                        ? 'bg-gradient-to-r from-teal-400 to-blue-500 w-8' 
                        : 'bg-gray-700'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

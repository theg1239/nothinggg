"use client"
import { MessageSquare, GitBranch, Clock, Brain, Layers, Zap } from "lucide-react"
import { useState } from "react"

const features = [
  {
    icon: <MessageSquare className="h-10 w-10 text-teal-600" />,
    title: "Natural Language Interface",
    description:
      "Translate plain English commands into Git and GitHub API operations without memorizing complex syntax.",
  },
  {
    icon: <Clock className="h-10 w-10 text-teal-600" />,
    title: "Time-lapse Visualization",
    description:
      "See your repository evolve over time with intuitive visualizations that make code history transparent.",
  },
  {
    icon: <Brain className="h-10 w-10 text-teal-600" />,
    title: "Context-Aware Operations",
    description:
      "MCP integration understands your repo history and structure before executing commands for smarter results.",
  },
  {
    icon: <GitBranch className="h-10 w-10 text-teal-600" />,
    title: "Repository History Replay",
    description: "Learn from your codebase by replaying repository history with relevant annotations and insights.",
  },
  {
    icon: <Layers className="h-10 w-10 text-teal-600" />,
    title: "Multi-App Scalability",
    description: "Our MCP architecture scales effortlessly across different applications beyond just Git operations.",
  },
  {
    icon: <Zap className="h-10 w-10 text-teal-600" />,
    title: "Productivity Boost",
    description: "Save time and reduce friction in your development workflow with intuitive Git interactions.",
  },
]

export default function Features() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  return (
    <section id="features" className="py-24 bg-black text-white overflow-hidden">
      <div className="container px-4 md:px-6 max-w-6xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
            Powerful Features for Modern Developers
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto">
            GitConverse combines natural language processing with powerful visualization tools to make Git more
            accessible and insightful.
          </p>
        </div>
        
        <div className="space-y-32">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`relative flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Feature icon/image area */}
              <div className="w-full md:w-1/2 mb-8 md:mb-0 flex justify-center">
                <div className={`relative transition-all duration-700 transform ${hoveredIndex === index ? 'scale-105' : 'scale-100'}`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-blue-500/20 rounded-3xl blur-3xl opacity-70 -z-10"></div>
                  <div className="bg-gray-900 p-12 rounded-2xl border border-gray-800 shadow-2xl">
                    <div className="w-24 h-24 flex items-center justify-center bg-gradient-to-br from-teal-500/20 to-blue-500/20 rounded-2xl">
                      {feature.icon}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Feature text area */}
              <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pl-16' : 'md:pr-16'}`}>
                <div className="h-px w-16 bg-gradient-to-r from-teal-500 to-blue-500 mb-6"></div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">{feature.title}</h3>
                <p className="text-gray-400 text-lg leading-relaxed">{feature.description}</p>
              </div>

              {/* Subtle animated gradient accent */}
              <div 
                className="absolute -z-10 w-full h-full opacity-0 transition-opacity duration-500"
                style={{ opacity: hoveredIndex === index ? 0.05 : 0 }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[150%] bg-gradient-to-r from-teal-500 to-blue-500 rounded-full blur-[100px]"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


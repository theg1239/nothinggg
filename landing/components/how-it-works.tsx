"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"

const steps = [
  {
    title: "Connect to your repository",
    description: "Link MCPVerse to your GitHub or GitLab repository with a simple authentication flow.",
    code: "$ git converse connect my-awesome-project",
  },
  {
    title: "Ask questions in simple language",
    description: "Simply type what you want to do in natural language. No need to remember Git commands.",
    code: "$ git converse \"Show me all commits by Sarah from last week\"",
  },
  {
    title: "Review and confirm actions",
    description: "MCPVerse shows what it's about to do and lets you confirm before making any changes.",
    code: "$ git converse \"Create a new branch from main and switch to it\"\n\n> I'll create a new branch from 'main' and check it out.\n> Branch name? feature/user-auth\n\n> Created branch 'feature/user-auth' from 'main'\n> Switched to branch 'feature/user-auth'",
  },
  {
    title: "Visualize your repository",
    description: "See your code history, branch structure, and collaborators' contributions in intuitive visualizations.",
    code: "$ git converse visualize --timeline --last-month",
  },
]

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0)

  return (
    <section id="how-it-works" className="py-24 text-white">
      <div className="container px-4 md:px-6 mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
            How It Works
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto">
            For now, MCPVerse simplifies complex Git operations into a natural, intuitive workflow.
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-8 items-center">
          {/* Steps list */}
          <div className="md:col-span-5">
            <div className="space-y-2">
              {steps.map((step, index) => (
                <button
                  key={index}
                  className={`w-full text-left p-4 rounded-xl transition-all ${
                    activeStep === index
                      ? "bg-gray-800 border border-gray-700"
                      : "hover:bg-gray-900"
                  }`}
                  onClick={() => setActiveStep(index)}
                >
                  <div className="flex items-center">
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        activeStep === index
                          ? "bg-gradient-to-r from-teal-500 to-blue-500 text-white"
                          : "bg-gray-800 text-gray-400"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <h3 className={`font-medium ${activeStep === index ? "text-white" : "text-gray-400"}`}>
                      {step.title}
                    </h3>
                    <ChevronRight 
                      className={`ml-auto h-5 w-5 transition-transform ${
                        activeStep === index ? "text-white rotate-90" : "text-gray-600"
                      }`} 
                    />
                  </div>
                  {activeStep === index && (
                    <p className="mt-3 ml-11 text-gray-400">
                      {step.description}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Terminal visualization */}
          <div className="md:col-span-7">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-blue-500/10 rounded-3xl blur-xl -z-10"></div>
              <div className="bg-gray-900 rounded-xl border border-gray-800 shadow-xl overflow-hidden">
                {/* Terminal header */}
                <div className="bg-gray-800 p-3 flex items-center border-b border-gray-700">
                  <div className="flex space-x-2 mr-3">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-xs text-gray-400 font-mono mx-auto">
                    Terminal - MCPVerse
                  </div>
                </div>
                {/* Terminal content */}
                <div className="p-4 font-mono text-sm overflow-x-auto">
                  <pre className="text-gray-300 whitespace-pre-wrap">{steps[activeStep].code}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


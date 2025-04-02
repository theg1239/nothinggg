import { ArrowRight } from "lucide-react"

const steps = [
  {
    number: "01",
    title: "Ask in Plain English",
    description:
      "Simply type your Git-related question or command in natural language, just like you'd ask a colleague.",
    color: "from-teal-400 to-teal-600",
  },
  {
    number: "02",
    title: "MCP Processes Your Request",
    description: "Our Model-Context-Prompt system analyzes your repository context and understands your intent.",
    color: "from-cyan-400 to-cyan-600",
  },
  {
    number: "03",
    title: "Execute with Precision",
    description:
      "GitConverse translates your request into the appropriate Git commands or API calls and executes them.",
    color: "from-blue-400 to-blue-600",
  },
  {
    number: "04",
    title: "Visualize & Learn",
    description: "See the results with helpful visualizations and explanations that help you understand what happened.",
    color: "from-indigo-400 to-indigo-600",
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-[58rem] text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">How GitConverse Works</h2>
          <p className="mb-16 text-gray-600 dark:text-gray-400 md:text-xl">
            Our innovative MCP architecture makes complex Git operations simple and intuitive.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br text-white shadow-md dark:shadow-gray-800/30">
                <div
                  className={`h-full w-full rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center`}
                >
                  <span className="font-bold">{step.number}</span>
                </div>
              </div>
              <div className="ml-16 pt-1">
                <h3 className="mb-2 text-xl font-bold">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="ml-6 mt-4 hidden md:block">
                  <ArrowRight className="h-6 w-6 rotate-90 text-gray-300 dark:text-gray-700 md:rotate-0" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


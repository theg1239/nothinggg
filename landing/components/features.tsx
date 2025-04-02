import { MessageSquare, GitBranch, Clock, Brain, Layers, Zap } from "lucide-react"

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
  return (
    <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-[58rem] text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Powerful Features for Modern Developers
          </h2>
          <p className="mb-16 text-gray-600 dark:text-gray-400 md:text-xl">
            GitConverse combines natural language processing with powerful visualization tools to make Git more
            accessible and insightful.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-950"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="mb-3 text-xl font-bold">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


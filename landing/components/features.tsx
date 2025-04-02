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
    <section id="features" className="py-20 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 overflow-hidden">
      <div className="container px-4 md:px-6 relative">
        <div className="absolute top-0 right-0 -translate-y-1/4 w-96 h-96 bg-teal-300/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/4 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl"></div>
        
        <div className="mx-auto max-w-[58rem] text-center relative z-10">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-blue-600 dark:from-teal-400 dark:to-blue-500">
            Powerful Features for Modern Developers
          </h2>
          <p className="mb-16 text-gray-600 dark:text-gray-400 md:text-xl">
            GitConverse combines natural language processing with powerful visualization tools to make Git more
            accessible and insightful.
          </p>
        </div>
        
        <div className="relative">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`
                relative z-10 flex mb-12 md:mb-8 group
                ${index % 2 === 0 ? 'md:ml-[5%]' : 'md:ml-[15%]'}
                ${index % 3 === 0 ? 'md:w-[75%]' : index % 3 === 1 ? 'md:w-[70%]' : 'md:w-[65%]'}
              `}
            >
              <div className="mr-6 relative">
                <div className="p-3 rounded-xl bg-white dark:bg-gray-800 shadow-lg transform group-hover:scale-110 transition-all duration-300">
                  {feature.icon}
                </div>
                <div className="h-full w-[1px] absolute top-16 left-1/2 bg-gradient-to-b from-teal-500 to-transparent"></div>
              </div>
              
              <div className="flex-1 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transform transition-all duration-300 hover:translate-x-1 hover:-translate-y-1 group-hover:shadow-xl">
                <h3 className="mb-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-blue-600 dark:from-teal-400 dark:to-blue-500">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-blue-600 opacity-0 group-hover:opacity-30 transition-opacity"></div>
              </div>
            </div>
          ))}
          
          <div className="absolute top-1/2 left-0 w-full h-1/2 bg-gradient-to-r from-teal-500/5 to-blue-600/5 -skew-y-6 -z-10"></div>
        </div>
      </div>
    </section>
  )
}


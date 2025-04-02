import { Code, Database, LineChart, MessageSquare, FileText, Settings } from "lucide-react"

const applications = [
  {
    icon: <Code className="h-8 w-8 text-teal-600" />,
    title: "Git & GitHub",
    description: "Manage repositories, branches, commits, and pull requests with natural language commands.",
  },
  {
    icon: <Database className="h-8 w-8 text-teal-600" />,
    title: "Database Management",
    description: "Query and manage databases using plain English instead of complex SQL syntax.",
  },
  {
    icon: <LineChart className="h-8 w-8 text-teal-600" />,
    title: "Analytics Platforms",
    description: "Generate reports and visualize data by describing what insights you're looking for.",
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-teal-600" />,
    title: "Team Communication",
    description: "Integrate with communication tools to automate updates and notifications.",
  },
  {
    icon: <FileText className="h-8 w-8 text-teal-600" />,
    title: "Documentation",
    description: "Generate, search, and update documentation using conversational queries.",
  },
  {
    icon: <Settings className="h-8 w-8 text-teal-600" />,
    title: "DevOps Tools",
    description: "Configure and manage CI/CD pipelines and infrastructure with simple commands.",
  },
]

export default function Applications() {
  return (
    <section id="applications" className="py-20">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-[58rem] text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Highly Scalable to Multiple Applications
          </h2>
          <p className="mb-16 text-gray-600 dark:text-gray-400 md:text-xl">
            MCPVerse's MCP architecture extends beyond Git to power natural language interfaces for various developer
            tools.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {applications.map((app, index) => (
            <div
              key={index}
              className="flex flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-950"
            >
              <div className="mb-4 rounded-full bg-teal-100 p-3 dark:bg-teal-900/30">{app.icon}</div>
              <h3 className="mb-2 text-xl font-bold">{app.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{app.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


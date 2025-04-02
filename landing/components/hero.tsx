import { Button } from "@/components/ui/button"
import { ArrowRight, Terminal, GitBranch, GitPullRequest } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[40%] -right-[60%] h-[800px] w-[800px] rounded-full bg-teal-100/20 blur-3xl dark:bg-teal-900/20"></div>
        <div className="absolute -bottom-[30%] -left-[10%] h-[600px] w-[600px] rounded-full bg-teal-100/20 blur-3xl dark:bg-teal-900/20"></div>
      </div>

      <div className="container px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-sm dark:border-gray-800 dark:bg-gray-950">
                <span className="mr-1 rounded-full bg-teal-600 px-1.5 py-0.5 text-xs font-medium text-white">New</span>
                <span className="text-gray-700 dark:text-gray-300">Introducing GitConverse MCP</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Git Commands in <span className="text-teal-600 dark:text-teal-500">Plain English</span>
              </h1>
              <p className="max-w-[600px] text-gray-600 dark:text-gray-400 md:text-xl">
                GitConverse translates natural language into Git operations, visualizes repository history, and scales
                across multiple applications with our innovative MCP architecture.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-700">
                Start Chatting Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Watch Demo
              </Button>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <div className="mr-2 h-1 w-1 rounded-full bg-teal-600"></div>
                <span className="text-gray-600 dark:text-gray-400">No Git expertise required</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 h-1 w-1 rounded-full bg-teal-600"></div>
                <span className="text-gray-600 dark:text-gray-400">Highly scalable architecture</span>
              </div>
            </div>
          </div>
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-[500px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-2 dark:border-gray-800 dark:bg-gray-800">
                <div className="flex space-x-1">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400">GitConverse Chat</div>
                <div></div>
              </div>
              <div className="space-y-4 p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                    <Terminal className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                  </div>
                  <div className="rounded-lg rounded-tl-none bg-gray-100 p-3 dark:bg-gray-800">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Show me the last 5 commits on the main branch
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900">
                    <GitBranch className="h-4 w-4 text-teal-700 dark:text-teal-300" />
                  </div>
                  <div className="rounded-lg rounded-tl-none bg-teal-100 p-3 dark:bg-teal-900/50">
                    <p className="text-sm text-teal-800 dark:text-teal-200">
                      Here are the last 5 commits on main:
                      <br />
                      <br />
                      1. Fix user authentication bug (2h ago)
                      <br />
                      2. Update README with new API docs (1d ago)
                      <br />
                      3. Implement dark mode toggle (2d ago)
                      <br />
                      4. Refactor database queries (3d ago)
                      <br />
                      5. Initial commit (5d ago)
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                    <Terminal className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                  </div>
                  <div className="rounded-lg rounded-tl-none bg-gray-100 p-3 dark:bg-gray-800">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Create a new branch called feature/login-page
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900">
                    <GitPullRequest className="h-4 w-4 text-teal-700 dark:text-teal-300" />
                  </div>
                  <div className="rounded-lg rounded-tl-none bg-teal-100 p-3 dark:bg-teal-900/50">
                    <p className="text-sm text-teal-800 dark:text-teal-200">
                      Branch 'feature/login-page' created successfully from 'main'. You can now switch to this branch
                      with:
                      <br />
                      <br />
                      <code className="rounded bg-teal-200/50 px-1 py-0.5 dark:bg-teal-800/50">
                        git checkout feature/login-page
                      </code>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


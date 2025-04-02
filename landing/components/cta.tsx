import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function CTA() {
  return (
    <section className="py-20 bg-teal-600 dark:bg-teal-900">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-[58rem] text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Ready to Transform Your Development Workflow?
          </h2>
          <p className="mb-8 text-xl text-teal-100">
            Join thousands of developers who are already using GitConverse to simplify Git operations and boost
            productivity.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-white text-teal-600 hover:bg-teal-50 dark:bg-white dark:text-teal-900 dark:hover:bg-gray-100"
            >
              Try GitConverse Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-teal-700 dark:border-white dark:text-white dark:hover:bg-teal-800"
            >
              Schedule a Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}


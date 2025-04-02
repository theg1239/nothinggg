import Link from "next/link"
import { Github, Twitter, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="container px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-teal-400 to-teal-600">
                <div className="absolute inset-1 rounded-full bg-white dark:bg-gray-900"></div>
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-teal-400 to-teal-600"></div>
              </div>
              <span className="text-xl font-bold">GitConverse</span>
            </Link>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Making Git operations intuitive through natural language and visualization.
            </p>
            <div className="mt-4 flex space-x-4">
              <Link href="#" className="text-gray-600 hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-500">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href="#" className="text-gray-600 hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-500">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-gray-600 hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-500">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#features"
                  className="text-sm text-gray-600 hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-500"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-600 hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-500"
                >
                  Integrations
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="text-sm text-gray-600 hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-500"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-600 hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-500"
                >
                  Changelog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-600 hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-500"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-600 hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-500"
                >
                  API Reference
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-600 hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-500"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-600 hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-500"
                >
                  Community
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-600 hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-500"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-600 hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-500"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-600 hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-500"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-600 hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-500"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
          <p className="text-center text-xs text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} GitConverse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}


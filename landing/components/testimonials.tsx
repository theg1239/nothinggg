import Image from "next/image"

const testimonials = [
  {
    quote:
      "GitConverse has completely transformed how our team interacts with Git. What used to take multiple complex commands now happens with a simple conversation.",
    author: "Alex Johnson",
    title: "Lead Developer at TechCorp",
    avatar: "/placeholder.svg?height=80&width=80",
  },
  {
    quote:
      "The time-lapse visualization feature is a game-changer for onboarding new team members. They can quickly understand how our codebase evolved over time.",
    author: "Samantha Lee",
    title: "Engineering Manager at StartupX",
    avatar: "/placeholder.svg?height=80&width=80",
  },
  {
    quote:
      "We've integrated GitConverse with our database management system, and now our analysts can query data using natural language. The scalability is impressive.",
    author: "Michael Chen",
    title: "CTO at DataDrive",
    avatar: "/placeholder.svg?height=80&width=80",
  },
]

export default function Testimonials() {
  return (
    <section className="py-20">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-[58rem] text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">What Our Users Say</h2>
          <p className="mb-16 text-gray-600 dark:text-gray-400 md:text-xl">
            Developers and teams are experiencing significant productivity gains with GitConverse.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950"
            >
              <div className="mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">
                    ★
                  </span>
                ))}
              </div>
              <p className="mb-6 text-gray-600 dark:text-gray-400">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <div className="mr-4 h-10 w-10 overflow-hidden rounded-full">
                  <Image
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.author}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">{testimonial.author}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


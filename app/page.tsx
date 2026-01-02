import { createClient } from "@/lib/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CalendarIcon, Clock, CheckCircle2, Layout, Zap, ArrowRight, Github } from "lucide-react"

export default async function Page() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-background">
      {/* Sidebar - Inspired by TaskFlow layout */}
      <aside className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-border p-6 flex flex-col gap-8 bg-card/30 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded bg-primary flex items-center justify-center">
            <Zap className="size-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">StudyFlow</span>
        </div>

        <nav className="flex flex-col gap-2">
          <Link
            href="#features"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-sm font-medium transition-colors"
          >
            <Layout className="size-4" /> Features
          </Link>
          <Link
            href="#how-it-works"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-sm font-medium transition-colors"
          >
            <Zap className="size-4" /> AI Agent
          </Link>
          <Link
            href="/auth/login"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-sm font-medium transition-colors"
          >
            <CheckCircle2 className="size-4" /> {user ? "Dashboard" : "Login"}
          </Link>
        </nav>

        <div className="mt-auto pt-6 border-t border-border flex flex-col gap-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Github className="size-3" /> v0.app / 2026
          </div>
        </div>
      </aside>

      {/* Main Content - Central Feed Layout */}
      <main className="flex-1 overflow-y-auto p-6 md:p-12 lg:p-20">
        <div className="max-w-3xl mx-auto flex flex-col gap-12">
          <header className="flex flex-col gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20 self-start">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              AI Agent Powered
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1]">
              Master your exams with <span className="text-muted-foreground">AI precision.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-xl">
              Upload your timetable, topics, and PYQs. Let our agent build the perfect systematic schedule for your
              success.
            </p>
          </header>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="h-12 px-8 text-base font-semibold rounded-full group">
              <Link href={user ? "/dashboard" : "/auth/sign-up"}>
                Get Started <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-8 text-base font-semibold rounded-full bg-transparent"
            >
              Explore Demo
            </Button>
          </div>

          <section id="features" className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-12 border-t border-border">
            <div className="p-6 rounded-2xl bg-card border border-border flex flex-col gap-4">
              <div className="size-10 rounded-xl bg-accent flex items-center justify-center">
                <CalendarIcon className="size-5 text-foreground" />
              </div>
              <h3 className="text-lg font-bold">Dynamic Restructuring</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Missed a topic? The AI agent automatically recalculates your entire timetable to ensure no subject is
                left behind.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border flex flex-col gap-4">
              <div className="size-10 rounded-xl bg-accent flex items-center justify-center">
                <Clock className="size-5 text-foreground" />
              </div>
              <h3 className="Deadline tracking">Deadline Guard</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Projects and assignments are automatically woven into your study plan, keeping everything balanced.
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Right Column - Utilities Sidebar */}
      <aside className="hidden xl:flex w-80 border-l border-border p-8 flex-col gap-10 bg-card/20">
        <div className="flex flex-col gap-2">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Current Time</div>
          <div className="text-4xl font-mono tabular-nums leading-none font-bold">08:05:24 AM</div>
          <div className="text-sm text-muted-foreground">Friday, January 2, 2026</div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Coming Up</div>
          <div className="space-y-3">
            {[
              { label: "Discrete Maths Exam", time: "In 2 days", color: "bg-blue-500" },
              { label: "AI Project Deadline", time: "Tonight", color: "bg-red-500" },
              { label: "Data Structures PYQ", time: "In 4 days", color: "bg-green-500" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border shadow-sm">
                <div className={`size-2 rounded-full ${item.color}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto p-6 rounded-2xl bg-primary text-primary-foreground flex flex-col gap-4 relative overflow-hidden group">
          <Zap className="absolute -right-4 -bottom-4 size-24 opacity-10 rotate-12 transition-transform group-hover:scale-110" />
          <h4 className="font-bold relative z-10">Agent Online</h4>
          <p className="text-xs opacity-90 relative z-10 leading-relaxed">
            Your personal study agent is ready to optimize your schedule. Connect your resources to begin.
          </p>
          <Button size="sm" variant="secondary" className="w-full relative z-10 font-bold">
            Activate AI
          </Button>
        </div>
      </aside>
    </div>
  )
}

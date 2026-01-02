import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { User } from "@supabase/supabase-js"
import { CalendarDays, Clock, BookOpen, AlertCircle, Bell, BrainCircuit, CheckCircle2, Sparkles } from "lucide-react"
import { format, isBefore } from "date-fns"
import { Button } from "@/components/ui/button"

interface OverviewProps {
  user: User
  stats: {
    examsCount: number
    topicsCount: number
    assignmentsCount: number
    nextExam: { subject: string; date: string } | null
  }
  todaySessions: any[]
  upcomingDeadlines: any[]
}

export function Overview({ user, stats, todaySessions, upcomingDeadlines }: OverviewProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user.user_metadata?.full_name || "Student"}
          </h1>
          <p className="text-muted-foreground">Your AI agent has optimized your study plan for today.</p>
        </div>
        {todaySessions.length === 0 && (
          <Button asChild className="w-fit">
            <a href="/timetable">
              <BrainCircuit className="mr-2 h-4 w-4" />
              Generate Study Plan
            </a>
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Focus</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaySessions.length * 1.5}h</div>
            <p className="text-xs text-muted-foreground">Scheduled for today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Exams</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.examsCount}</div>
            <p className="text-xs text-muted-foreground">
              {stats.nextExam
                ? `Next: ${stats.nextExam.subject} on ${format(new Date(stats.nextExam.date), "MMM d")}`
                : "No exams scheduled"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Topics Pending</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.topicsCount}</div>
            <p className="text-xs text-muted-foreground">To be covered</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assignments Due</CardTitle>
            <AlertCircle
              className={`h-4 w-4 ${stats.assignmentsCount > 0 ? "text-destructive" : "text-muted-foreground"}`}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.assignmentsCount}</div>
            <p className="text-xs text-muted-foreground">Active assignments</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Today's Optimized Schedule
            </CardTitle>
            <CardDescription>Your agent prioritized these sessions based on your exam importance.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todaySessions.length === 0 ? (
                <div className="text-sm text-muted-foreground italic py-8 text-center">
                  Nothing scheduled for today. Use "Restructure Plan" in the Timetable tab to generate a new schedule.
                </div>
              ) : (
                todaySessions.map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-20 text-sm text-muted-foreground">{format(new Date(item.start_time), "p")}</div>
                    <div
                      className={`flex-1 rounded-md border p-3 ${item.is_completed ? "bg-muted/50 opacity-60" : ""}`}
                    >
                      <div className={`font-medium ${item.is_completed ? "line-through" : ""}`}>
                        {item.topics?.title || "Study Session"}
                      </div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {item.is_completed ? "Completed" : "Scheduled"}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Agent Reminders
            </CardTitle>
            <CardDescription>Important notifications from your AI planner.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingDeadlines.length === 0 && todaySessions.every((s) => s.is_completed) ? (
                <div className="text-sm text-muted-foreground italic py-8 text-center flex flex-col items-center gap-2">
                  <CheckCircle2 className="h-8 w-8 text-primary/40" />
                  You're all caught up! No urgent reminders.
                </div>
              ) : (
                <div className="space-y-4">
                  {todaySessions.some((s) => !s.is_completed && isBefore(new Date(s.start_time), new Date())) && (
                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 animate-pulse">
                      <div className="flex items-center gap-2 text-sm font-semibold text-primary mb-1">
                        <Sparkles className="h-4 w-4" />
                        AI Agent Suggestion
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        I've noticed you missed some sessions. Click "Restructure Plan" in the Timetable tab and I'll
                        redistribute your topics to ensure you still meet your deadlines!
                      </p>
                    </div>
                  )}
                  {upcomingDeadlines.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/10"
                    >
                      <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                      <div>
                        <div className="text-sm font-medium">{item.title} is due soon!</div>
                        <div className="text-xs text-muted-foreground">
                          Deadline: {format(new Date(item.deadline), "PPP")}
                        </div>
                      </div>
                    </div>
                  ))}
                  {todaySessions
                    .filter((s) => !s.is_completed && isBefore(new Date(s.start_time), new Date()))
                    .map((item, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/10"
                      >
                        <Clock className="h-4 w-4 text-amber-500 mt-0.5" />
                        <div>
                          <div className="text-sm font-medium">Missed a session: {item.topics?.title}</div>
                          <div className="text-xs text-muted-foreground">
                            Was scheduled for {format(new Date(item.start_time), "p")}. Consider restructuring.
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

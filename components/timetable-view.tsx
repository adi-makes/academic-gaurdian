"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, RefreshCw, Loader2, CheckCircle2, Circle, AlertTriangle } from "lucide-react"
import { format, startOfToday, addDays, isSameDay, isBefore } from "date-fns"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/client"
import { Badge } from "@/components/ui/badge"

interface Session {
  id: string
  start_time: string
  end_time: string
  topic_id: string
  is_completed?: boolean // Added completion status
  topics?: { title: string; exams?: { subject: string } }
}

export function TimetableView({ initialSessions }: { initialSessions: Session[] }) {
  const [sessions, setSessions] = useState<Session[]>(initialSessions)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const toggleCompletion = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.from("study_sessions").update({ is_completed: !currentStatus }).eq("id", id)
      if (error) throw error
      setSessions(sessions.map((s) => (s.id === id ? { ...s, is_completed: !currentStatus } : s)))
      toast.success(currentStatus ? "Session marked as pending" : "Session marked as completed!")
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error("Failed to update session")
    }
  }

  const generateTimetable = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/generate-timetable", { method: "POST" })
      if (!res.ok) throw new Error("Failed to generate")
      toast.success("AI has generated a new study plan!")
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error("Generation failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const days = Array.from({ length: 7 }, (_, i) => addDays(startOfToday(), i))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">Your Study Plan</h2>
          <p className="text-sm text-muted-foreground">AI-powered scheduling based on your priorities.</p>
        </div>
        <Button onClick={generateTimetable} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : sessions.length > 0 ? (
            <RefreshCw className="mr-2 h-4 w-4" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          {sessions.length > 0 ? "Restructure Plan" : "Generate Plan"}
        </Button>
      </div>

      <div className="grid gap-6">
        {days.map((day) => {
          const daySessions = sessions.filter((s) => isSameDay(new Date(s.start_time), day))

          return (
            <div key={day.toISOString()} className="space-y-3">
              <h3 className="font-medium text-lg border-b pb-1">{format(day, "EEEE, MMMM do")}</h3>
              {daySessions.length === 0 ? (
                <p className="text-sm text-muted-foreground italic p-2">No study sessions scheduled.</p>
              ) : (
                <div className="grid gap-3">
                  {daySessions.map((session) => (
                    <Card key={session.id}>
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-sm font-mono text-muted-foreground w-32 flex flex-col">
                            <span>{format(new Date(session.start_time), "p")}</span>
                            <span className="text-[10px] opacity-60">to {format(new Date(session.end_time), "p")}</span>
                          </div>
                          <div className="flex flex-col">
                            <div className="font-medium flex items-center gap-2">
                              {session.topics?.title || "Study Session"}
                              {!session.is_completed && isBefore(new Date(session.start_time), new Date()) && (
                                <Badge
                                  variant="outline"
                                  className="text-[10px] text-amber-600 border-amber-200 bg-amber-50 gap-1 px-1.5 h-4"
                                >
                                  <AlertTriangle className="h-2.5 w-2.5" />
                                  Missed
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <span className="font-medium text-primary/70">
                                {session.topics?.exams?.subject || "General"}
                              </span>
                              <span className="opacity-40">•</span>
                              <span>AI Prioritized</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant={session.is_completed ? "outline" : "default"}
                          size="sm"
                          className="transition-all duration-300"
                          onClick={() => toggleCompletion(session.id, session.is_completed ?? false)}
                        >
                          {session.is_completed ? (
                            <Circle className="mr-2 h-4 w-4" />
                          ) : (
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                          )}
                          {session.is_completed ? "Mark as Pending" : "Mark as Completed"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

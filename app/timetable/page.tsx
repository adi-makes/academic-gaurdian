import { createClient } from "@/lib/server"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ExamsManager } from "@/components/exams-manager"
import { TimetableView } from "@/components/timetable-view"

export default async function TimetablePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch exams for the user
  const { data: exams } = await supabase
    .from("exams")
    .select("*")
    .eq("user_id", user.id)
    .order("exam_date", { ascending: true })

  // Fetch existing study sessions
  const { data: sessions } = await supabase
    .from("study_sessions")
    .select("*, topics(title, exams(subject))")
    .eq("user_id", user.id)
    .gte("start_time", new Date().toISOString())
    .order("start_time", { ascending: true })

  return (
    <DashboardLayout user={user}>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Exam Timetable</h1>
          <p className="text-muted-foreground">
            Manage your upcoming exam dates to help the AI plan your study schedule.
          </p>
        </div>
        <ExamsManager initialExams={exams || []} user={user} />

        <div className="border-t pt-8">
          <TimetableView initialSessions={sessions || []} />
        </div>
      </div>
    </DashboardLayout>
  )
}

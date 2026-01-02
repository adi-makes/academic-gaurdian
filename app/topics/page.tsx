import { createClient } from "@/lib/server"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { TopicsManager } from "@/components/topics-manager"

export default async function TopicsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch topics and exams
  const { data: topics } = await supabase.from("topics").select("*, exams(subject)").eq("user_id", user.id)

  const { data: exams } = await supabase.from("exams").select("id, subject").eq("user_id", user.id)

  return (
    <DashboardLayout user={user}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Study Topics</h1>
          <p className="text-muted-foreground">List the topics you need to cover for each exam.</p>
        </div>
        <TopicsManager initialTopics={topics || []} exams={exams || []} user={user} />
      </div>
    </DashboardLayout>
  )
}

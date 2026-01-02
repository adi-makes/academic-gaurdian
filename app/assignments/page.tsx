import { createClient } from "@/lib/server"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AssignmentsManager } from "@/components/assignments-manager"

export default async function AssignmentsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch assignments for the user
  const { data: assignments } = await supabase
    .from("assignments")
    .select("*")
    .eq("user_id", user.id)
    .order("deadline", { ascending: true })

  return (
    <DashboardLayout user={user}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Assignments & Projects</h1>
          <p className="text-muted-foreground">Keep track of your deadlines and set reminders for your coursework.</p>
        </div>
        <AssignmentsManager initialAssignments={assignments || []} user={user} />
      </div>
    </DashboardLayout>
  )
}

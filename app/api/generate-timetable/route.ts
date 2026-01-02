import { generateObject } from "ai"
import { z } from "zod"
import { createClient } from "@/lib/server"

const sessionSchema = z.object({
  topic_id: z.string(),
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
})

const timetableSchema = z.object({
  sessions: z.array(sessionSchema),
})

export async function POST(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return new Response("Unauthorized", { status: 401 })
  }

  // Fetch all user data for context
  const [{ data: exams }, { data: topics }, { data: assignments }] = await Promise.all([
    supabase.from("exams").select("*").eq("user_id", user.id).order("exam_date", { ascending: true }),
    supabase.from("topics").select("*").eq("user_id", user.id).eq("status", "pending"),
    supabase.from("assignments").select("*").eq("user_id", user.id).eq("status", "todo"),
  ])

  const context = {
    exams: exams || [],
    topics: topics || [],
    assignments: assignments || [],
    currentDate: new Date().toISOString(),
  }

  try {
    const { object } = await generateObject({
      model: "openai/gpt-4o", // Using a stable model string
      schema: timetableSchema,
      prompt: `
        You are an expert student study planner. 
        Based on the student's exams, topics to study, and assignments, create a systematic study timetable for the next 7 days.
        
        Guidelines:
        1. Prioritize topics for exams that are sooner.
        2. Consider importance_level (1-5) of topics.
        3. Dedicate time slots for assignment deadlines.
        4. Sessions should be between 1-2 hours long.
        5. Start study sessions from tomorrow morning (approx 9 AM).
        6. Topics context: ${JSON.stringify(context.topics)}
        7. Exams context: ${JSON.stringify(context.exams)}
        8. Assignments context: ${JSON.stringify(context.assignments)}
        9. Current date: ${context.currentDate}
        
        Return a list of sessions with topic_id, start_time, and end_time.
      `,
    })

    // Store the generated sessions
    if (object.sessions.length > 0) {
      // Clear existing future sessions first (optional restructure logic)
      await supabase.from("study_sessions").delete().eq("user_id", user.id).gt("start_time", new Date().toISOString())

      const sessionsToInsert = object.sessions.map((s) => ({
        ...s,
        user_id: user.id,
      }))

      const { error: insertError } = await supabase.from("study_sessions").insert(sessionsToInsert)

      if (insertError) throw insertError
    }

    return Response.json(object)
  } catch (error) {
    console.error("[v0] AI Generation Error:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}

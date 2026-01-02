"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface Exam {
  id: string
  subject: string
  exam_date: string
}

export function ExamsManager({ initialExams, user }: { initialExams: Exam[]; user: User }) {
  const [exams, setExams] = useState<Exam[]>(initialExams)
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [subject, setSubject] = useState("")
  const [date, setDate] = useState("")
  const router = useRouter()
  const supabase = createClient()

  const handleAddExam = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { data, error } = await supabase
        .from("exams")
        .insert({
          user_id: user.id,
          subject,
          exam_date: new Date(date).toISOString(),
        })
        .select()
        .single()

      if (error) throw error

      setExams([...exams, data].sort((a, b) => new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime()))
      setIsOpen(false)
      setSubject("")
      setDate("")
      toast.success("Exam added successfully")
      router.refresh()
    } catch (error) {
      console.error("[v0] Error adding exam:", error)
      toast.error("Failed to add exam")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteExam = async (id: string) => {
    try {
      const { error } = await supabase.from("exams").delete().eq("id", id)
      if (error) throw error
      setExams(exams.filter((e) => e.id !== id))
      toast.success("Exam deleted")
      router.refresh()
    } catch (error) {
      console.error("[v0] Error deleting exam:", error)
      toast.error("Failed to delete exam")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Exam
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleAddExam}>
              <DialogHeader>
                <DialogTitle>Add New Exam</DialogTitle>
                <DialogDescription>Enter your exam details to include it in your study plan.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="e.g. Mathematics"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="date">Exam Date</Label>
                  <Input
                    id="date"
                    type="datetime-local"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Adding..." : "Add Exam"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {exams.length === 0 ? (
          <Card className="col-span-full border-dashed">
            <CardContent className="flex flex-col items-center justify-center h-40">
              <p className="text-muted-foreground">No exams added yet.</p>
            </CardContent>
          </Card>
        ) : (
          exams.map((exam) => (
            <Card key={exam.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-semibold">{exam.subject}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => handleDeleteExam(exam.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(new Date(exam.exam_date), "PPP p")}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

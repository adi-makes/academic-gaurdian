"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, BookOpen } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"

interface Topic {
  id: string
  title: string
  importance_level: number
  status: string
  exam_id: string | null
  exams?: { subject: string }
}

interface Exam {
  id: string
  subject: string
}

export function TopicsManager({ initialTopics, exams, user }: { initialTopics: Topic[]; exams: Exam[]; user: User }) {
  const [topics, setTopics] = useState<Topic[]>(initialTopics)
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [title, setTitle] = useState("")
  const [examId, setExamId] = useState<string>("none")
  const [importance, setImportance] = useState("3")
  const router = useRouter()
  const supabase = createClient()

  const handleAddTopic = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { data, error } = await supabase
        .from("topics")
        .insert({
          user_id: user.id,
          title,
          exam_id: examId === "none" ? null : examId,
          importance_level: Number.parseInt(importance),
        })
        .select("*, exams(subject)")
        .single()

      if (error) throw error

      setTopics([...topics, data])
      setIsOpen(false)
      setTitle("")
      setExamId("none")
      setImportance("3")
      toast.success("Topic added successfully")
      router.refresh()
    } catch (error) {
      console.error("[v0] Error adding topic:", error)
      toast.error("Failed to add topic")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteTopic = async (id: string) => {
    try {
      const { error } = await supabase.from("topics").delete().eq("id", id)
      if (error) throw error
      setTopics(topics.filter((t) => t.id !== id))
      toast.success("Topic deleted")
      router.refresh()
    } catch (error) {
      console.error("[v0] Error deleting topic:", error)
      toast.error("Failed to delete topic")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Topic
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleAddTopic}>
              <DialogHeader>
                <DialogTitle>Add New Study Topic</DialogTitle>
                <DialogDescription>Break down your exams into specific topics for better planning.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Topic Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g. Quantum Mechanics Intro"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="exam">Linked Exam</Label>
                  <Select value={examId} onValueChange={setExamId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an exam" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">General / No Exam</SelectItem>
                      {exams.map((exam) => (
                        <SelectItem key={exam.id} value={exam.id}>
                          {exam.subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="importance">Importance Level (1-5)</Label>
                  <Select value={importance} onValueChange={setImportance}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select importance" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {i} - {i === 1 ? "Low" : i === 5 ? "Critical" : "Medium"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Adding..." : "Add Topic"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {topics.length === 0 ? (
          <Card className="col-span-full border-dashed">
            <CardContent className="flex flex-col items-center justify-center h-40">
              <p className="text-muted-foreground">No topics added yet.</p>
            </CardContent>
          </Card>
        ) : (
          topics.map((topic) => (
            <Card key={topic.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-semibold">{topic.title}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => handleDeleteTopic(topic.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <BookOpen className="mr-2 h-4 w-4 text-primary/60" />
                    <span className="font-medium">{topic.exams?.subject || "General Study"}</span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                      <span>Importance</span>
                      <span>{topic.importance_level}/5</span>
                    </div>
                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          topic.importance_level >= 4 ? "bg-destructive" : "bg-primary"
                        }`}
                        style={{ width: `${(topic.importance_level / 5) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Badge variant="outline" className="capitalize text-[10px] font-bold">
                      {topic.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, CalendarIcon, CheckCircle2, Circle } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

interface Assignment {
  id: string
  title: string
  deadline: string
  priority: string
  status: string
}

export function AssignmentsManager({
  initialAssignments,
  user,
}: {
  initialAssignments: Assignment[]
  user: User
}) {
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments)
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [title, setTitle] = useState("")
  const [deadline, setDeadline] = useState("")
  const [priority, setPriority] = useState("medium")
  const router = useRouter()
  const supabase = createClient()

  const handleAddAssignment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { data, error } = await supabase
        .from("assignments")
        .insert({
          user_id: user.id,
          title,
          deadline: new Date(deadline).toISOString(),
          priority,
          status: "todo",
        })
        .select()
        .single()

      if (error) throw error

      setAssignments(
        [...assignments, data].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()),
      )
      setIsOpen(false)
      setTitle("")
      setDeadline("")
      setPriority("medium")
      toast.success("Assignment added successfully")
      router.refresh()
    } catch (error) {
      console.error("[v0] Error adding assignment:", error)
      toast.error("Failed to add assignment")
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "done" ? "todo" : "done"
    try {
      const { error } = await supabase.from("assignments").update({ status: newStatus }).eq("id", id)
      if (error) throw error

      setAssignments(assignments.map((a) => (a.id === id ? { ...a, status: newStatus } : a)))
      toast.success(`Marked as ${newStatus}`)
      router.refresh()
    } catch (error) {
      console.error("[v0] Error updating assignment status:", error)
      toast.error("Failed to update status")
    }
  }

  const handleDeleteAssignment = async (id: string) => {
    try {
      const { error } = await supabase.from("assignments").delete().eq("id", id)
      if (error) throw error
      setAssignments(assignments.filter((a) => a.id !== id))
      toast.success("Assignment deleted")
      router.refresh()
    } catch (error) {
      console.error("[v0] Error deleting assignment:", error)
      toast.error("Failed to delete assignment")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Assignment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleAddAssignment}>
              <DialogHeader>
                <DialogTitle>Add New Assignment</DialogTitle>
                <DialogDescription>Enter the assignment or project details and deadline.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g. Physics Lab Report"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    type="datetime-local"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Adding..." : "Add Assignment"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {assignments.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center h-40">
              <p className="text-muted-foreground">No assignments added yet.</p>
            </CardContent>
          </Card>
        ) : (
          assignments.map((assignment) => (
            <Card key={assignment.id} className={assignment.status === "done" ? "opacity-60" : ""}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-full"
                      onClick={() => toggleStatus(assignment.id, assignment.status)}
                    >
                      {assignment.status === "done" ? (
                        <CheckCircle2 className="h-6 w-6 text-primary" />
                      ) : (
                        <Circle className="h-6 w-6 text-muted-foreground" />
                      )}
                    </Button>
                    <div className="flex-1">
                      <div className={`font-semibold ${assignment.status === "done" ? "line-through" : ""}`}>
                        {assignment.title}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <CalendarIcon className="mr-1 h-3 w-3" />
                        Due: {format(new Date(assignment.deadline), "PPP p")}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        assignment.priority === "high"
                          ? "destructive"
                          : assignment.priority === "medium"
                            ? "secondary"
                            : "outline"
                      }
                      className="capitalize"
                    >
                      {assignment.priority}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDeleteAssignment(assignment.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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

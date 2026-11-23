"use client"


import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import DashboardHeader from "./DashboardHeader"

interface Note {
    _id: string
    title: string
    description: string
}

interface NotesResponse {
    data?: Note[]
    message?: string
}

export default function Dashboard() {
    const router = useRouter()
    const [notes, setNotes] = useState<Note[]>([])
    const [error, setError] = useState("")
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        let cancelled = false

        const fetchNotes = async () => {
            try {
                const res = await fetch("/api/note")
                const response: NotesResponse = await res.json()

                if (!res.ok || !Array.isArray(response.data)) {
                    throw new Error(response.message ?? "Unable to load notes")
                }

                if (!cancelled) {
                    setNotes(response.data)
                }
            } catch {
                if (!cancelled) {
                    setError("Unable to load notes. Please try again.")
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false)
                }
            }
        }

        void fetchNotes()
        return () => {
            cancelled = true
        }
    }, [])

    const removeNote = async (id: string) => {
        setError("")
        setDeletingId(id)

        try {
            const res = await fetch(`/api/note/${id}`, { method: "DELETE" })
            const response: NotesResponse = await res.json()

            if (!res.ok) {
                setError(response.message ?? "Unable to delete note.")
                return
            }

            setNotes((currentNotes) => currentNotes.filter((note) => note._id !== id))
        } catch {
            setError("Unable to delete note. Please try again.")
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <main className="min-h-screen bg-slate-50">
            <DashboardHeader />

            <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
                <header className="mb-8">
                    <div>
                        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            My Notes
                        </h1>
                        <p className="mt-2 text-slate-600">Your thoughts, all in one place.</p>
                    </div>
                </header>

                {error && (
                    <p role="alert" className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800">
                        {error}
                    </p>
                )}

                {isLoading ? (
                    <p className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600">
                        Loading notes...
                    </p>
                ) : notes.length > 0 ? (
                    <section aria-label="Your notes" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {notes.map((note) => (
                            <article
                                key={note._id}
                                className="flex min-h-52 flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                            >
                                <h2 className="break-words text-lg font-semibold text-slate-900">
                                    {note.title}
                                </h2>
                                <p className="mt-3 flex-1 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
                                    {note.description}
                                </p>
                                <div className="mt-5 flex gap-3 border-t border-slate-100 pt-4">
                                    <button
                                        onClick={() => router.push(`/dashboard/${note._id}`)}
                                        className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => removeNote(note._id)}
                                        disabled={deletingId === note._id}
                                        className="flex-1 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {deletingId === note._id ? "Deleting..." : "Delete"}
                                    </button>
                                </div>
                            </article>
                        ))}
                    </section>
                ) : (
                    <section className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                        <h2 className="text-xl font-semibold text-slate-900">No notes yet</h2>
                        <p className="mt-2 text-slate-600">Select Add Note above to create your first note.</p>
                    </section>
                )}
            </div>
        </main>
    )
}
"use client"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { FormEvent, useEffect, useState } from "react"
import DashboardHeader from "../DashboardHeader"

interface Note {
    title: string
    description: string
}

interface NoteResponse {
    data?: Note
    message?: string
}

export default function Edit() {
    const router = useRouter()
    const { id } = useParams<{ id: string }>()
    const [notes, setNotes] = useState<Note>({ title: "", description: "" })
    const [isSaving, setIsSaving] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        let cancelled = false

        const getNote = async () => {
            try {
                const res = await fetch(`/api/note/${id}`)
                const response: NoteResponse = await res.json()

                if (!res.ok || !response.data) {
                    throw new Error(response.message ?? "Unable to load note")
                }

                if (!cancelled) {
                    setNotes(response.data)
                }
            } catch {
                if (!cancelled) {
                    setError("Unable to load this note. Please try again.")
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false)
                }
            }
        }

        void getNote()
        return () => {
            cancelled = true
        }
    }, [id])

    const updateNote = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError("")

        if (!notes.title.trim() || !notes.description.trim()) {
            setError("Enter a title and description.")
            return
        }

        setIsSaving(true)
        try {
            const res = await fetch(`/api/note/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(notes)
            })
            const response: NoteResponse = await res.json()

            if (!res.ok) {
                setError(response.message ?? "Unable to update note.")
                return
            }

            router.push("/dashboard")
        } catch {
            setError("Unable to update note. Please try again.")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <main className="min-h-screen bg-slate-50">
            <DashboardHeader />
            <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
                <Link
                    href="/dashboard"
                    className="text-sm font-medium text-slate-600 transition hover:text-blue-700"
                >
                    &larr; Back to dashboard
                </Link>

                <div className="mb-8 mt-6">
                    <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">
                        My Notes
                    </p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                        Edit note
                    </h1>
                    <p className="mt-2 text-slate-600">Make changes to your note below.</p>
                </div>

                {error && (
                    <p role="alert" className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800">
                        {error}
                    </p>
                )}

                {isLoading ? (
                    <p className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600">
                        Loading note...
                    </p>
                ) : (
                    <form
                        onSubmit={updateNote}
                        className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
                    >
                        <div>
                            <label htmlFor="title" className="mb-2 block text-sm font-medium text-slate-700">
                                Title
                            </label>
                            <input
                                id="title"
                                value={notes.title}
                                onChange={(event) => setNotes({ ...notes, title: event.target.value })}
                                type="text"
                                required
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                                placeholder="Give your note a title"
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="mb-2 block text-sm font-medium text-slate-700">
                                Description
                            </label>
                            <textarea
                                id="description"
                                value={notes.description}
                                onChange={(event) => setNotes({ ...notes, description: event.target.value })}
                                required
                                rows={6}
                                className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                                placeholder="Write your note..."
                            />
                        </div>
                        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                            <Link
                                href="/dashboard"
                                className="rounded-lg border border-slate-300 px-4 py-2.5 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isSaving ? "Saving..." : "Save changes"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </main>
    )
}
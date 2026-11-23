"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"

interface RegisterResponse {
    message?: string
}

export default function Register() {
    const router = useRouter()
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    })
    const [error, setError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError("")
        setIsSubmitting(true)

        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            })
            const data: RegisterResponse = await response.json()

            if (!response.ok) {
                setError(data.message ?? "Registration failed. Please try again.")
                return
            }

            router.push("/login")
        } catch {
            setError("Unable to register right now. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-blue-400 p-5 rounded w-full max-w-sm">
                <h1 className="text-center text-2xl text-white font-bold">Note Hub</h1>
                <p className="text-white text-center font-bold mt-2">Register</p>

                <form onSubmit={handleRegister}>
                    <div className="my-3 w-full">
                        <input
                            type="text"
                            placeholder="Name"
                            autoComplete="name"
                            required
                            value={form.name}
                            onChange={(event) => setForm({ ...form, name: event.target.value })}
                            className="rounded bg-gray-100 p-3 w-full"
                        />
                    </div>
                    <div className="my-3 w-full">
                        <input
                            type="email"
                            placeholder="Email"
                            autoComplete="email"
                            required
                            value={form.email}
                            onChange={(event) => setForm({ ...form, email: event.target.value })}
                            className="rounded bg-gray-100 p-3 w-full"
                        />
                    </div>
                    <div className="my-3 w-full">
                        <input
                            type="password"
                            placeholder="Password"
                            autoComplete="new-password"
                            required
                            value={form.password}
                            onChange={(event) => setForm({ ...form, password: event.target.value })}
                            className="rounded bg-gray-100 p-3 w-full"
                        />
                    </div>

                    {error && <p role="alert" className="text-red-900">{error}</p>}

                    <div className="my-3 w-full">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded bg-blue-800 p-3 w-full text-white disabled:opacity-60"
                        >
                            {isSubmitting ? "Registering..." : "Register"}
                        </button>
                        <p className="mt-3 text-center">
                            Already registered? <Link href="/login" className="text-blue-800 underline">Log in</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}

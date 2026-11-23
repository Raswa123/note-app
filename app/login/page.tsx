"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"

interface LoginResponse {
    message?: string
}

export default function LogIn() {
    const router = useRouter()
    const [credentials, setCredentials] = useState({ email: "", password: "" })
    const [error, setError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError("")
        setIsSubmitting(true)

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials)
            })
            const data: LoginResponse = await response.json()

            if (!response.ok) {
                setError(data.message ?? "Login failed. Please try again.")
                return
            }

            router.push("/dashboard")
        } catch {
            setError("Unable to log in right now. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-blue-400 p-5 rounded w-100">
                <h1 className="text-center text-2xl text-white font-bold">Note Hub</h1>
                <p className="text-white text-center font-bold mt-2">LogIn</p>

                <form onSubmit={handleLogin}>
                    <div className="my-3 w-full">
                        <input
                            type="email"
                            placeholder="Email"
                            autoComplete="email"
                            required
                            value={credentials.email}
                            onChange={(event) => setCredentials({ ...credentials, email: event.target.value })}
                            className="rounded bg-gray-100 p-3 w-full"
                        />
                    </div>
                    <div className="my-3 w-full">
                        <input
                            type="password"
                            placeholder="Password"
                            autoComplete="current-password"
                            required
                            value={credentials.password}
                            onChange={(event) => setCredentials({ ...credentials, password: event.target.value })}
                            className="rounded bg-gray-100 p-3 w-full"
                        />
                    </div>

                    <div className="my-3 w-full">
                        {error && <p role="alert" className="text-red-900">{error}</p>}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded bg-blue-800 p-3 w-full text-white disabled:opacity-60"
                        >
                            {isSubmitting ? "Logging in..." : "LogIn"}
                        </button>
                        <p className="mt-3 text-center">New user? click here to <Link href={'/register'} className="text-blue-800 underline">Register</Link></p>
                    </div>

                </form>
            </div>
        </div>
    )
}
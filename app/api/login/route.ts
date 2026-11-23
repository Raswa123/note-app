import bcrypt from "bcryptjs"
import { connectDB } from "@/lib/mongodb"
import users from "@/models/userModel"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    let body: { email?: unknown; password?: unknown }

    try {
        body = await request.json()
    } catch {
        return NextResponse.json({ message: "Invalid request body" }, { status: 400 })
    }

    if (
        typeof body.email !== "string" ||
        typeof body.password !== "string" ||
        !body.email.trim() ||
        !body.password
    ) {
        return NextResponse.json(
            { message: "Email and password are required" },
            { status: 400 }
        )
    }

    try {
        await connectDB()
        const user = await users.findOne({ email: body.email.trim().toLowerCase() })

        if (!user || !(await bcrypt.compare(body.password, user.password))) {
            return NextResponse.json(
                { message: "Invalid email or password" },
                { status: 401 }
            )
        }

        return NextResponse.json({ message: "Login successful" }, { status: 200 })
    } catch (error) {
        console.error("User login failed", error)
        return NextResponse.json(
            { message: "Login is unavailable. Check the server logs and MongoDB configuration." },
            { status: 503 }
        )
    }
}

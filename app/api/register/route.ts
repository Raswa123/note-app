import users from '@/models/userModel'
import { connectDB } from "@/lib/mongodb"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
    let body: { name?: unknown; email?: unknown; password?: unknown }

    try {
        body = await request.json()
    } catch {
        return NextResponse.json({ message: "Invalid request body" }, { status: 400 })
    }

    if (
        typeof body.name !== "string" ||
        typeof body.email !== "string" ||
        typeof body.password !== "string" ||
        !body.name.trim() ||
        !body.email.trim() ||
        !body.password
    ) {
        return NextResponse.json(
            { message: "Name, email, and password are required" },
            { status: 400 }
        )
    }

    try {
        await connectDB()
        const email = body.email.trim().toLowerCase()
        const existingUser = await users.findOne({ email })

        if (existingUser) {
            return NextResponse.json(
                { message: "Already registered. Please log in." },
                { status: 409 }
            )
        }

        const encryptedPassword = await bcrypt.hash(body.password, 10)
        const newUser = await users.create({
            name: body.name.trim(),
            email,
            password: encryptedPassword
        })

        return NextResponse.json(
            {
                message: "User registered successfully",
                data: { id: newUser._id.toString(), name: newUser.name, email: newUser.email }
            },
            { status: 201 }
        )
    } catch (error) {
        console.error("User registration failed", error)
        return NextResponse.json(
            { message: "Registration is unavailable. Check the server logs and MongoDB configuration." },
            { status: 503 }
        )
    }
}
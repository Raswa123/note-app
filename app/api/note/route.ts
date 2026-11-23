import { connectDB } from "@/lib/mongodb"
import Note from "@/models/noteModel"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        await connectDB()
        const notes = await Note.find()
        return NextResponse.json({ data: notes }, { status: 200 })
    } catch (error) {
        console.error("Fetching notes failed", error)
        return NextResponse.json(
            { message: "Unable to load notes. Check the server logs and MongoDB configuration." },
            { status: 503 }
        )
    }
}

export async function POST(request: Request) {
    let body: { title?: unknown; description?: unknown }

    try {
        body = await request.json()
    } catch {
        return NextResponse.json({ message: "Invalid request body" }, { status: 400 })
    }

    if (
        typeof body.title !== "string" ||
        typeof body.description !== "string" ||
        !body.title.trim() ||
        !body.description.trim()
    ) {
        return NextResponse.json(
            { message: "Title and description are required" },
            { status: 400 }
        )
    }

    try {
        await connectDB()
        const note = await Note.create({
            title: body.title.trim(),
            description: body.description.trim()
        })

        return NextResponse.json(
            { message: "Note added successfully", data: note },
            { status: 201 }
        )
    } catch (error) {
        console.error("Creating note failed", error)
        return NextResponse.json(
            { message: "Unable to add note. Check the server logs and MongoDB configuration." },
            { status: 503 }
        )
    }
}

import { connectDB } from "@/lib/mongodb"
import Note from "@/models/noteModel"
import { NextResponse } from "next/server"
import mongoose from "mongoose"

type RouteContext = {
    params: Promise<{ id: string }>
}

export async function GET(_request: Request, { params }: RouteContext) {
    const { id } = await params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ message: "Invalid note ID" }, { status: 400 })
    }

    await connectDB()
    const note = await Note.findById(id)

    if (!note) {
        return NextResponse.json({ message: "Note not found" }, { status: 404 })
    }

    return NextResponse.json({ data: note }, { status: 200 })
}

export async function PUT(request: Request, { params }: RouteContext) {
    const { id } = await params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ message: "Invalid note ID" }, { status: 400 })
    }

    let body: { title?: unknown; description?: unknown }
    try {
        body = await request.json()
    } catch {
        return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 })
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

    await connectDB()
    const note = await Note.findByIdAndUpdate(
        id,
        {
            title: body.title.trim(),
            description: body.description.trim()
        },
        { new: true, runValidators: true }
    )

    if (!note) {
        return NextResponse.json({ message: "Note not found" }, { status: 404 })
    }

    return NextResponse.json(
        { message: "Note updated successfully", data: note },
        { status: 200 }
    )
}

export async function DELETE(_request: Request, { params }: RouteContext) {
    const { id } = await params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ message: "Invalid note ID" }, { status: 400 })
    }

    await connectDB()
    const note = await Note.findByIdAndDelete(id)

    if (!note) {
        return NextResponse.json({ message: "Note not found" }, { status: 404 })
    }

    return NextResponse.json(
        { message: "Note deleted successfully" },
        { status: 200 }
    )
}

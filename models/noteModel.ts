import mongoose from "mongoose"

interface Note {
    title: string
    description: string
}

const noteSchema = new mongoose.Schema<Note>({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
})

export default mongoose.models.Note || mongoose.model<Note>("Note", noteSchema)

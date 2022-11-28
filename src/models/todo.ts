import { model, Schema } from "mongoose"
import { Todo } from "../types/todo"

// Schema atau aturan untuk blueprint
const todoSchema: Schema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true
    }
)

// Meng export secara default dari type todo model dari interface todo yang dibuat, dengan nama Todo dan todoSchema sebagai skemanya
export default model<Todo>('Todo', todoSchema)
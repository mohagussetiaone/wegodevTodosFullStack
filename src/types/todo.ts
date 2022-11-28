import { Document } from "mongoose";

// Document untuk generate object (blueprint)
export interface Todo extends Document {
    title: string,
    status: 'completed' | 'uncompleted'
}

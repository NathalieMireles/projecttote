import { Schema, model } from "mongoose"

const UserSchema = new Schema([
    {
        name: { type: String, required: true }
    },
    {
        email: { type: String, required: true }
    },
    {
        password: { type: String, required: true}
    },
    {
        curp: { type: String, required: true }
    },
    {
        role: { type: String, enum: ['judge', 'participant', 'managers'], lowercase: true, required: true }
    }
])

export const UserModel = model("users", UserSchema)
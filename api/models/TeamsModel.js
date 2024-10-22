import { Schema, model} from "mongoose";

const TeamSchema = new ([
    {
        name: { type: String, required: true }
    },
    {
        id_members: []
    },
    {
        leader: { type: Schema.Types.ObjectId, required: true }
    },
    {
        round: { type: Number, required: true }
    },
    {
        id_scores: { type: Number, required: true }
    }
])

export const TeamModel = model("events", TeamSchema);
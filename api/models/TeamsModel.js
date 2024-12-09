import { Schema, model } from "mongoose";

const TeamSchema = new Schema([
    {
        name: { type: String, required: true }
    },
    {
        id_members: []
    },
    {
        leader: { type: String, required: true } 
    },
    {
        round: { type: Number, default: 0 }
    },
    {
        id_scores: [] 
    }
]);

export const TeamsModel = model("teams", TeamSchema);

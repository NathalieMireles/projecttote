import { Schema, model} from "mongoose";

const GradesSchema = new ([
    {
        id_group: { type: Schema.Types.ObjectId, required: true }
    },
    {
        round: { type: Number, required: true }
    },
    {
        id_event: { type: Schema.Types.ObjectId, required: true }
    },
    
    {
        grades: [{
            id_metric: { type: Schema.Types.ObjectId, required: true }
        },
        {
            grade: { type: Number, required: true }
        },
        {
            id_judge: {type: Schema.Types.ObjectId, required: true }
        }]
    }
])
export const GradeModel = model("grades", GradesSchema);
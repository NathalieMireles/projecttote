import { Schema, model} from "mongoose";

const EventSchema = new ([

    {
        name: { type: String, required: true }
    },
    
    {
        metrics:[
            {
                description:{
                    type:String, 
                    required:true
                }, 
                max_poiints:{
                    type:Number,
                    required:true
                }
            }
        ]
    },
    {
        ronda:{
            type:Number,
            required:true
        }
    },
    {
        status:{
            type:String,
            enum:["pending","active","Done"],
            lowercase:true,
            required:true
        }
    },
    {
        groups:[

        ]
    },
    {
        judges:[

        ]
    }
]);

export const EventModel = model("events", EventSchema);
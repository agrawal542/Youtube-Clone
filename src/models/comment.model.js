import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { addAutoIncrementId } from "../utils/autoIncreament.js";

const commentSchema = new Schema(
    {
        content: {
            type: String,
            required: true
        },
        video: {
            // type: Schema.Types.ObjectId,
            type: Number,
            ref: "Video"
        },
        owner: {
            // type: Schema.Types.ObjectId,
            type: Number,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
)

addAutoIncrementId(commentSchema, 'comments');

commentSchema.plugin(mongooseAggregatePaginate)

export const Comment = mongoose.model("Comment", commentSchema)
import mongoose, {Schema} from "mongoose";
import { addAutoIncrementId } from "../utils/autoIncreament.js";

const tweetSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    owner: {
        // type: Schema.Types.ObjectId,
        type: Number,
        ref: "User"
    }
}, {timestamps: true})

addAutoIncrementId(tweetSchema, 'tweets');

export const Tweet = mongoose.model("Tweet", tweetSchema)
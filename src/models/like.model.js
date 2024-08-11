import mongoose, { Schema } from "mongoose";
import { addAutoIncrementId } from "../utils/autoIncreament.js";

const likeSchema = new Schema({
    video: {
        type: Number,
        // type: Schema.Types.ObjectId,
        ref: "Video"
    },
    comment: {
        type: Number,
        // type: Schema.Types.ObjectId,
        ref: "Comment"
    },
    tweet: {
        type: Number,
        // type: Schema.Types.ObjectId,
        ref: "Tweet"
    },
    likedBy: {
        type: Number,
        // type: Schema.Types.ObjectId,
        ref: "User"
    },

}, { timestamps: true })

addAutoIncrementId(likeSchema, 'likes');
export const Like = mongoose.model("Like", likeSchema)
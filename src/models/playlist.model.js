import mongoose, { Schema } from "mongoose";
import { addAutoIncrementId } from "../utils/autoIncreament.js";

const playlistSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    videos: [
        {
            // type: Schema.Types.ObjectId,
            type: Number,
            ref: "Video"
        }
    ],
    owner: {
        // type: Schema.Types.ObjectId,
        type: Number,
        ref: "User",
        required: true
    },
}, { timestamps: true })

addAutoIncrementId(playlistSchema, 'playlists');


export const Playlist = mongoose.model("Playlist", playlistSchema)
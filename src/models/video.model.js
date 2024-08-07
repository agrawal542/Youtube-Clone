import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { addAutoIncrementId } from "../utils/autoIncreament.js";


const videoSchema = new Schema(
  {
    videoFile: {
      type: String, //cloudinary url
      required: true,
    },

    thumbnail: {
      type: String, //cloudinary url
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    duration: {
      type: String,
      required: true,
    },

    views: {
      type: Number,
      default: 0,
    },

    isPublished: {
      type: Boolean,
      default: true,
    },

    owner: {
      // type: Schema.Types.ObjectId,
      type: Number,
      ref: "User",
    },
  },
  { timestamps: true }
);

addAutoIncrementId(videoSchema, 'Video');

videoSchema.plugin(mongooseAggregatePaginate)


export const Video = mongoose.model("Video", videoSchema);

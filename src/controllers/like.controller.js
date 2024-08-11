import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { video_id } = req.params;
    let message = 'Video unliked successfully';


    const existingLike = await Like.findOneAndDelete({
        video: video_id,
        likedBy: req.user._id,
    });

    if (!existingLike) {
        await Like.create({
            video: video_id,
            likedBy: req.user._id,
        });
        message = 'Video liked successfully';
    }
    return res.status(200).json(new ApiResponse(200, {}, message))
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { comment_id } = req.params;
    console.log(comment_id)
    let message = 'Comment unliked successfully';

    const existingLike = await Like.findOneAndDelete({
        comment: comment_id,
        likedBy: req.user._id,
    });

    if (!existingLike) {
        await Like.create({
            comment: comment_id,
            likedBy: req.user._id,
        });
        message = 'Comment liked successfully';
    }
    return res.status(200).json(new ApiResponse(200, {}, message));
});


const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweet_id } = req.params
    let message = 'tweet unliked successfully';

    const existingLike = await Like.findOneAndDelete({
        tweet: tweet_id,
        likedBy: req.user._id,
    });

    if (!existingLike) {
        await Like.create({
            tweet: tweet_id,
            likedBy: req.user._id,
        });
        message = 'tweet liked successfully';
    }
    return res.status(200).json(new ApiResponse(200, {}, message))
})

const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const likedVideos = await Like.find({ likedBy: userId, video: { $ne: null } })

    return res.status(200).json(new ApiResponse(200, likedVideos, "Liked Videos Fetched Successfully"));
});


export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}
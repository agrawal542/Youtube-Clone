import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res, next) => {
    const { content } = req.body;

    if (content === undefined || content === null || content.trim() === "") {
        return next(ApiError({ status: 400, message: "Content is mandatory" }));
    }

    const tweet = await Tweet.create({
        content,
        owner: req.user._id
    });

    return res.status(201).json(new ApiResponse(201, tweet, "Tweet created successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
    const { user_id } = req.params;

    const user = await User.findById(user_id);
    if (!user) {
        throw new ApiError({ status: 404, message: "User not found." });
    }

    const tweets = await Tweet.find({ owner: user_id });
    return res.status(200).json(new ApiResponse(200, tweets, "tweets fetched successfully"));
})

const updateTweet = asyncHandler(async (req, res, next) => {
    const { tweet_id } = req.params;
    const { content } = req.body;

    if (content === undefined || content === null || content.trim() === "") {
        return next(new ApiError({ status: 400, message: "Content cannot be empty" }));
    }

    const result = await Tweet.updateOne({ _id: tweet_id }, { content });

    if (result.matchedCount === 0) {
        return next(new ApiError({ status: 404, message: "Tweet not found" }));
    }

    return res.status(200).json(new ApiResponse(200, {}, "Tweet updated successfully"));
});


const deleteTweet = asyncHandler(async (req, res) => {
    const { tweet_id } = req.params;

    const result = await Tweet.deleteOne({ _id: tweet_id })

    if (result.deletedCount === 0) {
        throw new ApiError({ status: 400, message: "Error occurred while deleting the tweet." });
    }
    return res.status(200).json(new ApiResponse(200, {}, "tweet Deleted successfully"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}

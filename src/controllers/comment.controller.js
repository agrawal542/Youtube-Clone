import mongoose from "mongoose"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"

const getVideoComments = asyncHandler(async (req, res) => {
    const { video_id } = req.params
    const { page = 1, limit = 10 } = req.query

    const videoExists = await Video.exists({ _id: video_id });
    if (!videoExists) {
        return res.status(404).json(new ApiResponse(404, null, "Video not found"));
    }

    const comments = await Comment.find({ video: video_id }).skip((page - 1) * limit).limit(limit);

    return res.status(200).json(new ApiResponse(200, comments, "Comments retrieved successfully"));
})

const addComment = asyncHandler(async (req, res, next) => {
    const { video_id } = req.params;
    const { content } = req.body;

    if (content === undefined || content === null || content.trim() === "") {
        return next(new ApiError({ status: 400, message: "Content is mandatory" }));
    }

    const video = await Video.findById(video_id);
    if (!video) {
        return next(new ApiError({ status: 404, message: "Video not found" }));
    }

    const comment = await Comment.create({
        content,
        video: video_id,
        owner: req.user._id
    });

    return res.status(201).json(new ApiResponse(201, comment, "Comment added successfully"));
});

const updateComment = asyncHandler(async (req, res, next) => {
    const { comment_id } = req.params;
    const { content } = req.body;

    if (content === undefined || content === null || content.trim() === "") {
        return next(new ApiError({ status: 400, message: "Content cannot be empty" }));
    }

    const result = await Comment.updateOne({ _id: comment_id }, { content });

    if (result.matchedCount === 0) {
        return next(new ApiError({ status: 404, message: "Comment not found" }));
    }

    return res.status(200).json(new ApiResponse(200, {}, "Comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res, next) => {
    const { comment_id } = req.params;

    const result = await Comment.deleteOne({ _id: comment_id });

    if (result.deletedCount === 0) {
        return next(new ApiError({ status: 404, message: "Comment not found" }));
    }

    return res.status(200).json(new ApiResponse(200, {}, "Comment deleted successfully"));
});

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}

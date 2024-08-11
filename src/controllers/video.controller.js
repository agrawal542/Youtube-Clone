import mongoose from "mongoose"

import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

// Convert seconds to minutes and seconds with leading zeros
const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
};

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 2, query, sortBy = 'createdAt', sortType = "asc", user_id } = req.query;


    // Convert page and limit to numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    // console.log([pageNumber, limitNumber])

    // Validate pagination and limit values
    if (pageNumber < 1 || limitNumber < 1) {
        throw new ApiError({ status: 400, message: "Page and limit must be greater than 0." });
    }

    // Determine sort direction
    const sortDirection = sortType === 'asc' ? 1 : -1;

    // Build query filter
    let filters = {};

    if (user_id) {
        filters.owner = user_id;
    }

    // Fetch videos with pagination and sorting
    const videos = await Video.find(filters)
        .sort({ [sortBy]: sortDirection })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);

    return res
        .status(200)
        .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body

    if ([title, description].some((field) => field?.trim() === "" || field === undefined)) {
        throw new ApiError({ status: 400, message: "All fields are required" })
    }

    const videoFilePath = req.files?.videoFile?.[0]?.path
    const thumbnailPath = req.files?.thumbnail?.[0].path
    // console.log([videoFilePath, thumbnailPath])


    if (!videoFilePath || !thumbnailPath) {
        throw new ApiError({ status: 400, message: "videoFile and thumbnail is required" });
    }

    const videofile = await uploadOnCloudinary(videoFilePath);
    const thumbnail = await uploadOnCloudinary(thumbnailPath);
    // console.log([videofile, thumbnail])

    const video = await Video.create({
        title,
        description,
        videoFile: videofile?.url || "",
        thumbnail: thumbnail?.url || "",
        duration: formatDuration(videofile.duration),
        owner: req.user._id,
    });

    
    if (!video) {
        throw new ApiError({ status: 500, message: "Something went wrong while creating video" });
    }

    return res.status(201).json(
        new ApiResponse(200, video, "Video created Successfully")
    );

    // TODO: get video, upload to cloudinary, create video
})

const getVideoById = asyncHandler(async (req, res) => {
    const { video_id } = req.params;

    const result = await Video.findOne({ _id: video_id });
    if (!result) {
        throw new ApiError({ status: 404, message: "Video not found." });
    }

    return res.status(200).json(
        new ApiResponse(200, result, "Video fetched successfully")
    );
});

const updateVideo = asyncHandler(async (req, res) => {
    const video_id = parseInt(req.params.video_id)
    const { title, description } = req.body;
    const thumbnailPath = req.file.path
    console.log([video_id, title, description, thumbnailPath])

    // Validate the input fields
    const updateFields = {};
    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (thumbnailPath) {
        updateFields.thumbnail = await uploadOnCloudinary(thumbnailPath)?.url
    }

    // Update the video details in the database
    const updatedVideo = await Video.findByIdAndUpdate(
        video_id,
        { $set: updateFields },
        { new: true, runValidators: true }
    );
    if (!updatedVideo) {
        throw new ApiError({ status: 404, message: "Video not found." });
    }

    return res.status(200).json(
        new ApiResponse(200, updatedVideo, "Video updated successfully")
    );
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { video_id } = req.params;

    const result = await Video.deleteOne({ _id: video_id });
    if (result.deletedCount === 0) {
        throw new ApiError({ status: 400, message: "Error occurred while deleting the video." });
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Video Deleted Successfully")
    );
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { video_id } = req.params;

    const video = await Video.findById(video_id);
    if (!video) {
        throw new ApiError({ status: 400, message: "Video Not Found" });
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        video_id,
        { $set: { isPublished: !video.isPublished } }, // Toggle the boolean field
        { new: true, runValidators: true } // Return the updated document and run validators
    );

    const message = updatedVideo.isPublished
        ? "Video Published Successfully"
        : "Video Unpublished Successfully";

    return res.status(200).json(
        new ApiResponse(200, {}, message)
    );
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}

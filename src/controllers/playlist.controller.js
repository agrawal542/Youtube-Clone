import mongoose, { isValidObjectId } from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body
    console.log([name, description])

    if ([name, description].some(data => data?.trim() === "" || data === undefined)) {
        throw new ApiError({ status: 400, message: "All fields are mandatory." });
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user._id
    })

    return res.status(200).json(new ApiResponse(200, playlist, "playlist is created"))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { user_id } = req.params;

    // Find the user
    const user = await User.findById(user_id);
    if (!user) {
        throw new ApiError({ status: 404, message: "User not found." });
    }

    // Find the playlists owned by the user
    const playlists = await Playlist.find({ owner: user_id });
    return res.status(200).json(new ApiResponse(200, playlists, "Playlists fetched successfully"));
});

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlist_id } = req.params
    console.log(playlist_id)
    if (!(playlist_id > 0 && Number.isInteger(Number(playlist_id)))) {
        throw new ApiError({ status: 400, message: "Invalid playlist ID. It must be a positive integer." });
    }

    const playlist = await Playlist.findById(playlist_id);
    return res.status(200).json(new ApiResponse(200, playlist, "playlist fetched successfully"))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlist_id, video_id } = req.params;

    // Validate that playlist_id and video_id are positive integers
    if (!(playlist_id > 0 && Number.isInteger(Number(playlist_id))) ||
        !(video_id > 0 && Number.isInteger(Number(video_id)))) {
        throw new ApiError({ status: 400, message: "Invalid playlist ID or video ID. Both must be positive integers." });
    }

    // Find the playlist
    const playlist = await Playlist.findOne({ _id: playlist_id });
    if (!playlist) {
        throw new ApiError({ status: 404, message: "Playlist not found." });
    }

    // Find the video
    const video = await Video.findOne({ _id: video_id });
    if (!video) {
        throw new ApiError({ status: 404, message: "Video not found." });
    }

    // Check if the video is already in the playlist
    if (playlist.videos.includes(video_id)) {
        throw new ApiError({ status: 400, message: "Video is already in the playlist." });
    }

    // Update the playlist to include the new video
    const result = await Playlist.updateOne(
        { _id: playlist_id },
        { $push: { videos: video_id } }
    );

    if (result.modifiedCount === 0) {
        throw new ApiError({ status: 500, message: "Error occurred while adding the video to the playlist." });
    }

    // Retrieve the updated playlist
    const updatedPlaylist = await Playlist.findOne({ _id: playlist_id });

    return res.status(200).json(new ApiResponse(200, updatedPlaylist, "Video added to playlist successfully"));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlist_id, video_id } = req.params;

    // Validate that playlist_id and video_id are positive integers
    if (!(playlist_id > 0 && Number.isInteger(Number(playlist_id))) ||
        !(video_id > 0 && Number.isInteger(Number(video_id)))) {
        throw new ApiError({ status: 400, message: "Invalid playlist ID or video ID. Both must be positive integers." });
    }

    // Find the playlist
    const playlist = await Playlist.findOne({ _id: playlist_id });
    if (!playlist) {
        throw new ApiError({ status: 404, message: "Playlist not found." });
    }

    // Find the video
    const video = await Video.findOne({ _id: video_id });
    if (!video) {
        throw new ApiError({ status: 404, message: "Video not found." });
    }

    // Check if the video is already in the playlist
    if (!playlist.videos.includes(video_id)) {
        throw new ApiError({ status: 400, message: "the Video is not in the playlist." });
    }

    // Update the playlist to include the new video
    const result = await Playlist.updateOne(
        { _id: playlist_id },
        { $pull: { videos: video_id } }
    );

    if (result.modifiedCount === 0) {
        throw new ApiError({ status: 500, message: "Error occurred while adding the video to the playlist." });
    }

    // Retrieve the updated playlist
    const updatedPlaylist = await Playlist.findOne({ _id: playlist_id });

    return res.status(200).json(new ApiResponse(200, updatedPlaylist, "Video removed from playlist successfully"));
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlist_id } = req.params
    console.log(playlist_id)

    if (!(playlist_id > 0 && Number.isInteger(Number(playlist_id)))) {
        throw new ApiError({ status: 400, message: "Invalid playlist ID. It must be a positive integer." });
    }

    const result = await Playlist.deleteOne({ _id: playlist_id });
    if (result.deletedCount === 0) {
        throw new ApiError({ status: 400, message: "Error occurred while deleting the video." });
    }
    return res.status(200).json(new ApiResponse(200, {}, "playlist Deleted successfully"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlist_id } = req.params
    const { name, description } = req.body

    if (!(playlist_id > 0 && Number.isInteger(Number(playlist_id)))) {
        throw new ApiError({ status: 400, message: "Invalid playlist ID. It must be a positive integer." });
    }

    if ([name, description].some(data => data?.trim() === "" || data === null)) {
        throw new ApiError({ status: 400, message: "All fields are mandatory." });
    }

    await Playlist.findByIdAndUpdate(playlist_id, {
        name,
        description
    })

    return res.status(200).json(new ApiResponse(200, {}, "playlist Updated successfully"))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}

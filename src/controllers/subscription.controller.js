import mongoose from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";

import { asyncHandler } from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const channel_id = parseInt(req.params.channel_id);
    const user_id = req.user._id;
    console.log([channel_id, user_id, typeof channel_id, typeof user_id])

    // // Validate that channel_id is a valid ObjectId
    // if (!mongoose.Types.ObjectId.isValid(channel_id)) {
    //     throw new ApiError({ status: 400, message: "Invalid channel ID format." });
    // }


    // Check if the channel exists
    const userfind = await User.findById(channel_id);
    if (!userfind) {
        throw new ApiError({ status: 400, message: "The specified channel does not exist." });
    }

    // Check if the user is trying to subscribe to their own channel
    if (channel_id === user_id) {
        throw new ApiError({ status: 400, message: "You can't subscribe to your own channel." });
    }

    // Find existing subscription
    const entrySubscription = await Subscription.findOne({
        channel: channel_id,
        subscriber: user_id
    });

    if (entrySubscription) {
        await Subscription.deleteOne({
            channel: channel_id,
            subscriber: user_id
        });
        return res.status(200).json(new ApiResponse(200, [], "Unsubscribed!"));
    }

    await Subscription.create({
        channel: channel_id,
        subscriber: user_id
    });
    return res.status(200).json(new ApiResponse(200, [], "Subscribed!"));
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {

    const channel_id = parseInt(req.params.channel_id);

    const listOfSubscribers = await Subscription.aggregate([
        {
            // $match: { subscriber: new mongoose.Types.ObjectId(channel_id) }
            $match: { channel: channel_id }
        },
        {
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "usersubscribed"
            }
        },
        {
            $unwind: "$usersubscribed"
        },
        {
            $group: {
                _id: "$usersubscribed._id",
                fullName: { $first: "$usersubscribed.fullName" },
                username: { $first: "$usersubscribed.username" },
                avatar: { $first: "$usersubscribed.avatar" },
                coverImage: { $first: "$usersubscribed.coverImage" },
                email: { $first: "$usersubscribed.email" }
            }
        },
        {
            $project: {
                _id: 1,
                fullName: 1,
                username: 1,
                avatar: 1,
                coverImage: 1,
                email: 1
            }
        }
    ]);

    return res.status(200).json(new ApiResponse(200, listOfSubscribers, "Subscribers fetched successfully"))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const subscriber_id = parseInt(req.params.subscriber_id);


    const listOfChannels = await Subscription.aggregate([
        {
            // $match: { subscriber: new mongoose.Types.ObjectId(subscriber_id) }
            $match: { subscriber: subscriber_id }
        },
        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "channelsubscribed"
            }
        },
        {
            $unwind: "$channelsubscribed"
        },
        {
            $group: {
                _id: "$channelsubscribed._id",
                fullName: { $first: "$channelsubscribed.fullName" },
                username: { $first: "$channelsubscribed.username" },
                avatar: { $first: "$channelsubscribed.avatar" },
                coverImage: { $first: "$channelsubscribed.coverImage" },
                email: { $first: "$channelsubscribed.email" }
            }
        },
        {
            $project: {
                _id: 1,
                fullName: 1,
                username: 1,
                avatar: 1,
                coverImage: 1,
                email: 1
            }
        }
    ]);

    return res.status(200).json(new ApiResponse(200, listOfChannels, "Channels fetched successfully"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}
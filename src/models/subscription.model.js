import mongoose, { Schema } from "mongoose"
import { addAutoIncrementId } from "../utils/autoIncreament.js";

const subscriptionSchema = new Schema({
    subscriber: {
        // type: Schema.Types.ObjectId, // one who is subscribing
        type: Number,
        ref: "User"
    },
    channel: {
        // type: Schema.Types.ObjectId, // one to whom 'subscriber' is subscribing
        type: Number,
        ref: "User"
    }
}, { timestamps: true })

addAutoIncrementId(subscriptionSchema, 'Subscription');


export const Subscription = mongoose.model("Subscription", subscriptionSchema)
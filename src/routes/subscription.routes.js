import { Router } from 'express';
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription,
} from "../controllers/subscription.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import { validate } from 'express-validation';
import { channelId } from '../validations/subscription.validations.js';

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
    .route("/c/:channel_id")
    .get(validate(channelId),getUserChannelSubscribers)
    .post(validate(channelId),toggleSubscription);

router.route("/u/:subscriber_id").get(getSubscribedChannels);

export default router
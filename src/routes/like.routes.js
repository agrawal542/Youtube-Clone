import { Router } from 'express';
import {verifyJWT} from "../middlewares/auth.middleware.js"
import { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from '../controllers/like.controller.js';

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/toggle/v/:video_id").post(toggleVideoLike);
router.route("/toggle/c/:comment_id").post(toggleCommentLike);
router.route("/toggle/t/:tweet_id").post(toggleTweetLike);
router.route("/videos").get(getLikedVideos);

export default router
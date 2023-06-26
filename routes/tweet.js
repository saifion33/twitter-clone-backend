import { Router } from 'express'
import { deleteReply, deleteTweet, getAllTweets, getTweetReplies, likeTweet, postTweet, replyTweet } from '../controllers/tweet.js';
import auth from '../middleware/auth.js';

const router = Router();

// ** 1. get all tweets
router.get('/alltweets', getAllTweets)

// ** 2. post new tweet
router.post('/post', auth, postTweet)

// ** 3. reply tweet
router.patch('/reply/:tweetId', auth, replyTweet)

// ** 4. like tweet
router.patch('/like/:tweetId', auth, likeTweet)

// ** 5. get tweet replies
router.get('/gettweetreplies/:tweetId', getTweetReplies)

// ** 6. delete tweet
router.delete('/delete/:tweetId', auth, deleteTweet)

// ** 7. delete reply
router.delete('/delete/reply/:tweetId/:replyId', auth, deleteReply)

export default router;
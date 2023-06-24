import mongoose from 'mongoose'
import Tweet from '../models/tweet.js'
import Replies from '../models/reply.js'

// ** 1. ************************************** GET ALL TWEETS *****************************************************************
export const getAllTweets = async (req, res) => {
    try {
        const tweets = await Tweet.find()
        if (tweets) {
            return res.status(200).json({ message: 'Tweets found', data: tweets })
        }
        res.status(404).json({ message: 'tweets not found', data: null })
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', data: null })
    }
}

// ** 2. ************************************** POST TWEET *********************************************************************
export const postTweet = async (req, res) => {
    const { imageUrl, tweet, user } = req.body;
    user.id = req.userId;
    Tweet.create({ imageUrl, tweet, user }).then((response) => res.status(200).json({ message: 'Tweet Posted successfully.', data: response })).catch(err => { res.send('error creating tweet' + err) })
}

// ** 3. ************************************** REPLY TWEET ********************************************************************
export const replyTweet = async (req, res) => { 
    const tweetId = req.params.tweetId
    const replyOf = req.query.replyOf
    const { replyTweet: tweet, user, imageUrl } = req.body;
    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
        return res.status(404).json({ message: 'Invalid tweet id', data: null })
    }
    try {
        const postedReplies = await Replies.findOneAndUpdate({ tweetId }, {
            $push: { replies: { tweet, user, imageUrl, replyOf: tweetId } }
        }, { new: true, upsert: true })
        const newReply = postedReplies.replies[postedReplies.replies.length - 1]
        if (replyOf) {
            const response = await Replies.findOne({ tweetId: replyOf })
            if (response) {
                response.replies.map(reply => {
                    if (reply._id == tweetId) {

                        reply.replyCount += 1;
                        response.save()
                        return res.status(200).json({ message: 'Replied successfully', data: newReply })
                    }
                })
                return
            }
            return res.status(404).json({ message: 'Tweet to reply not found ', data: null })
        }
        await Tweet.findByIdAndUpdate(tweetId, {
            $inc: { replyCount: 1 }
        })
        res.status(200).json({ message: 'Replied successfully', data: newReply })

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', data: null })
    }
}

// ** 4. ************************************** LIKE TWEET *********************************************************************
export const likeTweet = async (req, res) => { 
    const tweetId = req.params.tweetId
    const replyOf = req.query.replyOf
    const { replyTweet: tweet, user, imageUrl } = req.body;
    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
        return res.status(404).json({ message: 'Invalid tweet id', data: null })
    }
    try {
        const postedReplies = await Replies.findOneAndUpdate({ tweetId }, {
            $push: { replies: { tweet, user, imageUrl, replyOf: tweetId } }
        }, { new: true, upsert: true })
        const newReply = postedReplies.replies[postedReplies.replies.length - 1]
        if (replyOf) {
            const response = await Replies.findOne({ tweetId: replyOf })
            if (response) {
                response.replies.map(reply => {
                    if (reply._id == tweetId) {

                        reply.replyCount += 1;
                        response.save()
                        return res.status(200).json({ message: 'Replied successfully', data: newReply })
                    }
                })
                return
            }
            return res.status(404).json({ message: 'Tweet to reply not found ', data: null })
        }
        await Tweet.findByIdAndUpdate(tweetId, {
            $inc: { replyCount: 1 }
        })
        res.status(200).json({ message: 'Replied successfully', data: newReply })

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', data: null })
    }
}

// ** 5. ************************************** GET TWEET REPLY ****************************************************************
export const getTweetReplies = async (req, res) => { 
    const tweetId = req.params.tweetId
    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
        return res.status(404).json({ message: 'Invalid tweet id', data: null })
    }
    try {
        const response = await Replies.findOne({ tweetId })
        console.log('Getting tweet')
        if (response) {
            return res.status(200).json({ message: 'Replies get Successfully .', data: response.replies })
        }
        res.status(200).json({ message: "Tweet does not have replies", data: [] })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error', data: error })
    }
}

// ** 6. ************************************** DELETE TWEET *******************************************************************
export const deleteTweet = async (req, res) => {
    const tweetId = req.params.tweetId
    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
        res.status(400).json({ message: 'Invalid tweet Id.', data: null })
    }
    try {
        const response = await Tweet.findByIdAndDelete(tweetId)
        if (response) {
            await Replies.findOneAndDelete({ tweetId })
            return res.status(200).json({ message: 'Tweet deleted successfully.', data: null })
        }
        res.status(404).json({ message: 'Tweet not found.', data: null })
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message })
    }
}

// ** 7. ************************************** DELETE REPLY *******************************************************************
export const deleteReply = async(req, res) => { 
    const tweetId = req.params.tweetId;
    const replyId = req.params.replyId;
    try {
        const tweet = await Replies.findOneAndUpdate({ tweetId }, {
            $pull: { replies: { _id: replyId } }
        }, { new: true })
        if (tweet) {
            return res.status(200).json({ message: 'Tweet find', data: tweet })
        }
        res.status(404).json({ message: 'Tweet not found', data: null })
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', data: null })
    }
}
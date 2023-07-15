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
    const userId = req.userId;
    try {
        if (replyOf) {
            const response = await Replies.findOne({ tweetId: replyOf })
            if (response) {
                response.replies.map(async (reply) => {
                    if (reply._id == tweetId) {
                        if (reply.likes.includes(userId)) {
                            const newlikes = reply.likes.filter(id => id != userId)
                            reply.likes = newlikes
                        }
                        else if (!reply.likes.includes(userId)) {
                            reply.likes.push(userId)
                        }
                        await response.save()
                        return res.status(200).json(reply)
                    }
                })
                return
            }
            return res.status(404).json({ message: 'Tweet not found', data: null })
        }
        const response = await Tweet.findById(tweetId)
        if (response) {
            if (response.likes.includes(userId)) {
                const newlikes = response.likes.filter(id => id != userId)
                response.likes = newlikes
            }
            else if (!response.likes.includes(userId)) {
                response.likes.push(userId)
            }
            await response.save()
            return res.status(200).json(response)
        }
        res.status(404).json({ message: 'Tweet not found', data: null })
    } catch (error) {
        console.log(error)
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
        return res.status(400).json({ message: 'Invalid tweet Id.', data: null })
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
export const deleteReply = async (req, res) => {
    const tweetId = req.params.tweetId;
    const replyId = req.params.replyId;
    try {
        const tweet = await Replies.findOneAndUpdate({ tweetId }, {
            $pull: { replies: { _id: replyId } }
        }, { new: true })
        if (tweet) {
            await Tweet.findByIdAndUpdate(tweetId, {
                $inc: { replyCount: -1 }
            })
            return res.status(200).json({ message: 'Tweet deleted successfully.', data: tweet })
        }
        res.status(404).json({ message: 'Tweet not found', data: null })
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', data: null })
    }
}

// ** 8. ************************************** GET TWEET BY ID ****************************************************************
export const getTweetById = async (req, res) => {
    const tweetId = req.params.tweetId
    const replyOf = req.query.replyOf
    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
        return res.status(401).json({ message: 'Invalid tweet id', data: null })
    }
    try {
        if (!replyOf) {
            const tweet = await Tweet.findById(tweetId)
            if (tweet) {
                return res.status(200).json({ message: 'Get tweet successfully', data: tweet })
            }
        }
        else {
            const tweet = await Replies.findOne({ tweetId: replyOf })
            if (tweet) {
                const reply = tweet.replies.filter(reply => reply._id == tweetId)[0]
                if (reply) {
                    return res.status(200).json({ message: 'Get tweet successfully', data: reply })
                }
                return res.status(404).json({ message: 'Tweet not found', data:null })
            }
            res.status(404).json({ message: 'Tweet not found', data:null })
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error', data: null })
    }

}
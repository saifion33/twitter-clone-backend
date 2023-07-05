import mongoose from "mongoose";

const schema = new mongoose.Schema({
    tweetId: String,
    replies: [{
        tweet: String,
        imageUrl: String,
        user: { name: String, userName: String, id: String, avatarUrl: String },
        likes: [String],
        views: Number,
        replyOf: String,
        replyCount: { type: Number, default: 0 },
        postedOn: { type: Date, default: Date }

    }]
});


export default mongoose.model('Reply', schema)
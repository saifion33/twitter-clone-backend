import mongoose from "mongoose";

const schema = new mongoose.Schema({
    tweetId: String,
    replies: [{
        tweet: String,
        imageUrl: String,
        user: { name: String, userName: String, id: String, avatarUrl: String },
        likes: [String],
        views: Number,
        postedOn: { type: Date, default: Date.now() }
    }]
});


export default mongoose.model('Reply', schema)
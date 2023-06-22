import mongoose from "mongoose";
const schema = new mongoose.Schema({
    tweet: String,
    imageUrl: String,
    user: { type: Object },
    likes: [String],
    views: Number,
    replyCount: { type: Number, default: 0 },
    postedOn: { type: Date, default: Date.now() }
});


export default mongoose.model('Tweet', schema)
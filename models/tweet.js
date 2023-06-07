import mongoose from "mongoose";

const schema = new mongoose.Schema({
    tweet: String,
    imageUrl: String,
    userId: String,
    postedOn: { type: Date, default: Date.now() }
});


export default mongoose.model('Tweet', schema)
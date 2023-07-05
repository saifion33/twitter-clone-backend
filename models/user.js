import mongoose from "mongoose";

const schema = new mongoose.Schema({
    name: String,
    email: String,
    userName: String,
    bio: String,
    id: String,
    location: String,
    avatarUrl: String,
    bannerUrl: String,
    following: [String],
    followers: [String],
    joinedOn: { type: Date, default: Date }
});


export default mongoose.model('User', schema)
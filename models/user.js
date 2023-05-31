import mongoose from "mongoose";

const schema = new mongoose.Schema({
    name: String,
    email: String,
    joinedOn:{type:Date,default:Date.now()}
});


export default mongoose.model('User', schema)
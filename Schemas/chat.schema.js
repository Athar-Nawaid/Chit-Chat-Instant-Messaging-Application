import mongoose from "mongoose";

let chatSchema = new mongoose.Schema({
    user:String,
    message:String,
    timeStamp:Date
});


export const chatModel = mongoose.model('Message',chatSchema);
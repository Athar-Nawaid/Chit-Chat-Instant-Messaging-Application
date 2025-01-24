import mongoose from "mongoose";

let activeUserSchema = new mongoose.Schema({
    user:String
});


let activeUserModel = mongoose.model('Active',activeUserSchema);

export default activeUserModel;
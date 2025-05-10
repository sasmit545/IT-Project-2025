import mongoose from "mongoose";

const WebsiteSchema = new mongoose.Schema({
    sourcecode:{
        type: Array,
        required: true,
        default: ""
    }
    ,
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name:{
        type: String,
        required: true,
        default: ""
    }
},{timestamps:true});

const Website = mongoose.model("Website", WebsiteSchema);
export default Website;
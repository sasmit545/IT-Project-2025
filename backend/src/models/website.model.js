import mongoose from "mongoose";

const WebsiteSchema = new mongoose.Schema({
    sourcecode:{
        type: Array,
        required: true,
        default: ""
    }
    ,
    owner:{
        type:String,
        required: true,
    },
    name:{
        type: String,
        required: true,
        default: ""
    },
    accessType: {
        type: Boolean,  //false->private, true->public
        required: true,
        default: false
    }
},{timestamps:true});

const Website = mongoose.model("Website", WebsiteSchema);
export default Website;
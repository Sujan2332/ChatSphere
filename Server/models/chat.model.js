const mongoose = require("mongoose")

const chatSchema = new mongoose.Schema({
    chatID: {
        type: mongoose.Schema.Types.ObjectId, required: true, unique: true 
    },
    participants:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    messages:[
        {
            sender:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
            text:{type:String,required:true},
            timestamp:{type:Date,default:Date.now},
        },
    ],
    updatedAt:{type:Date,default:Date.now}
})

module.exports = mongoose.model("Chat",chatSchema)
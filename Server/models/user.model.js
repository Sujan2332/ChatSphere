const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    mobile:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    contacts:{
        type:[
        {
            name:String,
            mobile:String,
            isRegistered:{type:Boolean,default:false}
        },],
        default:[]
},
    createdAt:{type:Date,default:Date.now}
})

module.exports = mongoose.model("User",userSchema)
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
    avatar: {
        type: String, // URL of the selected avatar
        required: true, // Make it required if the avatar is mandatory during registration
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
},{ collection: 'chatusers' } )
>>>>>>> d3d9b49450bdedab3cd30a480208eb0ed745af0e

module.exports = mongoose.model("User",userSchema)

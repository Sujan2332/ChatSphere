const mongoose = require("mongoose")

const invitationSchema = new mongoose.Schema({
    inviter:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
        ,required:true
    },
    inviteeMobile:{
        type:String,
        required:true
    },
    inviteeName:{
        type:String
    },
    status:{
        type:String,
        default:"pending"
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    updatedAt:{
        type:Date,
        default:Date.now
    }
},{ collection: 'invitations' })

module.exports = mongoose.model("Invitation",invitationSchema)
const Invitation = require("../models/invitation.model")

exports.sendInvitation = async (req,res) =>{
    try{
        const {inviteeMobile,inviteeName} = req.body

        const existingInvitation = await Invitation.findOne({
            inviter: req.user.id,
            inviteeMobile,
        })

        if(existingInvitation){
            return res.status(400).json({message:"Invitation Already Sent."})
        }

        const newInvitation = new Invitation({
            inviter : req.user.id,
            inviteeMobile,
            inviteeName,
        })

        await newInvitation.save()

        res.status(201).json({message:"Invitation Sent Successfully.",invitation:newInvitation})
    }catch(err){
        res.status(500).json({message:"Error Sending invitation.",error:err.message})
    }
}
const express = require('express')
const {sendInvitation}= require("../controllers/invitation.controller")
const {authMiddleware}= require("../middlewares/authentication.middleware.js")
const router = express.Router()

router.post("/send",authMiddleware,sendInvitation)

module.exports = router
const express = require("express")
const {registerUser,fetchContacts,loginUser, fetchAvailableUsers} = require("../controllers/user.controller.js")
const {authMiddleware}= require("../middlewares/authentication.middleware.js")

const router = express.Router()

router.post('/register',registerUser)
router.post('/login',loginUser)
router.get('/contacts',authMiddleware,fetchContacts)
router.get('/available',authMiddleware,fetchAvailableUsers)

module.exports = router
const express = require("express")
const {createOrFetchChat,sendMessage, getChatMessages} = require("../controllers/chat.controller")
const {authMiddleware} = require("../middlewares/authentication.middleware")

const router = express.Router()

router.post("/createOrFetch",authMiddleware,createOrFetchChat)
router.post("/message",authMiddleware,sendMessage)
router.get('/:chatId/messages', authMiddleware, getChatMessages);

module.exports = router
const Chat = require("../models/chat.model")
const mongoose = require("mongoose")
exports.createOrFetchChat = async (req, res) => {
  try {
    const { participantId } = req.body;
    console.log("Participant ID:", participantId);
    console.log("User from Middleware:", req.user);

    // Ensure that participantId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(participantId)) {
      return res.status(400).json({ message: "Invalid participant ID" });
    }

    // Ensure the logged-in user is correctly set
    const userId = req.user.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Check if the user is trying to create a chat with themselves
    if (userId === participantId) {
      return res.status(400).json({ message: "You cannot create a chat with yourself." });
    }

    // Check if the chat already exists for these two users
    const existingChat = await Chat.findOne({
      participants: { $all: [userId, participantId] }
    }).populate("participants", "-password");

    if (existingChat) {
      return res.json({
        message: "Chat fetched successfully.",
        chatId: existingChat.chatID,  // Return chatID
      });
    }

    // If chat doesn't exist, create a new one with ObjectId as chatID
    const newChat = new Chat({
      participants: [userId, participantId],
      chatID: new mongoose.Types.ObjectId(), // Generate an ObjectId for chatID
    });
    console.log("Chat ID to be saved:", newChat.chatID);
    // Save the new chat
    await newChat.save();

    return res.status(201).json({
      message: "Chat created successfully.",
      chatId: newChat.chatID.toString(),  // Return chatID
    });
  } catch (err) {
    console.error(err); // Log the error to check the underlying issue
    return res.status(500).json({ message: "Error creating chat.", error: err.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { chatId, text } = req.body;
    console.log("Chat ID:", chatId);  // For debugging
    console.log("Message Content:", text);  // For debugging

    // Find the chat by chatID, which is a string in your schema
    const chat = await Chat.findOne({ chatID: chatId });

    if (!chat) {
      return res.status(404).json({ message: "Chat Not Found" });
    }

    const message = {
      sender: req.user.id,  // Ensure user ID is included as sender
      text,  // This is the message content
      timestamp: new Date(),  // Timestamp for the message
    };

    chat.messages.push(message);  // Add the message to the chat
    chat.updatedAt = new Date();  // Update the last updated timestamp
    await chat.save();  // Save the updated chat

    res.status(201).json({ message: "Message Sent Successfully", chat });
  } catch (err) {
    res.status(500).json({ message: "Error sending message.", error: err.message });
  }
};

  // In your controller
  exports.getChatMessages = async (req, res) => {
    try {
      const { chatId } = req.params;  // chatId from the URL params
      // console.log("Fetching messages for chat ID:", chatId);
  
      // Find the chat by chatId and populate participant details
      const chat = await Chat.findOne({ chatID: chatId })
        .populate("participants", "-password")  // Populate participants excluding password
        .exec();
  
      if (!chat) {
        return res.status(404).json({ message: "Chat not found." });
      }
  
      // Map through the messages and add the sender's name
      const messagesWithSenderNames = chat.messages.map(message => {
        // Find the participant whose _id matches the sender's id
        const sender = chat.participants.find(participant => 
          participant._id.toString() === message.sender.toString()
        );
  
        // Add the sender's name to the message
        return {
          ...message,
          senderName: sender ? sender.name : "Unknown"
        };
      });
  
      // Log the fetched data with sender names
      // console.log("Fetched Chat Data with Sender Names:", messagesWithSenderNames);
  
      // Return the messages with sender names
      return res.status(200).json({
        messages: messagesWithSenderNames,
        participants: chat.participants,  // Include participant details
      });
  
    } catch (err) {
      console.error("Error fetching messages:", err);
      return res.status(500).json({ message: "Error fetching chat messages.", error: err.message });
    }
  };  
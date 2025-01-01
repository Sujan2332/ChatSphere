const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/user.model")

exports.registerUser = async (req, res) => {
    try {
        const { name, email, mobile, password, contacts = [] } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { mobile }],
        });

        if (existingUser) {
            return res.status(400).json({ message: "User Already Exists" });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user object
        const newUser = new User({
            name,
            email,
            mobile,
            password: hashedPassword,
            contacts: contacts.map((contact) => ({
                name: contact.name,
                mobile: contact.mobile,
                isRegistered: false,
            })),
        });

        // Save the new user to the database
        await newUser.save();

        // Create a JWT token
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: "30d",
        });

        // Send the response with the token and user details
        res.status(201).json({
            message: "User Registered Successfully",
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                mobile: newUser.mobile,
            },
        });
    } catch (err) {
        console.error("Error Registering User:", err);
        res.status(500).json({ message: "Error Registering User", error: err.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { emailOrMobile, password } = req.body;

        console.log("Login attempt with:", emailOrMobile);  // Add debugging here

        // Find user by email or mobile
        const user = await User.findOne({
            $or: [{ email: emailOrMobile }, { mobile: emailOrMobile }],
        });

        // If no user found
        if (!user) {
            return res.status(400).json({ message: "User Not Found" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials." });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "30d",
        });

        // Return response with token and user data
        res.json({
            message: "User Logged in Successfully",
            token,
            user: { id: user._id, name: user.name, email: user.email, mobile: user.mobile },
        });
    } catch (err) {
        console.error("Error Logging in User:", err);  // Log error for debugging
        res.status(500).json({ message: "Error Logging in User", error: err.message });
    }
};

exports.fetchContacts = async(req,res)=>{
    try{
        const user = await User.findById(req.user.id)
        if(!user){
            return res.status(400).json({message:"User not found"})
        }

        const contacts = await Promise.all(
            user.contacts.map(async (contact) =>{
                const registeredUser = await User.findOne({mobile:contact.mobile})
                return{
                    ...contact._doc,
                    isRegistered:!!registeredUser,
                }
            })
        )

        res.json({message:"Contacts fetched Successfully",contacts})
    } catch(err){
        res.status(500).json({message:"Error Fetchin Contacts.", error:err.message})
    }
}

exports.fetchAvailableUsers = async (req, res) => {
    try {
        const currentUser = req.user.id;

        // Fetch all users except the logged-in user
        const availableUsers = await User.find(
            { _id: { $ne: currentUser } }, // Exclude the current user
            { name: 1, mobile: 1 } // Select only the required fields
        );

        res.json({ message: "Available users fetched successfully", users: availableUsers });
    } catch (err) {
        console.error("Error Fetching Available Users:", err);
        res.status(500).json({ message: "Error Fetching Available Users", error: err.message });
    }
};

const rateLimit = require("express-rate-limiter")

const limiter = rateLimit({
    windowsMs: 15 * 60 * 1000,
    max: 100,
    message:"Too many requuests from this IP, please try again later."
})

module.exports = limiter
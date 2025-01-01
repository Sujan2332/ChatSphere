const {validationResult, check} = require("express-validator")

const validateRequest = (validations) => async (req,res,next) =>{
    await Promise.all(validations.map((validation) => validate.run(req)))

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400),json({errors:errors.array()})
    }
    next()
} 

const validateRegistration = [
    check("email").isEmail().withMessage("Please Enter Valid Email Address"),
    check("mobile").isLength({min:10,max:10}).withMessage("Mobile Number must be 10 digits"),
    check("password").isLength({min:6}).withMessage("Password must be at least 6 characters")
]

module.exports = {validateRequest,validateRegistration}
import { Users } from "../models/user.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { sendCookie } from "../utils/features.js";
import ErrorHandler from "../middlewares/error.js";




    
//register
export const register=async(req,res)=>{
try {
    const{name,email,password} =req.body;
    let user= await Users.findOne({email});
    
    if(user) return next(new ErrorHandler("User Already Exist",400))
   const passHash=await bcrypt.hash(password,10)
   user= await Users.create({name,email,password:passHash});
   sendCookie(user,res,"Registered Successfully",201)
} catch (error) {
    next(error)
}

};
//


// Login endpoint handler
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
    const user = await Users.findOne({ email }).select('+password');
    if(!user) return next(new ErrorHandler("Invalid Email or Password",400))
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return next(new ErrorHandler("Invalid Email or Password",400))
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.cookie('token', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // Example: 24 hours
    }).json({
        success: true,
        message: `Welcome back, ${user.name}`
    });
    } catch (error) {
      next(error)  
    }
};


////getUserDetails
 export const getUserDetails=(req,res)=>{   
    res.status(200).json({
        success:true,
        user:req.user,
    });
    

};

//logout
export const logout=(req,res)=>{   
    res.status(200).cookie("token","",{expires:new Date(Date.now()),
        sameSite:process.env.NODE_ENV==="Development" ? "lax":"none",
        secure:process.env.NODE_ENV==="Development" ? false:true,
    
    }).json({
        success:true,
        user:req.user,
    });
    

};
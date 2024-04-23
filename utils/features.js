import jwt from "jsonwebtoken"

export const sendCookie=(user,res,message,statusCodde=200)=>{
    const token=jwt.sign({_id:user._id},process.env.JWT_SECRET)
 res.status(statusCodde).cookie("token",token,{
    httpOnly:true,
    maxAge:1*60*1000,
    sameSite:process.env.NODE_ENV==="Development" ? "lax":"none",
    secure:process.env.NODE_ENV==="Development" ? false:true,
 }).json({
    success:true,
    message
 })
}
// Importing required modules
import express from "express";
import path from "path";
import mongoose from 'mongoose';
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"



// Connecting to MongoDB database
mongoose.connect("mongodb://localhost:27017",{dbName:"backend"})
.then(()=>console.log("Database connected"))
.catch((e)=>console.log(e))

/*// Defining the schema for the message collection
const messageSchema = new mongoose.Schema({
    name: String,
    email: String
});

// Creating a model from the schema
const Message = mongoose.model("Message", messageSchema); 

// Handling GET request to add a message to the database
app.get("/add", async (req, res) => {
    // Creating a new message in the database
    await Message.create({ name: "eashan", email: "shgah@jhjh.com" }).then(() => {
        res.send("nice");
    });
});

// Handling GET request to show success page
app.get("/success", (req, res) => {
    res.render("success");
});

// Handling POST request to submit a contact form
app.post("/contact", async (req, res) => {
    
    const { name, email } = req.body;
    await Message.create({ name: name, email: email });
    res.redirect("/success");
});
// Handling GET request for fetching users
app.get("/users", (req, res) => {
    res.json({
        users,
    });
}); 
*/







const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password:String
});
const User = mongoose.model("User", userSchema);

// Creating an Express app
const app = express();

// Middlewares

app.use(express.static(path.join(path.resolve(),"public")));
// Parsing URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Setting the view engine to EJS
app.set("view engine", "ejs");


 const isAuthenticated=async(req,res,next)=>{
    const {token} =req.cookies;
   if(token){
    const decoded=jwt.verify(token,"drtfstffhffhffghbzedhttfsfs");
    req.user=  await User.findById(decoded._id)
    next();

   }
   else{
    res.redirect("/login")

   }

 }

// Handling GET request to the root URL
app.get("/",isAuthenticated ,(req, res) => {
   res.render("logout",{name:req.user.name});
 
});

app.get("/register",(req, res) => {
    res.render("register");
  
 });

 app.get("/login",(req,res)=>{
    res.render("login")
 })

 app.post("/login", async(req,res)=>{
    const {email,password}=req.body;
    let user=await User.findOne({email})
    if(!user) return res.redirect("/register")
    const isMatch= await bcrypt.compare(password,user.password);
if(!isMatch) return res.render("login",{email,message:"Incorrect Password"});
const token= jwt.sign({_id:user._id},"drtfstffhffhffghbzedhttfsfs")

    res.cookie("token",token,{
        httpOnly:true
    });
    res.redirect("/")
 })

app.post("/register",async(req,res)=>{
    const {name,email,password}=req.body;
    let user=await User.findOne({email})
    if(user){
        return  res.redirect("/login")
    }
    const hashedPassword=await bcrypt.hash(password,10);
    user= await User.create({
        name,
        email,
        password:hashedPassword
    });
    const token= jwt.sign({_id:user._id},"drtfstffhffhffghbzedhttfsfs")

    res.cookie("token",token,{
        httpOnly:true
    });
    res.redirect("/")
})

app.get("/logout",(req,res)=>{
    res.cookie("token",null,{
        httpOnly:true,
        expires:new Date(Date.now())
    });
    res.redirect("/")
})





// Listening on port 5000
app.listen(5000, () => {
    console.log("hello") ;
});

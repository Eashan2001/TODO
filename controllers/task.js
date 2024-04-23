import { Task } from "../models/task.js";
import ErrorHandler from "../middlewares/error.js";
//add newtask
export const newTask=async(req,res,next)=>{
    try{
        const {title,description}=req.body;
    await Task.create({
        title,
        description,
        user:req.user

    });
    res.status(201).json({
        success:true,
        message:"Task added Successfully"
    })
    }catch(error){
        next(error)
    }
}

//show mytask
export const myTask=async(req,res,next)=>{
  try {
    const userid=req.user._id;
    const tasks=await Task.find({user:userid});
     res.status(201).json({
         success:true,
         tasks
     })
    
  } catch (error) {
    next(error);
  }
}
 //update task
export const updateTask=async(req,res,next)=>{
try {
    const task=await Task.findById(req.params.id);
if(!task){
    return res.status(200).json({
        success:false,
        message:"Invalid Id"
    })
}
task.isCompleted=!task.isCompleted;
await task.save();
return next(new Error ("Invalid Id"))
} catch (error) {
    next(error)
}
 }

 //delete task
 export const deleteTask=async(req,res,next)=>{
try {
    const task=await Task.findById(req.params.id);
if(!task){
    return next(new ErrorHandler("Task not found",404))
}
await task.deleteOne();
     res.status(200).json({
         success:true,
         message:err.message
         
     })
} catch (error) {
    next(error)
    
}
 }
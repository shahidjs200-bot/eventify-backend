import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';


export const genrateToken = (res,userId)=>{
    const token = jwt.sign({userId} , process.env.JWT_SECRET,{expiresIn : '7d'});
    res.cookie('jwt',token,{
        httpOnly: true,
        secure: false, // change to true in production
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return token;
};

// register code 
export const registerUser = async (req,res)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()})
  };
   const {email,password} = req.body;

   try{
       const exists = await User.findOne({email});
       if(exists) return res.status(400).json({ message :'user already existe'});
       const user = await User.create({email,password});
       const token = genrateToken(res,user._id);

       res.status(201).json({
        _id :user._id,
        email : user.email,
        token,
       });
   }
   catch(err){
      res.status(500).json({message : err.message});
   };

};

//login user 

export const loginUser = async (req,res)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()})
  };
    const {email,password} = req.body;
    if(!email || !password){
      return res.status(400).json({ message: 'email and password required'});
    }
    try{
      const user = await User.findOne({email});
      if(!user){
        return res.status(401).json({ message: 'invalid email or password'});
      }

      if(user.googleId && !user.password){
        return res.status(400).json({ message: 'This account was created using Google. Please use Google login.',})
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = genrateToken(res,user._id);
    res.status(201).json({
      _id : user._id,
      email : user.email,
      role: user.role,
    });
}catch(err){
    console.log(err);
    res.status(500).json({message: err.message});
}
    }
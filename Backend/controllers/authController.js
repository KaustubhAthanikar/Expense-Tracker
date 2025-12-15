const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id) =>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"1h"})
}

exports.registerUser = async(req,res) =>{
    const {fullName,email,password,profileImageURL} = req.body;

    if(!fullName||!email||!password){
        return res.status(400).json({message:"All fields necessary"});
    }

    try{
        //check if the user already exists
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"User already exits"});

        }

        //create user
        const user = await User.create({
            fullName,
            email,
            password,
            profileImageURL
        });

        res.status(201).json({
            id:user._id,
            user: user,
            token:generateToken(user._id),
        });
    }catch(err){
        res
        .status(500)
        .json({message:"error registering user",error:err.message});
    }
};

exports.loginUser = async(req,res) =>{
    const {email,password} = req.body;
    if(!email||!password){
        return res.status(400).json({message:"All fields are required"});
    }

    try{
        const user = await User.findOne({email});
        if(!user || (!user.comparePassword(password))){
            return res.status(400).json({message:"Invalid credentials"});
        }
        res.status(201).json({
            id:user._id,
            user:user,
            token:generateToken(user._id),
        });
    }catch(err){
        res
        .status(500)
        .json({message:"error logging user",error:err.message});
    }
};

exports.getUserInfo = async(req,res) =>{
    try{
        const user = await User.findById(req.user.id).select("-password");
        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        res.status(200).json(user);

    }catch(err){
        res
        .status(500)
        .json({message:"error finding user",error:err.message});
    }
};
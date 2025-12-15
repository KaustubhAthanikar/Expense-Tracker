const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    fullName:{type:String, required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    profileImageURL:{type:String,default:null}
},{
    timestamps:true
});

//Hashing password before saving
UserSchema.pre("save",async function (){
    if(!this.isModified("password")) return ;
    this.password = await bcrypt.hash(this.password,10);
});

//compare passwords 
UserSchema.methods.comparePassword = async function (candidatePassword){
    return await bcrypt.compare(candidatePassword,this.password);
};

module.exports = mongoose.model("User",UserSchema);
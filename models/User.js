import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    email : {type : String , required: true , unique: true , lowercase: true,},
    password : {type: String},
    role: {
    type: String,
    enum: ["user", "organizer"],
    default: "user",
},
    googleId: {type : String }
},
 {timestamps:true}
);

userSchema.pre('save', async function (next) {
    if (!this.password) return next();
    if(!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt)
    next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    if (!this.password) return false;
    return await bcrypt.compare(enteredPassword,this.password);

}

export default mongoose.model('User',userSchema)
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
       minlength: [8, 'password must be 8 characters long']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    age: {
        type: Number,
        min: 0,
    },
    role: {
        type: String,
        required: true,
    },
    image:{
        type:String,
        required:false
    }
    
}, {
    timestamps: true, 
});

const User = mongoose.model('Userm', userSchema); 

export default User;

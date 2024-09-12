import mongoose, { Schema } from "mongoose";
const proSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
        minlength:[0,'price cannot be -ive']
    },
    description:{
        type:String,
        required:true,
        maxlength:400,
    },
    stock:{
     type:Number,
     required:true,
     minlength:[0]
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:"Userm"
    }
},
    {
        timestamps:true,
    }
);
const product=mongoose.model('products',proSchema);
export default product;
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Userm', 
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Userm', 
        required: true,
    },
    categories: {
        type: [String], 
        required: false,
    },
    comments: [commentSchema],                            // Array of comments on the blog post
    isPublished: {
        type: Boolean,
        default: false,
    },
    publishedAt: {
        type: Date,
    },
    image:{
        type:String,
        required:false,
    }
}, {
    timestamps: true, 
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;

import mongoose from "mongoose";

const faqSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    },
    category: {
        type: String, 
        required: false,
    },
    }, {
    timestamps: true, 
});

const FAQ = mongoose.model('FAQ', faqSchema);

export default FAQ;

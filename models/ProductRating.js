import mongoose, { Schema } from 'mongoose';

const productRatingSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5, // Assuming ratings are between 1 to 5 stars
    },
    review: {
        type: String,
        maxlength: 500,
        required: false,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Userm',
        required: true,
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'products',
        required: true,
    },
}, {
    timestamps: true,
});

const ProductRating = mongoose.model('ProductRating', productRatingSchema);
export default ProductRating;

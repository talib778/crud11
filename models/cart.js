import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products', 
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 0,                         //not in -ive
    }
});

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Userm', 
        required: true,
    },
    items: [cartItemSchema],                       // Array of items in the cart
}, {
    timestamps: true, 
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;

import express from 'express';
import { postData, getData, deleteData, updateById, createProduct, getProductData, updateProductById, deleteProduct, addToCart, removeFromCart, getCart, createFAQ, getFAQs, updateFAQ, deleteFAQ, createBlog, getBlogs, updateBlog, deleteBlog, createProductRating, getProductRatings, updateProductRating, deleteProductRating } from '../controller/user.js';
import { forgetPassword, loginUser, logoutUser, registerUser, resetPassword } from '../controller/auth.js';
import { authentication,authorizeRole } from '../middleware/middleware.js';
import { Roles } from '../controller/roles.js';
import { upload } from '../utils/helper.js';

const route = express.Router();

// user Public routes
route.post('/register/user',upload.single('image'), registerUser);
route.post('/login/user', loginUser);
route.post('/logout/user', logoutUser);
route.post('/forget-password',forgetPassword);
route.post('/reset-password/:token',resetPassword);


// user Protected routes
route.post('/add/user', authentication, authorizeRole(Roles.ADMIN), postData);
route.get('/get/user', authentication, getData);  // Accessible by any authenticated user

route.delete('/delete/user/:id', authentication, authorizeRole(Roles.ADMIN), deleteData); // Only admin can delete data
route.put('/update/user/:id', authentication, authorizeRole(Roles.ADMIN), updateById);  // Only admin can update data


//product routes
route.post('/add/product',authentication,authorizeRole(Roles.ADMIN),createProduct)
route.get('/get/product',authentication,getProductData);
route.put('/update/product/:id', authentication, authorizeRole(Roles.ADMIN), updateProductById); // Only admin can update products
route.delete('/delete/product/:id', authentication, authorizeRole(Roles.ADMIN), deleteProduct); // Only admin can delete products

//addToCart routes
route.post('/add/cart',authentication,addToCart);
route.delete('/remove/cart',authentication,removeFromCart);
route.get('/get/cart', authentication, getCart);
//FAQ routes
route.post('/add/faq',authentication,authorizeRole(Roles.ADMIN),createFAQ);
route.get('/get/faq',authentication,getFAQs);
route.put('/update/faq/:id', authentication, authorizeRole(Roles.ADMIN),updateFAQ);
route.delete('/delete/faq/:id', authentication, authorizeRole(Roles.ADMIN),deleteFAQ);
//Blog route
route.post('/add/blog',upload.single('image'), authentication, authorizeRole(Roles.ADMIN), createBlog); // Only admin can create a blog
route.get('/get/blog', getBlogs); // Public route to get blogs
route.put('/update/blog/:id', authentication, authorizeRole(Roles.ADMIN), updateBlog); // Only admin can update a blog
route.delete('/delete/blog/:id', authentication, authorizeRole(Roles.ADMIN), deleteBlog);
//ratings
route.post('/add/rating',authentication,createProductRating);
route.get('/get/rating',authentication,getProductRatings);
route.put('/update/rating/:id',authentication,updateProductRating);
route.delete('/delete/rating/:id',authentication,deleteProductRating);
export default route;
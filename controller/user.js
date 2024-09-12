import User from '../models/user.js';
import Product from '../models/product.js';
import Cart from '../models/cart.js';
import FAQ from '../models/FAQ.js';
import Blog from '../models/Blog.js';
import ProductRating from '../models/ProductRating.js';
//user crud
export const postData = async (req, res) => {
    try {
      const { name, password,email , age, role} = req.body;
      console.log(name, password,email , age, role);
      if(!name|| !password||!email   ||!age||!role){
        return res.status(400).json({message:'plz enter name,email,password,age,role'})
      }
      const isEmailExist=await User.findOne({email});
      if(isEmailExist)
      {
        return res.status(400).json({message:'email already exist'})
      }
      const newUser = new User({ name, password,email , age, role});
      const savedUser = await newUser.save();
      res.status(201).json({
        message:'user created success',
        success:true,
        data:savedUser,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  export const deleteData = async (req, res) => {
    try{
      const {id}=req.params;
      if(!id){
        return res.status(400).json({message:"plz enter id"})
      }
      const user=await User.findByIdAndDelete(id);
      if(!user){
        return res.status(400).json({message:"user not found"});
      }
      res.status(200).json({message:"user deleted success"})
  }catch (error) {
    res.status(500).json({ message: error.message });
}
  }
//updatebyID
export const updateById = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({ message: "Please provide an ID" });
    }

    const user = await User.findByIdAndUpdate(id, updateData, { new: true });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//find by Id and name
export const getData = async (req, res) => {
  try {
    console.log(req.user.email);
    const { id, name } = req.query; 
    let users;

    if (id) {
      users = await User.findById(id);

      if (!users) {
        return res.status(404).json({ message: 'User not found' });
      }
    } else if (name) {
      users = await User.find({ name });

      if (users.length === 0) {
        return res.status(404).json({ message: 'User does not exist' });
      }
    } else {
      users = await User.find();
    }

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Product operations

export const createProduct = async (req, res) => {
  try {
    const { name, price, description, stock,user } = req.body;

    if (!name || !price || !description || !stock ||!user) {
      return res.status(400).json({ message: 'Please enter name,price,description,stock,user:(id)' });
    }

    const newProduct = new Product({ name, price, description, stock,user });                      //can also write (req.body)
    const savedProduct = await newProduct.save();

    res.status(201).json({
      message: 'Product created successfully',
      success: true,
      data: savedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Please provide an ID" });
    }

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({ message: "Please provide an ID" });
    }

    const product = await Product.findByIdAndUpdate(id, updateData, { new: true });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductData = async (req, res) => {
  try {
    const { id, name } = req.query;
    let products;

    if (id) {
      products = await Product.findById(id);

      if (!products) {
        return res.status(404).json({ message: 'Product not found' });
      }
    } else if (name) {
      products = await Product.find({ name: { $regex: new RegExp(name, 'i') } });

      if (products.length === 0) {
        return res.status(404).json({ message: 'Product does not exist' });
      }
    } else {
      products = await Product.find().populate('user');
    }

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//addToCart crud
export const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || !quantity) {
      return res.status(400).json({ message: 'Product userId,productId & quantity' });
    }

    let cart = await Cart.findOne({ userId });

    if (cart) {
      // Check if product already exists in the cart
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

      if (itemIndex > -1) {
        // Update quantity if product exists in the cart
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Add product to items array if it doesn't exist
        cart.items.push({ productId, quantity });
      }
    } else {
      // Create a new cart if the user has no cart
      cart = new Cart({
        userId,
        items: [{ productId, quantity }]
      });
    }

    const savedCart = await cart.save();
    res.status(201).json({
      message: 'Product added to cart successfully',
      success: true,
      data: savedCart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove from Cart
export const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ message: 'Please provide userId & productId' });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);

    const savedCart = await cart.save();
    res.status(200).json({
      message: 'Product removed from cart successfully',
      success: true,
      data: savedCart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Cart Items
export const getCart = async (req, res) => {
  try {
    const {userId} = req.body;
    if (!userId) {
      return res.status(400).json({ message: 'Please provide a user ID' });
    }
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//FAQ crud
export const createFAQ = async (req, res) => {
  try {
    const { question, answer, category } = req.body;

    if (!question || !answer ||! category) {
      return res.status(400).json({ message: 'Please provide question,answer & category' });
    }

    const newFAQ = new FAQ({ question, answer, category });
    const savedFAQ = await newFAQ.save();

    res.status(201).json({
      message: 'FAQ created successfully',
      success: true,
      data: savedFAQ,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete FAQ
export const deleteFAQ = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Please provide an ID' });
    }

    const faq = await FAQ.findByIdAndDelete(id);
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    res.status(200).json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update FAQ
export const updateFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({ message: 'Please provide an ID' });
    }

    const faq = await FAQ.findByIdAndUpdate(id, updateData, { new: true });

    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    res.status(200).json({ message: 'FAQ updated successfully', faq });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get FAQs
export const getFAQs = async (req, res) => {
  try {
    const { category } = req.query;
    let faqs;

    if (category) {
      faqs = await FAQ.find({ category });
    } else {
      faqs = await FAQ.find();
    }

    res.status(200).json({
      success: true,
      data: faqs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Blog crud
export const createBlog = async (req, res) => {
  try {
    const { title, content, author, categories, isPublished } = req.body;

    if (!title || !content || !author) {
      return res.status(400).json({ message: 'Please provide title,content,author:(userId),categaries,image' });
    }

    const newBlog = new Blog({
      title,
      content,
      author,
      categories,
      isPublished,
      publishedAt: isPublished ? Date.now() : null,
      image:req.file.path,
    });

    const savedBlog = await newBlog.save();

    res.status(201).json({
      message: 'Blog created successfully',
      success: true,
      data: savedBlog,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Blog
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Please provide an ID' });
    }

    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Blog
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({ message: 'Please provide an ID' });
    }

    if (updateData.isPublished) {
      updateData.publishedAt = Date.now();
    }

    const blog = await Blog.findByIdAndUpdate(id, updateData, { new: true });

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.status(200).json({ message: 'Blog updated successfully', blog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Blogs
export const getBlogs = async (req, res) => {
  try {
    const { id, title, category, author } = req.query;
    let blogs;

    if (id) {
      blogs = await Blog.findById(id).populate('author').populate('comments.userId');

      if (!blogs) {
        return res.status(404).json({ message: 'Blog not found' });
      }
    } else if (title) {
      blogs = await Blog.find({ title: { $regex: new RegExp(title, 'i') } }).populate('author');
    } else if (category) {
      blogs = await Blog.find({ categories: { $in: [category] } }).populate('author');
    } else if (author) {
      blogs = await Blog.find({ author }).populate('author');
    } else {
      blogs = await Blog.find().populate('author');
    }

    res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//product rating
export const createProductRating = async (req, res) => {
  try {
      const { rating, review, user, product } = req.body;

      if (!rating || !user || !product) {
          return res.status(400).json({ message: 'Please provide rating,reviews, user:(id), and product:(id)' });
      }

      // Check if the product exists
      const existingProduct = await Product.findById(product);
      if (!existingProduct) {
          return res.status(404).json({ message: 'Product not found' });
      }

      // Create a new rating
      const newRating = new ProductRating({ rating, review, user, product });
      const savedRating = await newRating.save();

      res.status(201).json({
          message: 'Rating created successfully',
          success: true,
          data: savedRating,
      });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};
export const getProductRatings = async (req, res) => {
  try {
      const { productId } = req.body;

      if (!productId) {
          return res.status(400).json({ message: 'Please provide product ID' });
      }

      const ratings = await ProductRating.find({ product: productId }).populate('user', 'name email');

      if (!ratings || ratings.length === 0) {
          return res.status(404).json({ message: 'No ratings found for this product' });
      }

      res.status(200).json({
          success: true,
          data: ratings,
      });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};
export const updateProductRating = async (req, res) => {
  try {
      const { id } = req.params;
      const updateData = req.body;

      if (!id) {
          return res.status(400).json({ message: 'Please provide a rating ID' });
      }

      const rating = await ProductRating.findByIdAndUpdate(id, updateData, { new: true });

      if (!rating) {
          return res.status(404).json({ message: 'Rating not found' });
      }

      res.status(200).json({ message: 'Rating updated successfully', data: rating });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};
export const deleteProductRating = async (req, res) => {
  try {
      const { id } = req.params;

      if (!id) {
          return res.status(400).json({ message: 'Please provide a rating ID' });
      }

      const rating = await ProductRating.findByIdAndDelete(id);

      if (!rating) {
          return res.status(404).json({ message: 'Rating not found' });
      }

      res.status(200).json({ message: 'Rating deleted successfully' });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

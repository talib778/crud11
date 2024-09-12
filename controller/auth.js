import User from "../models/user.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer'
dotenv.config();
let secretKey = process.env.JWT_SECRET;
export const registerUser = async (req, res) => {
  try {
    const { name, password, email, age, role } = req.body;
    console.log(name, password, email, age, role);

    if (!name || !password || !email || !age || !role) {
      return res.status(400).json({ message: 'Please provide name,email,password,age,role,image' });
    }
        // Manual password length validation, schema not working
        if (password.length < 8) {
          return res.status(400).json({ message: 'Password must be at least 8 characters long' });
        }

    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, password: hashedPassword, email, age, role,image:req.file.path });
    const savedUser = await newUser.save();

    res.status(201).json({
      message: 'User created successfully',
      success: true,
      data: savedUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Middleware to verify JWT
export function authenticateToken(req, res, next) {
  const token = req.cookies.authToken;
  if (!token) return res.sendStatus(401);                               //we are not using this

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden if token is invalid
    req.user = user;
    next();
  });
}

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, name:user.name, email: user.email, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('authToken', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });       //not in use verify

    res.status(200).json({
      message: 'Login successful',
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: error.message });
  }
};


export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Please provide an email address." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found. Please register first." });
    }

    // Generate a password reset token
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '5d' });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.MY_GMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.MY_GMAIL,
      to: email,
      subject: "Password Reset Request",
      text: `Click on the link to reset your password: ${process.env.CLIENT_URL}/reset-password?token=${resetToken}`,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "Reset link sent successfully." });
  } catch (error) {
    console.error("Error in forgetPassword:", error);
    return res.status(500).json({ message: "An error occurred while sending the reset link." });
  }
};

// export const resetPassword = async (req, res) => {
//   try{
//   const {token}=req.params;
//   const{password}=req.body;
//   if(!password){
//     return res.status(400).send({message:"plz provide new password"})
//   } 
//   const decode=jwt.verify(token,secretKey);
//   const user=await User.findOne({email:decode.email});
//   const newhashedPassword=await hashedPassword(password);
//    user.password=newhashedPassword;
//    await user.save();
//    return res.status(200).send({message:"password reset successfully"})
//   }catch{
//     return res.status(500).json({ message: "error during reset password" });
//   }
// }


export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).send({ message: "Please provide a new password" });
    }

    // Verify the token
    const decoded = jwt.verify(token, secretKey);

    // Find the user by the decoded email
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(password, salt);

    // Update the user's password
    user.password = newHashedPassword;
    await user.save();

    return res.status(200).send({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error during reset password:", error);
    return res.status(500).json({ message: "Error during reset password" });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie('authToken');
  res.status(200).json({ message: 'Logout successful', success: true });
};
//protected
export const protectRoute=(req,res)=>{
res.send('this is protected route');
}
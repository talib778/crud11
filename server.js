import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import connectdb from './config/db.js';
import bodyParser from 'body-parser';
import route from './routes/user.js';
import { authentication,authorizeRole } from './middleware/middleware.js';
import { Roles } from './controller/roles.js';
import cors from 'cors';
dotenv.config();

const app = express();
app.use(cors({
    origin: 'http://localhost:3000', // Frontend origin
    credentials: true, // Include credentials such as cookies
  }));

app.use(morgan(':method :url :status :res[content-length] :response-time ms'));

// Middleware for parsing JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads',express.static('uploads'));
// Route for testing the server
app.get('/get', (request, response) => {
    response.send('Response got');
});
// Unprotected routes (e.g., registration and login)
app.use('/api/v1', route); 
// Protecting routes with role-based middleware
app.use('/api/v1/pro', authentication, route);

// Example of an admin-only route
app.get('/admin-only', authentication, authorizeRole(Roles.ADMIN), (req, res) => {
    res.send('This is an admin-only route.');
});

// Example of a super admin-only route
app.get('/super-admin-only', authentication, authorizeRole(Roles.SUPER_ADMIN), (req, res) => {
    res.send('This is a super admin-only route.');
});

// Connect to the database
connectdb();

// Start the server
let port = process.env.PORT;
app.listen(port, () => {
    console.log('Server is started at', port);
});

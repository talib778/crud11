import dotenv from 'dotenv'
import express from "express";
import morgan from 'morgan';
const app=express();
app.use(morgan(':method :url :status :res[content-length] :response-time ms'));
//routing 
app.get('/get',(request,response)=>{
response.send('response got');
})
dotenv.config();
let port=process.env.PORT;
app.use(express.json());
app.listen(port,()=>{
    console.log('server is started at', port);
})
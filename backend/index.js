import express from "express"; 
 import dotenv from "dotenv"; 
 import connectDB from "./db/connectDB.js"; 
 import cookieParser from "cookie-parser"; 
 import userRoutes from "./routes/userRoutes.js"; 
 import postRoutes from "./routes/postRoutes.js"; 
 import { v2 as cloudinary } from "cloudinary"; 
 import path from "path"; 
 import { fileURLToPath } from "url";  
 import cors from "cors"; 
  
 dotenv.config(); 
  
 connectDB(); 
 const app = express(); 
  
 const corsConfig = { 
     origin: "https://threads-clone-one.vercel.app", // يمكن استبداله بعناوين محددة حسب الحاجة 
 credential: true,  
     methods: ["GET", "POST", "PUT", "DELETE"], 
     allowedHeaders: ["Content-Type", "Authorization"], 
 credentials: true // هذا مهم للسماح بإرسال الكوكيز 
   } 
 app.options("", cors(corsConfig))  
 app.use( 
   cors(corsConfig) 
 ); 
  
 const PORT = process.env.PORT || 5000; 
  
 const __filename = fileURLToPath(import.meta.url); 
 const __dirname = path.dirname(__filename); 
  
 cloudinary.config({ 
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
   api_key: process.env.CLOUDINARY_API_KEY, 
   api_secret: process.env.CLOUDINARY_API_SECRET, 
 }); 
  
 // MiddleWares 
 app.use(express.json({ limit: "50mb" })); // To parse JSON data in the req.body 
 app.use(express.urlencoded({ extended: true })); // To parse form data in req.body 
 app.use(cookieParser()); // To parse cookies in req.cookies 
  
 // Routes 
 app.use("/api/users", userRoutes); 
 app.use("/api/posts", postRoutes); 
  
 // Serve static files 
 // app.use(express.static(path.join(__dirname, "../frontend/dist"))); 
 // app.get("*", (req, res) => { 
 //   res.sendFile(path.join(__dirname, "../frontend/dist", "index.html")); 
 // }); 
  
 app.get("*", (req, res) => { 
   res.send("API Works Now"); 
 }); 
  
 app.listen(PORT, () => 
   console.log(`Server started at http://localhost:${PORT}`) 
 );
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
const app = express();
// Add this for debugging to confirm env is loaded
//console.log("Allowed origin:", process.env.CORS_ORIGIN); 
const allowedOrigins = [
  'http://localhost:5173',
  'https://it-project-2025.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS: ' + origin));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import UserRoute from "./routes/user.routes.js";
app.use("/api/v1/user", UserRoute);

export default app;

import dotenv from 'dotenv'
dotenv.config()  
import connection from "./db/connect.js";
import {redisConnection} from "./db/redisConnect.js";
import app from "./app.js";


console.log("HELLO IT PROJECT");

const startServer = async () => {
  try {
    await Promise.all([
      connection(),       // Connect MongoDB
      redisConnection(),  // Connect Redis
    ]);

    app.on("error", (error) => {
      console.log("Express app error:", error);
      throw error;
    });

    app.listen(process.env.PORT, () => {
      console.log("APP WORKING ON PORT", process.env.PORT);
    });

  } catch (err) {
    console.error("Startup error:", err);
  }
};

startServer();
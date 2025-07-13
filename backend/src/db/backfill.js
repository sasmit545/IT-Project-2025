import mongoose from "mongoose";
import dotenv from "dotenv";
import connection from "./connect.js";
import Website from "../models/website.model.js"; 

dotenv.config(); 


const run = async () => {
  try {
    await connection(); 

    const result = await Website.updateMany(
      { accessType: { $exists: false } },
      { $set: { accessType: false } }
    );

    console.log("Backfill done:", result);

  } 
  catch (err) {
    console.error("Error during backfill:", err);
  } 
  finally {
    await mongoose.disconnect();
  }
};

run();

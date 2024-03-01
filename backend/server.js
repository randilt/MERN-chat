import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import connectMongoDB from "./db/connectMongoDB.js";

const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();
app.use(express.json()); // for parsing application/json and setting up req.body
app.use("/api/auth", authRoutes);

// app.get("/", (req, res) => {
//   {
//     res.send("Hello World");
//   }
// });

app.listen(PORT, () => {
  connectMongoDB();
  console.log(`Server is running on port ${PORT}`);
});

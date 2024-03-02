import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    if (!verified) {
      return res
        .status(401)
        .json({ message: "Unauthorized - Token verification failed" });
    }

    const user = await User.findById(verified.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized - No user found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    res.status(401).json({ message: "Unauthorized" });
  }
};

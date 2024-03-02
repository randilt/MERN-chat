// Desc: Auth controllers for signup, login and logout routes
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { fullName, userName, password, confirmPassword, gender } = req.body;
    if (!fullName || !userName || !password || !confirmPassword || !gender) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Password and Confirm Password do not match" });
    }
    const user = await User.findOne({ userName });

    if (user) {
      return res
        .status(400)
        .json({ message: "User already exists with this username" });
    }

    //HASH PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //https://avatar-placeholder.iran.liara.run/
    const boyAvatar = `https://avatar.iran.liara.run/public/boy?username=${userName}`;
    const girlAvatar = `https://avatar.iran.liara.run/public/girl?username=${userName}`;

    const newUser = new User({
      fullName,
      userName,
      password: hashedPassword,
      gender,
      profilePic: gender === "male" ? boyAvatar : girlAvatar,
    });
    if (!newUser) {
      return res.status(400).json({ message: "Invalid user data" });
    }
    generateTokenAndSetCookie(newUser._id, res);
    await newUser.save();

    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      userName: newUser.userName,
      gender: newUser.gender,
      profilePic: newUser.profilePic,
    });
  } catch (error) {
    console.log("Error while signing up: ", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const login = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName: userName });
    if (!user) {
      return res.status(400).json({ message: "No user found!" });
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password || ""
    ); // if user is not found, user.password will be undefined  and it will throw an error, so we use user.password || "" to avoid that
    if (!isPasswordCorrect || !user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }
    generateTokenAndSetCookie(user._id, res); // generate token and set cookie in the response header
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      userName: user.userName,
      profilePic: user.profilePic,
      gender: user.gender,
    });
  } catch (error) {
    console.log("Error while logging in: ", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error while logging out: ", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

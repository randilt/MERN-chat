import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUser = req.user._id;

    const allUsers = await User.find({ _id: { $ne: loggedInUser } }).select(
      "-password"
    ); // get all users except the logged in user and exclude the password field

    res.status(200).json(allUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

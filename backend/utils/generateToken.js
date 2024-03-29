import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    // process.env.JWT_SECRET is the secret key used to sign the token
    expiresIn: "15d",
  });

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true, // cookie cannot be accessed or modified by the browser (prevents XSS attacks and cookie theft / cross-site scripting attacks)
    sameSite: "strict", // CSRF (Cross-Site Request Forgery) protection
    secure: process.env.NODE_ENV === "production" ? true : false, // cookie will only be sent over HTTPS in production
  });
};

export default generateTokenAndSetCookie;

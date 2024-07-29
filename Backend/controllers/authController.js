const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { success, failure: error } = require("../utils/responseStatus");

const signUpController = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.send(error(400, "Email, Name And Password is required"));
    }
    // Check if email already exists
    const user = await User.findOne({ email });
    if (user)
      return res.send(error(409, "User is already registered"));

    const hashedPwd = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPwd, name });
    const savedUser = await newUser.save();
    return res.send(success(201, savedUser));
  } catch (e) {
    console.error("An error occurred during signup:", e.message);
    return res.send(error(500, "Internal Server Error"));
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.send(error(400, "Email And Password is required"));

    const user = await User.findOne({ email });
    if (!user) return res.send(error(401, "User not registered"));

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.send(error(401, "Invalid Password"));

    const acesstoken = generateAcessToken({ id: user._id });
    const refreshToken = generateRefreshToken({ id: user._id });

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return res.send(success(200, { "user-email": user.email, acesstoken }));
  } catch (e) {
    console.error("An error occurred during login:", e.message);
    return res.send(error(500, "Internal Server Error"));
  }
};

const logoutController = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
    });
    return res.send(success(200, "Logged Out"));
  } catch (e) {
    return res.send(error(500, "Internal Server Error"));
  }
};

const refreshTokenController = async (req, res) => {
  const cookie = req.cookies;
  if (!cookie.jwt)
    return res.send(error(401, "No Refresh Token Found"));

  const refreshToken = cookie.jwt;
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_KEY);
    req.user = decoded;
    const acesstoken = generateAcessToken({ id: req.user.id });
    return res.send(success(201, { acesstoken }));
  } catch (err) {
    console.error("Error is " + err.message);
    return res.send(error(401, "Invalid token"));
  }
};

const generateAcessToken = (data) => {
  try {
    return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "1d" });
  } catch (e) {
    console.error(
      "An error occurred during Access token generation:",
      e.message
    );
    throw new Error("Token generation failed");
  }
};

const generateRefreshToken = (data) => {
  try {
    return jwt.sign(data, process.env.REFRESH_KEY, { expiresIn: "2d" });
  } catch (e) {
    console.error(
      "An error occurred during Refresh token generation:",
      e.message
    );
    throw new Error("Token generation failed");
  }
};

module.exports = {
  loginController,
  logoutController,
  signUpController,
  refreshTokenController,
};

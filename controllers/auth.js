import { request, response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import {generateJWT} from "../helpers/generate_jwt.js";
import googleVerify from "../helpers/google_validator.js";

const login = async (req = request, res = response) => {
  try {
    const { email, password } = req.body;

    // Check user exist
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json("Email / Password invalid");
    }
    // Validate Password
    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json("Email / Password invalid");
    }
    // Validate user status
    if (!user.status) {
      return res.status(400).json("Invalid User");
    }
    // Validate JWT
    const token = await generateJWT(user.id);
    res.json({ user, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Talk with the administrator" });
  }
};

const googleSignIn = async (req, res = response) => {
  const { id_token } = req.body;
  try {
    const { name, email, picture } = await googleVerify(id_token);
    let user = await User.findOne({ email });
    if (!user) {
      // Create user
      const data = {
        name,
        email,
        password: ":P",
        picture,
        google: true,
      };
      user = new User(data);
      await user.save();
    }

    // Validate user status
    if (!user.status) {
      return res.status(401).json({
        msg: "User blocked, contact administrator",
      });
    }

    // Validate JWT
    const token = await generateJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    res.status(400).json({
      msg: "Invalid Google token",
    });
  }
};

const refreshJWT = async (req, res = response) => {
  const { user } = req;
  const token = await generateJWT(user.id);
  res.json({ user, token });
};

export { login, googleSignIn, refreshJWT };

import jwt from "jsonwebtoken";
import User from "../models/user.js";

const validateJWT = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ msg: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const user = await User.findById(decoded.uid);
    if (!user || !user.status) {
      return res
        .status(401)
        .json({ msg: "Invalid token - user does not exist" });
    }
    res.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};

export default validateJWT;

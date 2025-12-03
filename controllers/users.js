import bcrypt from "bcryptjs";
import { request, response } from "express";
import User from "../models/user.js";

const getUsers = async (req = request, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { status: true };

  const [ total, users ] = await Promise.all([
    User.countDocuments(query),
    User.find(query).skip(Number(from)).limit(Number(limit))
  ]);

  res.json({ total, users });
};

const postUsers = async (req = request, res = response) => {
  const { name, email, password, role } = req.body;
  const user = new User({ name, email, password, role });

  // Encrypt password
  const salt = bcrypt.genSaltSync();
  user.password = bcrypt.hashSync(password, salt);

  await user.save();
  res.json({ user });
};

const putUsers = async (req = request, res = response) => {
  const id = req.params.id;
  const { password, google, ...rest } = req.body;

  if (password) {
    // Encrypt password
    const salt = bcrypt.genSaltSync();
    rest.password = bcrypt.hashSync(password, salt);
  }

  const user = await User.findByIdAndUpdate(id, rest);
  res.json({ user });
};

const patchUsers = (req = request, res = response) => {
  const id = req.params.id;
  res.json({ msg: "User partially updated" });
};

const deleteUsers = async (req = request, res = response) => {
  const id = req.params.id;
  const user = await User.findByIdAndUpdate(id, { status: false });
  res.json(user);
};

export { deleteUsers, getUsers, patchUsers, postUsers, putUsers };

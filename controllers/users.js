import { response, request } from "express";

const getUsers = (req = request, res = response) => {
  const params = req.params;
  res.json({ msg: "Users Home Page", params });
};

const postUsers = (req = request, res = response) => {
  const body = req.body;
  console.log(body);
  res.json({ msg: "User created" });
};

const putUsers = (req = request, res = response) => {
  const id = req.params.id;
  res.json({ msg: "User updated" });
};

const patchUsers = (req = request, res = response) => {
  const id = req.params.id;
  res.json({ msg: "User partially updated" });
};

const deleteUsers = (req = request, res = response) => {
  const id = req.params.id;
  res.json({ msg: "User deleted" });
};

export { getUsers, postUsers, putUsers, patchUsers, deleteUsers };

import { request, response } from "express";
import { isValidObjectId } from "mongoose";
import User from "../models/user.js";
import Product from "../models/product.js";
import Role from "../models/role.js";

const collectionsAllowed = ["users", "products", "categories", "roles"];

const search = async (req = request, res = response) => {
  if (!collectionsAllowed.includes(req.params.collection)) {
    return res.status(400).json({
      msg: `The allowed collections are: ${collectionsAllowed.join(", ")}`,
    });
  }

  switch (req.params.collection) {
    case "users":
      searchUsers(req.params.query, res);
      break;
    case "products":
        searchProducts(req.params.query, res);
      break;
    case "categories":
        searchCategories(req.params.query, res);
      break;
    case "roles":
        searchRoles(req.params.query, res); 
        break;
    default:
      res.status(500).json({
        msg: "Search for this collection is not implemented yet",
      });
  }
};

const searchUsers = async (query = "", res = response) => {
  const isMongoId = isValidObjectId(query);
  if (isMongoId) {
    const user = await User.findById(query);
    return res.json({
      results: user ? [user] : [],
    });
  }

  const regex = new RegExp(query, "i");
  const users = await User.find({
    $or: [{ name: regex }, { email: regex }],
    $and: [{ status: true }],
  });
  return res.json({
    results: users,
  });
};

const searchProducts = async (query = "", res = response) => {  
  const isMongoId = isValidObjectId(query);
  if (isMongoId) {
    const product = await Product.findById(query)
      .populate("category", "name")
      .populate("user", "name");
    return res.json({
      results: product ? [product] : [],
    });
  }

  const regex = new RegExp(query, "i");
  const products = await Product.find({
    name: regex,
    status: true,
  })
    .populate("category", "name")
    .populate("user", "name");
  return res.json({
    results: products,
  });
};

const searchCategories = async (query = "", res = response) => {
  const isMongoId = isValidObjectId(query);
  if (isMongoId) {
    const category = await Category.findById(query);
    return res.json({
      results: category ? [category] : [],
    });
  }
  const regex = new RegExp(query, "i");
  const categories = await Category.find({
    name: regex,
    status: true,
  });
  return res.json({
    results: categories,
  });
};

const searchRoles = async (query = "", res = response) => {
  const isMongoId = isValidObjectId(query);
  if (isMongoId) {
    const role = await Role.findById(query);
    return res.json({
      results: role ? [role] : [],
    });
  }
  const regex = new RegExp(query, "i");
  const roles = await Role.find({
    name: regex,
    status: true,
  });
  return res.json({
    results: roles,
  });
};

export { search };

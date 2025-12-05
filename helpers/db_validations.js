import Role from "../models/role.js";
import User from "../models/user.js";
import Category from "../models/category.js";
import Product from "../models/product.js";

const isValidRole = async (role) => {
  const exists = await Role.findOne({ name: role });
  if (!exists) {
    throw new Error(`Role ${role} does not exist in DB`);
  }
};

const emailExists = async (email) => {
  const isEmailExist = await User.findOne({ email });
  if (isEmailExist) {
    throw new Error(`Email ${email} already exists`);
  }
};

const userIdExists = async (id) => {
  const userExists = await User.findById(id);
  if (!userExists) {
    throw new Error(`User with id ${id} does not exist`);
  }
};

const categoryIdExists = async (id) => {
  const existId = await Category.findById(id);
  if (!existId) {
    throw new Error(`Category with id ${id} does not exist`);
  }
};

const productIdExists = async (id) => {
  const existId = await Product.findById(id);
  if (!existId) {
    throw new Error(`Product with id ${id} does not exist`);
  }
};

export {
  isValidRole,
  emailExists,
  userIdExists,
  categoryIdExists,
  productIdExists,
};

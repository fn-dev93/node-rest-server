import { request, response } from "express";
import Category from "../models/category.js";

const postCategory = async (req = request, res = response) => {
  try {
    const { name } = req.body;

    const categoryDB = await Category.findOne({ name: name.toUpperCase() });

    if (categoryDB) {
      return res.status(400).json({
        msg: `The category ${categoryDB.name} already exists`,
      });
    }

    const data = {
      name: name.toUpperCase(),
      user: req.user._id,
    };

    const category = new Category(data);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Talk with the administrator" });
  }
};

const getCategories = async (req = request, res = response) => {
  try {
    const { limit = 5, from = 0 } = req.query;
    const query = { status: true };

    const [total, categories] = await Promise.all([
      Category.countDocuments(query),
      Category.find(query)
        .populate("user")
        .skip(Number(from))
        .limit(Number(limit)),
    ]);

    res.status(200).json({ total, categories });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error getting categories" });
  }
};

const getCategoryById = async (req = request, res = response) => {
  try {
    const category = await Category.findById(req.params.id).populate("user");
    res.json(category);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error getting category" });
  }
};

const updateCategory = async (req = request, res = response) => {
  const id = req.params.id;
  let { name } = req.body;

  name = name.toUpperCase();

  const category = await Category.findByIdAndUpdate(
    id,
    { name },
    { new: true, runValidators: true }
  ).populate("user");

  res.json(category);
};

const deleteCategory = async (req = request, res = response) => {
  const id = req.params.id;

  const category = await Category.findByIdAndUpdate(
    id,
    { status: false },
    { new: true, runValidators: true }
  ).populate("user");

  res.json(category);
};

export {
  postCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};

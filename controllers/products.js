import { request, response } from "express";
import Product from "../models/product.js";

const postProduct = async (req = request, res = response) => {
  try {
    const { name, price, category, description } = req.body;

    const productDb = await Product.findOne({ name: name.toUpperCase() });

    if (productDb) {
      return res.status(400).json({
        msg: `The product ${productDb.name} already exists`,
      });
    }

    const data = {
      name: name.toUpperCase(),
      user: req.user._id,
      price,
      category,
      description,
    };

    const product = new Product(data);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Talk with the administrator" });
  }
};

const getProducts = async (req = request, res = response) => {
  try {
    const { limit = 5, from = 0 } = req.query;
    const query = { status: true };

    const [total, products] = await Promise.all([
      Product.countDocuments(query),
      Product.find(query)
        .populate("user")
        .populate("category")
        .skip(Number(from))
        .limit(Number(limit)),
    ]);

    res.status(200).json({ total, products });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error getting products" });
  }
};

const getProductById = async (req = request, res = response) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("user")
      .populate("category");
    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error getting product" });
  }
};

const updateProduct = async (req = request, res = response) => {
  const id = req.params.id;
  let { status, user, ...rest } = req.body;

  rest.name = rest.name.toUpperCase();

  const product = await Product.findByIdAndUpdate(id, rest, {
    new: true,
    runValidators: true,
  })
    .populate("user")
    .populate("category");

  res.json(product);
};

const deleteProduct = async (req = request, res = response) => {
  const id = req.params.id;

  const product = await Product.findByIdAndUpdate(
    id,
    { status: false },
    { new: true, runValidators: true }
  )
    .populate("user")
    .populate("category");

  res.json(product);
};

export {
  postProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};

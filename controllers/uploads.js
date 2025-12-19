import { request, response } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import uploadFile from "../helpers/file_upload.js";
import User from "../models/user.js";
import Product from "../models/product.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const upload = async (req = request, res = response) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      msg: "No files were uploaded.",
    });
  }

  try {
    const uploadResult = await uploadFile({
      file: req.files.file,
      folder: "images",
    });
    res.json(uploadResult);
  } catch (error) {
    console.log(`Upload controller error:`, error);
    res.status(500).json({
      msg: error,
    });
  }
};

const updateFile = async (req = request, res = response) => {
  const { id, collection } = req.params;
  let model;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      msg: "No files were uploaded.",
    });
  }

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({ msg: `No user found with id ${id}` });
      }
      break;
    case "products":
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({ msg: `No product found with id ${id}` });
      }
      break;
    default:
      return res.status(500).json({ msg: "This collection is not handled" });
  }

  if (model.img) {
    const imgPath = path.join(__dirname, "../uploads/", collection, model.img);
    if (fs.existsSync(imgPath)) {
      fs.unlinkSync(imgPath);
    }
  }

  try {
    const fileName = await uploadFile({
      file: req.files.file,
      folder: collection,
    });

    model.img = fileName;
    await model.save();
    res.json(model);
  } catch (error) {
    console.log(`Update file controller error:`, error);
    res.status(500).json({
      msg: `Something was wrong. ${error}`,
    });
  }
};

const getFile = async (req = request, res = response) => {
  const { id, collection } = req.params;
  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({ msg: `No user found with id ${id}` });
      }
      break;
    case "products":
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({ msg: `No product found with id ${id}` });
      }
      break;
    default:
      return res.status(500).json({ msg: "This collection is not handled" });
  }

  if (model.img) {
    const imgPath = path.join(__dirname, "../uploads/", collection, model.img);
    console.log("Image path:", imgPath);
    if (fs.existsSync(imgPath)) {
      return res.sendFile(imgPath);
    }
  }
  const noImagePath = path.join(__dirname, "../assets/no-image.jpg");
  return res.sendFile(noImagePath);
};

export { upload, updateFile, getFile };

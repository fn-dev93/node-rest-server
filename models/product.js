import { Schema, model } from "mongoose";

const ProductSchema = Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  status: {
    type: Boolean,
    default: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  price: {
    type: Number,
    default: 0,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
  description: {
    type: String,
    default: "",
  },
  img: {
    type: String,
  },
});

ProductSchema.methods.toJSON = function () {
  const { _id, __v, ...rest } = this.toObject();
  rest.id = _id;
  return rest;
};

const Product = model("Product", ProductSchema);

export default Product;

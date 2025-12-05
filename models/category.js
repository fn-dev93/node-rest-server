import { Schema, model } from "mongoose";

const categorySchema = Schema({
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
});

categorySchema.methods.toJSON = function () {
  const { _id, __v,  ...rest } = this.toObject();
  rest.id = _id;
  return rest;
};

const Category = model("Category", categorySchema);

export default Category;

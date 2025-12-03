import { Schema, model } from "mongoose";

const userSchema = Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  img: {
    type: String,
  },
  status: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    default: "USER_ROLE",
  },
});

userSchema.methods.toJSON = function () {
  const { _id, __v, password, ...user } = this.toObject();
  user.uid = _id;
  return user;
}

const User = model("User", userSchema);

export default User;
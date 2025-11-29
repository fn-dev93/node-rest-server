import Role from "../models/role.js";
import User from "../models/user.js";

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

export { isValidRole, emailExists, userIdExists };

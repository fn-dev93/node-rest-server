const validateRole = (req, res, next) => {
  if (!res.user) {
    return res.status(500).json("Verify role without validating token first");
  }

  if (res.user.role !== "ADMIN_ROLE") {
    return res.status(403).json("User is not admin");
  }

  next();
};

export default validateRole;

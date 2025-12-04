const validateRole = (req, res, next) => {
  if (!req.user) {
    return res.status(500).json("Verify role without validating token first");
  }

  if (req.user.role !== "ADMIN_ROLE") {
    return res.status(403).json("User is not admin");
  }

  next();
};

export default validateRole;

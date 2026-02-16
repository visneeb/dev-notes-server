export const validatePostData = (req, res, next) => {
  const fields = [
    { key: "title", type: "string" },
    { key: "description", type: "string" },
    { key: "content", type: "string" },
    { key: "category_id", type: "number" },
    { key: "status_id", type: "number" },
  ];

  for (const field of fields) {
    const value = req.body[field.key];

    if (value == null) {
      return res.status(400).json({
        message: `${field.key} is required`,
      });
    }

    if (field.type === "number" && isNaN(Number(value))) {
      return res.status(400).json({
        message: `${field.key} must be a number`,
      });
    }

    if (field.type === "string" && typeof value !== "string") {
      return res.status(400).json({
        message: `${field.key} must be a string`,
      });
    }
  }

  // normalize data 
  req.body.category_id = Number(req.body.category_id);
  req.body.status_id = Number(req.body.status_id);

  next();
};

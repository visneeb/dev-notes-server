import CategoryService from "../services/categoryService.mjs";

const CategoryController = {
  getAllCategories: async (req, res, next) => {
    try {
      const categories = await CategoryService.getAllCategories();

      res.status(200).json({
        data: categories,
      });
    } catch (err) {
      next(err);
    }
  },
};

export default CategoryController;

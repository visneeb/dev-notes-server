import CategoryRepository from "../repositories/categoryRepository.mjs";

const CategoryService = {
  getAllCategories: async () => {
    const categories = await CategoryRepository.findAll();
    return categories;
  },
};

export default CategoryService;

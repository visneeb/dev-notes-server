import { Router } from "express";
import CategoryController from "../controllers/categoryController.mjs";

const CategoryRouter = {
  createRouter: () => {
    const CategoryRouter = Router();

    CategoryRouter.get("/", CategoryController.getAllCategories);

    return CategoryRouter;
  },
};

export default CategoryRouter;

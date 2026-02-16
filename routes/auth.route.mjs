import { Router } from "express";
import protectUser from "../middlewares/protectUser.mjs";
import {
  registerController,
  loginController,
  getUserController,
  resetPasswordController,
} from "../controllers/authController.mjs";

const authRouter = Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.get("/get-user", protectUser, getUserController);
authRouter.put("/reset-password", protectUser, resetPasswordController);

export default authRouter;

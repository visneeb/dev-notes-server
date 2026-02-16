import { Router } from "express";
import PostController from "../controllers/postController.mjs";
import { validatePostData } from "../middlewares/post.validation.mjs";
import protectAdmin from "../middlewares/protectAdmin.mjs";
import { imageFileUpload } from "../middlewares/multerUpload.mjs";

const PostRouter = {
  createRouter: () => {
    const PostRouter = Router();

    PostRouter.get("/", PostController.getPosts);
    PostRouter.get("/:postId", PostController.getPostsById);
    PostRouter.post(
      "/",
      [imageFileUpload, protectAdmin, validatePostData],
      PostController.createPost,
    );
    PostRouter.put(
      "/:postId",
      [imageFileUpload, protectAdmin, validatePostData],
      PostController.updatePost,
    );
    PostRouter.delete("/:postId", PostController.deletePost);

    return PostRouter;
  },
};

export default PostRouter;

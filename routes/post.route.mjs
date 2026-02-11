import { Router } from "express";
import PostController from "../controllers/postController.mjs";
import { validatePostData } from "../middlewares/post.validation.mjs";

const PostRouter = {
  createRouter: () => {
    const PostRouter = Router();

    PostRouter.get("/", PostController.getPosts);
    PostRouter.get("/:postId", PostController.getPostsById);
    PostRouter.post("/", validatePostData, PostController.createPost);
    PostRouter.put("/:postId", validatePostData, PostController.updatePost);
    PostRouter.delete("/:postId", PostController.deletePost);
    
    return PostRouter;
  },
};

export default PostRouter;

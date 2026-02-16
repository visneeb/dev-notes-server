import PostService from "../services/postService.mjs";

const PostController = {
  getPosts: async (req, res, next) => {
    try {
      const posts = await PostService.getAllPosts({
        categoryId: req.query.category_id,
        keyword: req.query.keyword,
      });

      res.status(200).json({ data: posts });
    } catch (err) {
      next(err);
    }
  },

  getPostsById: async (req, res, next) => {
    const { postId } = req.params;
    try {
      const post = await PostService.getPostById(postId);

      res.status(200).json({ data: post });
    } catch (err) {
      next(err);
    }
  },

  createPost: async (req, res, next) => {
    try {
      const newPost = req.body;
      const file = req.files?.imageFile?.[0] || null;

      await PostService.createPost(newPost, file);

      res.status(201).json({
        message: "Created post successfully",
      });
    } catch (err) {
      next(err);
    }
  },

  updatePost: async (req, res, next) => {
    const { postId } = req.params;
    const postData = req.body;
    try {
      const result = await PostService.updatePost(postId, postData);

      res
        .status(200)
        .json({ message: "Updated post sucessfully", data: result });
    } catch (err) {
      next(err);
    }
  },

  deletePost: async (req, res, next) => {
    const { postId } = req.params;

    try {
      await PostService.deletePost(postId);

      res.status(200).json({
        message: "Deleted post sucessfully",
      });
    } catch (err) {
      next(err);
    }
  },
};

export default PostController;

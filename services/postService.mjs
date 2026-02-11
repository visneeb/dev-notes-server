import PostRepository from "../repositories/postRepository.mjs";
import BadRequestError from "../src/errors/BadRequestError.mjs";
import NotFoundError from "../src/errors/NotFoundError.mjs";

const PostService = {
  getAllPosts: async ({ categoryId, keyword }) => {
    const posts = await PostRepository.findAll({
      categoryId,
      keyword,
    });

    return posts.map((post) => ({
      ...post,
      title: post.title.trim(),
    }));
  },

  getPostById: async (postId) => {
    if (!postId) {
      throw new BadRequestError("Post id is required");
    }
    const post = await PostRepository.findById(postId);

    if (!post) {
      throw new NotFoundError("Server could not find a requested post");
    }

    return post;
  },

  createPost: async (postData) => {
    return await PostRepository.create(postData);
  },

  updatePost: async (postId, postData) => {
    const result = await PostRepository.update(postId, postData);

    if (!result) {
      throw new NotFoundError(
        "Server could not find a requested post to update",
      );
    }

    return result;
  },

  deletePost: async (postId) => {
    const deletedPost = await PostRepository.delete(postId);

    if (!deletedPost) {
      throw new NotFoundError("Server could not find a requested post");
    }

    return deletedPost;
  },
};

export default PostService;

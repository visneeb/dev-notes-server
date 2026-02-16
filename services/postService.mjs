import PostRepository from "../repositories/postRepository.mjs";
import BadRequestError from "../src/errors/BadRequestError.mjs";
import NotFoundError from "../src/errors/NotFoundError.mjs";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);


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

  createPost: async (postData, file) => {
    const bucketName = "dev-notes";
    let imageUrl = null;

    if (file) {
      const filePath = `posts/${Date.now()}_${file.originalname}`;

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (error) {
        throw new Error(error.message);
      }
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucketName).getPublicUrl(data.path);

      imageUrl = publicUrl;
    }

    const newPostData = {
      ...postData,
      image: imageUrl,
    };

    return await PostRepository.create(newPostData);
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

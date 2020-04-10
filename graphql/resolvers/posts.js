const Post = require('../../models/Post');

module.exports = {
  Query: {
    // GET POSTS
    getPosts: async () => {
      try {
        const posts = await Post.find();
        return posts;
      } catch (error) {
        throw new Error(error);
      }
    },

    // CREATE POST
    getPost: async (_, { postId }) => {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error('Post not found!');
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    // DELETE POST
  },
};

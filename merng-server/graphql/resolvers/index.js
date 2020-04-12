const PostsResolvers = require('./posts');
const UsersResolvers = require('./users');
const CommentsResolvers = require('./comments');

module.exports = {
  Post: {
    likeCount: (parent) => parent.likes.length,
    commentCount: (parent) => parent.comments.length,
  },
  Query: {
    ...PostsResolvers.Query,
  },
  Mutation: {
    ...PostsResolvers.Mutation,
    ...UsersResolvers.Mutation,
    ...CommentsResolvers.Mutation,
  },
};

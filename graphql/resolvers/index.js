const PostsResolvers = require('./posts');
const UsersResolvers = require('./users');
const CommentsResolvers = require('./comments');

module.exports = {
  Query: {
    ...PostsResolvers.Query,
  },
  Mutation: {
    ...PostsResolvers.Mutation,
    ...UsersResolvers.Mutation,
    ...CommentsResolvers.Mutation,
  },
};

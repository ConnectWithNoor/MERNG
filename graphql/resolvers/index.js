const PostsResolvers = require('./posts');
const UsersResolvers = require('./users');

module.exports = {
  Query: {
    ...PostsResolvers.Query,
  },
};

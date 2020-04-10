const { hash } = require('bcryptjs');
const sign = require('jsonwebtoken/sign');

const User = require('../../models/User');

module.exports = {
  Mutation: {
    register: async (_, args, context, info) => {
      let {
        registerInput: { username, password, confirmpassword, email },
      } = args;
      // validate user data
      password = await hash(password, 12);
      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();

      const token = sign(
        {
          id: res.id,
          email,
          username,
        },
        process.env.SECRET_KEY,
        {
          expiresIn: '1h',
        }
      );
      return {
        ...res._doc,
        id: res.id,
        token,
      };
    },
  },
};

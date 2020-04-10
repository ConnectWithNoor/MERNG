const { hash } = require('bcryptjs');
const sign = require('jsonwebtoken/sign');
const { UserInputError } = require('apollo-server');

const User = require('../../models/User');
const { validateRegisterInput } = require('../../utilities/validators');

module.exports = {
  Mutation: {
    register: async (_, args, context, info) => {
      let {
        registerInput: { username, password, confirmPassword, email },
      } = args;
      // validate user data
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      // Make sure user doesn't already exists
      const user = await User.findOne({ username });

      if (user) {
        throw new UserInputError('Username is taken', {
          errors: {
            username: 'This username is already taken',
          },
        });
      }

      // hash password and create an auth token
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

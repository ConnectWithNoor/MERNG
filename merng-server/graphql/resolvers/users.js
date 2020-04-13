const { hash, compare } = require('bcryptjs');
const sign = require('jsonwebtoken/sign');
const { UserInputError } = require('apollo-server');
const { SECRET_KEY } = require('../../SECTRET_ENV');

const User = require('../../models/User');
const {
  validateRegisterInput,
  validateLoginInput,
} = require('../../utilities/validators');

const generateToken = (user) => {
  return sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    SECRET_KEY,
    {
      expiresIn: '1h',
    }
  );
};

module.exports = {
  Mutation: {
    // REGISTER MUTATION

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
      const verifyUsername = await User.findOne({ username });
      const verifyEmail = await User.findOne({ email });

      if (verifyUsername) {
        throw new UserInputError('Username is taken', {
          errors: {
            username: 'This username is already taken',
          },
        });
      }

      if (verifyEmail) {
        throw new UserInputError('email is taken', {
          errors: {
            email: 'This email is already taken',
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

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res.id,
        token,
      };
    },

    // LOGIN MUTATION

    login: async (_, { loginInput }) => {
      const { username, password } = loginInput;
      const { errors, valid } = validateLoginInput(username, password);

      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      const user = await User.findOne({ username });

      if (!user) {
        errors.general = 'User not found';
        throw new UserInputError('User not found', { errors });
      }
      const match = await compare(password, user.password);
      if (!match) {
        errors.general = 'Wrong credentials';
        throw new UserInputError('Wrong credentials', { errors });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user.id,
        token,
      };
    },
  },
};

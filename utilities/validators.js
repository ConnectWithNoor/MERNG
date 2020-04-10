module.exports.validateRegisterInput = (
  username,
  email,
  password,
  confirmPassword
) => {
  const errors = {};

  if (username.trim() === '') {
    errors.username = 'Username must not be empty';
  }

  if (email.trim() === '') {
    errors.email = 'email must not be empty';
  } else {
    const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = 'email must be a valid email address';
    }
  }

  if (password === '') {
    errors.password = 'password must not be empty';
  } else if (password !== confirmPassword) {
    errors.password = 'password must match';
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

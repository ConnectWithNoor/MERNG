import React, { memo, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Button, Message } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';

import { useForm } from '../hooks/useForm';
import { AuthContext } from '../context/authContext';
import { REGISTER_USER } from '../graphql/user';

function Register() {
  const history = useHistory();
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const initialState = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const { handleChange, handleSubmit, values } = useForm(
    registerUser,
    initialState
  );

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    errorPolicy: 'all',
    update: (_, result) => {
      // window.location.href = '/';
      context.login(result.data.login);
      history.push('/');
    },
    onError: (err) => {
      setErrors(
        err.graphQLErrors[0]?.extensions?.exception?.errors || {
          error: 'Something went wrong',
        }
      );
    },
    variables: values,
  });

  function registerUser() {
    addUser();
  }

  return (
    <div className="form-container">
      <Form
        onSubmit={handleSubmit}
        noValidate
        className={loading ? 'loading' : ''}
      >
        <h1>Register</h1>
        <Form.Input
          label="Username"
          placeholder="Username..."
          name="username"
          type="text"
          error={errors.username ? true : false}
          value={values.username}
          onChange={handleChange}
        />
        <Form.Input
          label="Email"
          placeholder="Email..."
          name="email"
          type="email"
          error={errors.email ? true : false}
          value={values.email}
          onChange={handleChange}
        />
        <Form.Input
          label="Password"
          placeholder="Password..."
          name="password"
          error={errors.password ? true : false}
          type="password"
          value={values.password}
          onChange={handleChange}
        />
        <Form.Input
          label="Confirm Password"
          placeholder="Confirm Password..."
          name="confirmPassword"
          type="password"
          error={errors.password ? true : false}
          value={values.confirmPassword}
          onChange={handleChange}
        />
        <Button type="submit" primary>
          Register
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <Message floating color="red">
          <ui classname="list">
            {Object.values(errors).map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ui>
        </Message>
      )}
    </div>
  );
}

export default memo(Register);

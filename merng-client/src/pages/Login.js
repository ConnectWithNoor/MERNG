import React, { memo, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Button, Message } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';

import { useForm } from '../hooks/useForm';
import { AuthContext } from '../context/authContext';
import { LOGIN_USER } from '../graphql/user';

function Login() {
  const history = useHistory();
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const initialState = {
    username: '',
    password: '',
  };

  const { handleChange, handleSubmit, values } = useForm(
    signinUser,
    initialState
  );

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    errorPolicy: 'all',
    update: (_, result) => {
      context.login(result.data.login);
      // window.location.href = '/';
      history.push('/');
    },
    onError: (err) => {
      console.log(err);
      setErrors(
        err.graphQLErrors[0]?.extensions?.exception?.errors || {
          error: 'Something went wrong',
        }
      );
    },
    variables: values,
  });

  function signinUser() {
    loginUser();
  }

  return (
    <div className="form-container">
      <Form
        onSubmit={handleSubmit}
        noValidate
        className={loading ? 'loading' : ''}
      >
        <h1>Login</h1>
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
          label="Password"
          placeholder="Password..."
          name="password"
          error={errors.password ? true : false}
          type="password"
          value={values.password}
          onChange={handleChange}
        />
        <Button type="submit" primary>
          Login
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

export default memo(Login);

import React, { memo, useState } from 'react';
import { Form, Button, Card, Message } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';

import { useForm } from '../hooks/useForm';
import { CREATE_POST_MUTATION, FETCH_POSTS_QUERY } from '../graphql/posts';

function PostForm() {
  const [errors, setErrors] = useState({});
  const initialState = { body: '' };
  const { values, handleSubmit, handleChange } = useForm(
    createPostCallback,
    initialState
  );

  const [createPost, { loading }] = useMutation(CREATE_POST_MUTATION, {
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: { getPosts: [result.data.createPost, ...data.getPosts] },
      });
      values.body = '';
    },
    onError(err) {
      setErrors(err);
    },
    variables: values,
  });

  function createPostCallback() {
    setErrors({});
    createPost();
  }

  return (
    <Form onSubmit={handleSubmit} className={loading ? 'loading' : ''}>
      <Card fluid>
        <Card.Content>
          <h3>Create a post:</h3>
          <Form.Field>
            <Form.Input
              placeholder="Hi World!"
              name="body"
              onChange={handleChange}
              value={values.body}
              error={Object.keys(errors).length > 0 ? true : false}
            />

            <Button floated="right" type="submit" color="teal">
              Submit
            </Button>
          </Form.Field>
        </Card.Content>
      </Card>
      {Object.keys(errors).length > 0 && (
        <Message floating color="red" style={{ marginBottom: '2rem' }}>
          {<li>{errors.graphQLErrors[0].message}</li>}
        </Message>
      )}
    </Form>
  );
}

export default memo(PostForm);

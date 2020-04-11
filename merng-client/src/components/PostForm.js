import React, { memo } from 'react';
import { Form, Button, Card } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';

import { useForm } from '../hooks/useForm';
import { CREATE_POST_MUTATION, FETCH_POSTS_QUERY } from '../graphql/posts';

function PostForm() {
  const initialState = { body: '' };
  const { values, handleSubmit, handleChange } = useForm(
    createPostCallback,
    initialState
  );

  const [createPost, { loading, error }] = useMutation(CREATE_POST_MUTATION, {
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
      console.log(err);
    },
    variables: values,
  });

  function createPostCallback() {
    createPost();
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Card fluid>
        <Card.Content>
          <h3>Create a post:</h3>
          <Form.Field>
            <Form.Input
              placeholder="Hi World!"
              name="body"
              onChange={handleChange}
              value={values.body}
            />
            <Button floated="right" type="submit" color="teal">
              Submit
            </Button>
          </Form.Field>
        </Card.Content>
      </Card>
    </Form>
  );
}

export default memo(PostForm);

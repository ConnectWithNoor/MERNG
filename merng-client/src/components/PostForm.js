import React, { memo } from 'react';
import { Form, Button, Card } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { useForm } from '../hooks/useForm';

function PostForm() {
  const initialState = { body: '' };
  const { values, handleSubmit, handleChange } = useForm(
    createPostCallback,
    initialState
  );

  const [createPost, { loading, error }] = useMutation(CREATE_POST_MUTATION, {
    update(_, result) {
      console.log(result);
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

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        id
        username
        createdAt
      }
      commentCount
      comments {
        id
        body
        username
        createdAt
      }
    }
  }
`;

export default memo(PostForm);

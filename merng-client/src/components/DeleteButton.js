import React, { memo, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Button, Icon, Confirm } from 'semantic-ui-react';

import { DELETE_POST_MUTATION, FETCH_POSTS_QUERY } from '../graphql/posts';

function DeleteButton({ postId, callback = () => {} }) {
  const [confirmOpen, setConfrimOpen] = useState(false);

  const [deletePost, { loading }] = useMutation(DELETE_POST_MUTATION, {
    variables: {
      postId,
    },
    update(proxy) {
      setConfrimOpen(false);
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
          getPosts: data.getPosts.filter((post) => post.id !== postId),
        },
      });
      callback();
    },
    onError(err) {
      console.log(err);
    },
  });

  return (
    <>
      <Button
        as="div"
        color="red"
        floated="right"
        onClick={() => setConfrimOpen(true)}
        basic
      >
        <Icon name="trash" style={{ margin: 0 }} />
      </Button>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfrimOpen(false)}
        onConfirm={deletePost}
        className={loading ? 'loading' : ''}
      />
    </>
  );
}

export default memo(DeleteButton);

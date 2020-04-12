import React, { memo, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Button, Icon, Confirm, Popup } from 'semantic-ui-react';

import {
  DELETE_POST_MUTATION,
  FETCH_POSTS_QUERY,
  DELETE_COMMENT_MUTATION,
} from '../graphql/posts';

function DeleteButton({ postId, callback = () => {}, commentId }) {
  const [confirmOpen, setConfrimOpen] = useState(false);

  const MUTATION = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

  const [deletePostOrDeleteComment, { loading }] = useMutation(MUTATION, {
    variables: {
      postId,
      commentId,
    },
    update(proxy) {
      if (!commentId) {
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
      }
      callback();
    },
    onError(err) {
      console.log(err);
    },
  });

  return (
    <>
      <Popup
        content={!commentId ? 'Delete Post' : 'Delete Comment'}
        inverted
        trigger={
          <Button
            as="div"
            color="red"
            floated="right"
            onClick={() => setConfrimOpen(true)}
            basic
          >
            <Icon name="trash" style={{ margin: 0 }} />
          </Button>
        }
      />
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfrimOpen(false)}
        onConfirm={deletePostOrDeleteComment}
        className={loading ? 'loading' : ''}
      />
    </>
  );
}

export default memo(DeleteButton);

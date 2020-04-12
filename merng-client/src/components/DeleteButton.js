import React, { memo, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Button, Icon, Confirm } from 'semantic-ui-react';

import { DELETE_POST_MUTATION } from '../graphql/posts';

function DeleteButton({ postId }) {
  const [confirmOpen, setConfrimOpen] = useState(false);

  const [deletePost, { loading }] = useMutation(DELETE_POST_MUTATION, {
    variables: {
      postId,
    },
    update() {
      setConfrimOpen(false);
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

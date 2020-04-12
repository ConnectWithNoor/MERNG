import React, { memo, useState, useEffect } from 'react';
import { Icon, Label, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';

import { LIKE_POST_MUTATION } from '../graphql/posts';

function LikeButton({ post: { id, likes, likeCount }, user }) {
  const [liked, setLiked] = useState(false);

  const [addLike, { loading }] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id },
    update() {},
    onError() {},
  });

  useEffect(() => {
    if (user && likes.find((like) => like.username === user.username)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [user, likes]);

  const likePost = () => {
    console.log('post like');
    addLike();
  };

  const likeButtonMarkup = user ? (
    liked ? (
      <Button color="teal" filled>
        <Icon name="heart" />
      </Button>
    ) : (
      <Button color="teal" basic>
        <Icon name="heart" />
      </Button>
    )
  ) : (
    <Button as={Link} to="/login" color="teal" basic>
      <Icon name="heart" />
    </Button>
  );

  return (
    <Button
      as="div"
      labelPosition="right"
      onClick={likePost}
      className={loading ? 'loading' : ''}
    >
      {likeButtonMarkup}
      <Label basic color="teal" pointing="left">
        {likeCount}
      </Label>
    </Button>
  );
}

export default memo(LikeButton);

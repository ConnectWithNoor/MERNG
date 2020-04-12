import React, { memo, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  Grid,
  Image,
  Card,
  Divider,
  Button,
  Icon,
  Label,
} from 'semantic-ui-react';

import { FETCH_POST_QUERY } from '../graphql/posts';
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';
import { AuthContext } from '../context/authContext';
dayjs.extend(relativeTime);

function SinglePost() {
  const { postId } = useParams();
  const { user } = useContext(AuthContext);
  const history = useHistory();
  const { data, loading } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId,
    },
  });

  const post = data?.getPost;

  const handleComment = () => {
    console.log('comment');
  };

  const deletePostCallback = () => {
    history.push('/');
  };

  const postMarkup = !post ? (
    loading ? (
      <p>loading post...</p>
    ) : (
      <p>'Something went wrong</p>
    )
  ) : (
    <Grid>
      <Grid.Row>
        <Grid.Column width={2}>
          <Image
            src="https://react.semantic-ui.com/images/avatar/large/molly.png"
            size="small"
            float="right"
          />
        </Grid.Column>
        <Grid.Column width={10}>
          <Card fluid>
            <Card.Content>
              <Card.Header>{post.username}</Card.Header>
              <Card.Meta>{dayjs(post.createdAt).fromNow()}</Card.Meta>
              <Card.Description>{post.body}</Card.Description>
            </Card.Content>
            <hr />
            <Card.Content extra>
              <LikeButton
                user={user}
                post={{
                  id: post.id,
                  likeCount: post.likeCount,
                  likes: post.likes,
                }}
              />
              <Button as="div" labelPosition="right" onClick={handleComment}>
                <Button basic color="blue">
                  <Icon name="comments" />
                </Button>
                <Label basic color="blue" labelPosition="left">
                  {post.commentCount}
                </Label>
              </Button>
              {user && user.username === post.username && (
                <DeleteButton postId={post.id} callback={deletePostCallback} />
              )}
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
  return postMarkup;
}

export default memo(SinglePost);

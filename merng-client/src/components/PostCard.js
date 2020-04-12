import React, { memo, useContext } from 'react';
import {
  Card,
  Icon,
  Label,
  Image,
  Button,
  Transition,
  Popup,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { AuthContext } from '../context/authContext';
import LikeButton from './LikeButton';
import DeleteButton from './DeleteButton';

dayjs.extend(relativeTime);

function PostCard({ post }) {
  const { user } = useContext(AuthContext);

  const {
    body,
    createdAt,
    id,
    username,
    likeCount,
    commentCount,
    likes,
  } = post;

  return (
    <Card fluid>
      <Card.Content>
        <Popup
          content={`username: ${post.username}`}
          trigger={
            <Image
              floated="right"
              size="mini"
              src="https://react.semantic-ui.com/images/avatar/large/molly.png"
            />
          }
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>
          {dayjs(createdAt).fromNow(true)}
        </Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton user={user} post={{ id, likes, likeCount }} />
        <Popup
          content="Comment on post"
          inverted
          trigger={
            <Button labelPosition="right" as={Link} to={`/posts/${id}`}>
              <Button color="blue" basic>
                <Icon name="comments" />
              </Button>
              <Label basic color="blue" pointing="left">
                {commentCount}
              </Label>
            </Button>
          }
        />
        {user && user.username === username && (
          <Transition.Group duration={1000} size="huge">
            <DeleteButton postId={id} />
          </Transition.Group>
        )}
      </Card.Content>
    </Card>
  );
}

export default memo(PostCard);

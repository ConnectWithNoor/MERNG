import React, { memo, useContext, useState, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  Grid,
  Image,
  Card,
  Button,
  Icon,
  Label,
  Divider,
  Message,
  Form,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { FETCH_POST_QUERY, SUBMIT_COMMENT_MUTATION } from '../graphql/posts';
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';
import { AuthContext } from '../context/authContext';
import Loader from '../components/Loader';
dayjs.extend(relativeTime);

function SinglePost() {
  const [comment, setComment] = useState('');
  const { user } = useContext(AuthContext);
  const commentInputRef = useRef(null);

  const history = useHistory();
  const { postId } = useParams();

  const { data, loading } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId,
    },
  });
  const post = data?.getPost;

  const [submitComment, { loading: loadingComment }] = useMutation(
    SUBMIT_COMMENT_MUTATION,
    {
      variables: {
        postId,
        body: comment,
      },
      update() {
        setComment('');
        commentInputRef.current.blur();
      },
      onError(err) {
        console.log(err);
      },
    }
  );

  const deletePostCallback = () => {
    history.push('/');
  };

  const postMarkup = !post ? (
    loading ? (
      <Loader />
    ) : (
      <Message
        color="red"
        as={Link}
        to="/"
        style={{ display: 'inline-block', width: '100%' }}
      >
        <Message.Header>Something went wrong</Message.Header>
        <Message.Item>Click to go to homepage</Message.Item>
      </Message>
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
            <Divider horizontal />
            <Card.Content extra>
              <LikeButton
                user={user}
                post={{
                  id: post.id,
                  likeCount: post.likeCount,
                  likes: post.likes,
                }}
              />
              <Button as="div" labelPosition="right">
                <Button basic color="blue">
                  <Icon name="comments" />
                </Button>
                <Label basic color="blue">
                  {post.commentCount}
                </Label>
              </Button>
              {user && user.username === post.username && (
                <DeleteButton postId={post.id} callback={deletePostCallback} />
              )}
            </Card.Content>
          </Card>
          {user && (
            <Card fluid>
              <Card.Content>
                <p>Post a comment</p>
                <Form className={loadingComment && 'loading'}>
                  <div className={`ui action input fluid`}>
                    <input
                      type="text"
                      placeholder="Comment.."
                      name="comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      ref={commentInputRef}
                    />
                    <button
                      type="submit"
                      className="ui button teal"
                      disabled={comment.trim() === ''}
                      onClick={submitComment}
                    >
                      Submit
                    </button>
                  </div>
                </Form>
              </Card.Content>
            </Card>
          )}
          {post.comments.map((comment) => (
            <Card fluid key={comment.id}>
              <Card.Content>
                {user && user.username === comment.username && (
                  <DeleteButton postId={post.id} commentId={comment.id} />
                )}
                <Card.Header>{comment.username}</Card.Header>
                <Card.Meta>{dayjs(comment.createdAt).fromNow()}</Card.Meta>
                <Card.Description>{comment.body}</Card.Description>
              </Card.Content>
            </Card>
          ))}
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
  return postMarkup;
}

export default memo(SinglePost);

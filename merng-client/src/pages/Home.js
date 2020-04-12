import React, { memo, useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Grid, Transition } from 'semantic-ui-react';

import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { FETCH_POSTS_QUERY } from '../graphql/posts';

import { AuthContext } from '../context/authContext';

function Home() {
  const { user } = useContext(AuthContext);
  const { loading, data } = useQuery(FETCH_POSTS_QUERY);

  const PostsMarkup = loading ? (
    <h1>Loading Posts...</h1>
  ) : (
    <Transition.Group duration={1000} size="huge">
      {data?.getPosts &&
        data?.getPosts.map((post) => (
          <Grid.Column key={post.id} style={{ marginBottom: '2rem' }}>
            <PostCard post={post} />
          </Grid.Column>
        ))}
    </Transition.Group>
  );

  return (
    <Grid columns={3}>
      <Grid.Row>
        <h1 className="page-title">Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {user && (
          <Grid.Column>
            <PostForm />
          </Grid.Column>
        )}
        {PostsMarkup}
      </Grid.Row>
    </Grid>
  );
}

export default memo(Home);

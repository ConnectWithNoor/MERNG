import React, { memo } from 'react';
import { Dimmer, Loader as Load, Segment } from 'semantic-ui-react';

function Loader() {
  return (
    <Segment
      style={{
        width: '50%',
        height: '20vh',
        margin: '2rem auto',
      }}
      basic
    >
      <Dimmer active inverted>
        <Load size="big" inverted>
          You are awesome
        </Load>
      </Dimmer>
    </Segment>
  );
}

export default memo(Loader);

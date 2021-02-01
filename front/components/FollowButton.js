import React from 'react';
import { Button } from "antd";
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const FollowButton = ({ post, onUnfollow, onFollow }) => {
  const { me } = useSelector(state => state.user)

  if (!me || post.User.id === me.id) {
    return null;
  }
  if (me.Followings && me.Followings.find(v => v.id === post.User.id)) {
    return (<Button onClick={onUnfollow(post.User.id)}>언팔로우</Button>);
  } else {
    return (<Button onClick={onFollow(post.User.id)}>팔로우</Button>);
  }
}

FollowButton.propTypes = {
  post: PropTypes.object.isRequired,
  onUnfollow: PropTypes.func.isRequired,
  onFollow: PropTypes.func.isRequired,
};

FollowButton.defaultProps = {
  me: null,
};

export default FollowButton;

import { Avatar, Button, Icon, Card } from "antd";
import React from "react";
import PropTypes from 'prop-types';

// 타밍라인과 같은 역활을 함
const dummy = {
  isLoggedIn: true,
  imagePaths: [],
  mainPosts: [{
    User: {
      id: 1,
      nickname: '제로초',
    },
    content: '첫 번째 게시글',
    img : 'https://cdn.crowdpic.net/list-thumb/thumb_l_C033BE71DECD4E2B703A91F4FD6D59CD.jpg',
  }],
};

const PostCard = ({ post }) => {
  return (
    <Card
      key={+post.createdAt}
      cover={post.img && <img alt="example" src={post.img}/> }
      actions={[
        <Icon type="retweet" key="retweet" />,
        <Icon type="heart" key="heart" />,
        <Icon type="message" key="message" />,
        <Icon type="ellipsis" key="ellipsis" />,
      ]}
      extra={<Button>팔로우</Button>}
    >
      <Card.Meta
        avatar={<Avatar>{post.User.nickname[0]}</Avatar>}
        title={post.User.nickname}
        description={post.content}
      />
    </Card>
  )
};

PostCard.propTypes = {
  // Object의 상세를 적어줄 수 있음
  post: PropTypes.shape({
    User: PropTypes.object,
    content: PropTypes.string,
    img: PropTypes.string,
    createdAt: PropTypes.object,
  })
};

export default PostCard;

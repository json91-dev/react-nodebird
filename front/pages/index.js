import React from 'react';
import { Form, Input, Button, Card, Avatar, Icon } from 'antd';
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";

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

const Home = () => {
  return (
    <div>
      {dummy.isLoggedIn && <PostForm />}
      {dummy.mainPosts.map((c) => {
        return (
          <PostCard key={c} post={c} />
        )
      })}

    </div>
  );
};

export default Home;


import React, {useEffect} from 'react';
import { Form, Input, Button, Card, Avatar, Icon } from 'antd';
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";
import { useDispatch, useSelector } from "react-redux";
import { LOG_IN, loginAction } from "../reducers/user";

const Home = () => {0
  const dispatch = useDispatch();
  // 잘개 쪼개면 rerendering이 적게 일어나기 때문에 좋다.
  const { user, isLoggedIn } = useSelector(state => state.user);
  const { mainPosts } = useSelector(state => state.post);
  useEffect(() => {
    // dispatch(loginAction);
  }, []);
  return (
    <div>
      {user ? <div>로그인 했습니다. { user.nickname }</div> : <div>로그아웃 했습니다.</div>}
      {isLoggedIn && <PostForm />}
      {mainPosts.map((c) => {
        return (
          <PostCard key={c} post={c} />
        )
      })}
    </div>
  );
};

export default Home;


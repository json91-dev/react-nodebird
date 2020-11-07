import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import { LOAD_MAIN_POSTS_REQUEST } from "../reducers/post";

const Home = () => {
  // 잘개 쪼개면 rerendering이 적게 일어나기 때문에 좋다.
  const { me } = useSelector((state) => state.user);
  const { mainPosts } = useSelector((state) => state.post);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: LOAD_MAIN_POSTS_REQUEST,
    });
  }, []);

  return (
    <div>
      {me && <PostForm />}

      {mainPosts.map((c) => (
        <PostCard key={c} post={c} />
      ))}
    </div>
  );
};

export default Home;

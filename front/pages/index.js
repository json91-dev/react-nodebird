import React, { useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PostForm from '../containers/PostForm';
import PostCard from '../containers/PostCard';
import { LOAD_MAIN_POSTS_REQUEST } from '../reducers/post';

const Home = () => {
  // 잘개 쪼개면 rerendering이 적게 일어나기 때문에 좋다.
  const { me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePost } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const countRef = useRef([]);

  const onScroll = useCallback(() => {
    const { scrollY } = window;
    const { clientHeight, scrollHeight } = document.documentElement;

    console.log(scrollY, clientHeight, scrollHeight);

    if (scrollY + clientHeight > scrollHeight - 300) { // 끝까지 가기 300정도 위쪽부분에서 dispatch
      if (hasMorePost) {
        const lastId = mainPosts[mainPosts.length - 1].id;
        if (!countRef.current.includes(lastId)) {
          dispatch({
            type: LOAD_MAIN_POSTS_REQUEST,
            lastId, // 마지막 게시글의 id
          });
          countRef.current.push(lastId);
        }
      }
    }
  }, [hasMorePost, mainPosts.length]);

  useEffect(() => {
    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [mainPosts.length]); // 강력한 캐싱을 막기 위함.

  return (
    <div>
      {me && <PostForm />}

      {mainPosts.map((c) => (
        <PostCard key={c.id} post={c} />
      ))}
    </div>
  );
};

Home.getInitialProps = async (context) => {
  context.store.dispatch({
    type: LOAD_MAIN_POSTS_REQUEST,
  });
};

export default Home;

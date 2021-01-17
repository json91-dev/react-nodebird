import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Card } from 'antd';
import { LOAD_USER_POSTS_REQUEST } from '../reducers/post';
import { LOAD_USER_REQUEST } from '../reducers/user';
import PostCard from '../containers/PostCard';

const User = ({ id }) => {
  const { userInfo } = useSelector(state => state.user);

  const dispatch = useDispatch();
  const { mainPosts, hasMorePost } = useSelector(state => state.post);

  const onScroll = useCallback(() => {
    const { scrollY } = window;
    const { clientHeight, scrollHeight } = document.documentElement;
    console.log(scrollY, clientHeight, scrollHeight);

    if (scrollY + clientHeight > scrollHeight - 300) { // 끝까지 가기 300정도 위쪽부분에서 dispatch
      if (hasMorePost) {
        dispatch({
          type: LOAD_USER_POSTS_REQUEST,
          data: id,
          lastId: mainPosts[mainPosts.length - 1].id, // 마지막 게시글의 id
        });
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
      {userInfo
        ? (
          <Card
            actions={[
              <div key="twit">
                짹짹
                <br />
                {userInfo.Posts}
              </div>,
              <div key="following">
                팔로잉
                <br />
                {userInfo.Followings}
              </div>,
              <div key="follower">
                팔로워
                <br />
                {userInfo.Followers}
              </div>,
            ]}
          >
            <Card.Meta
              avartar={<Avatar>{userInfo.nickname[0]}</Avatar>}
              title={userInfo.nickname}
            />

          </Card>
        )
        : null}
      {mainPosts.map((c) => <PostCard key={c} post={c} />)}
    </div>
  );
};

User.propTypes = {
  id: PropTypes.number.isRequired,
};

User.getInitialProps = async (context) => {
  const { dispatch } = context.store;
  const id = parseInt(context.query.id, 10);

  dispatch({
    type: LOAD_USER_REQUEST,
    data: id,
  });

  dispatch({
    type: LOAD_USER_POSTS_REQUEST,
    data: id,
  });

  return { id };
};

export default User;

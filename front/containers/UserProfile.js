import { Avatar, Button, Card } from 'antd';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LOG_OUT_REQUEST } from '../reducers/user';
import { Menu } from "antd/lib/menu";
import Link from "next/dist/client/link";

const UserProfile = () => {
  const { me } = useSelector(state => state.user);
  const dispatch = useDispatch();

  // 자식 컴포넌트에게 props로 전달하기 때문에 useCallback 사용
  const onLogout = useCallback(() => {
    dispatch({
      type: LOG_OUT_REQUEST,
    });
  }, []);

  return (
    <Card
      actions={[
        <Link href="/profile" key="twit">
          <a>
            <div>짹짹<br />{me.Posts.length}</div>
          </a>
        </Link>,
        <Link href="/profile" key="following">
          <a>
            <div>팔로잉<br />{me.Followings ? me.Followings.length : 0}</div>
          </a>
        </Link>,
        <Link href="/profile" key="follower">
          <a>
            <div>팔로워<br />{me.Followers ? me.Followers.length : 0}</div>
          </a>
        </Link>,
      ]}
    >
      <Card.Meta
        avatar={<Avatar>{me.nickname[0]}</Avatar>}
        title={me.nickname}
      />
      <Button onClick={onLogout}>로그아웃</Button>
    </Card>
  );
};

export default UserProfile;

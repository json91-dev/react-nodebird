import React, { useEffect } from 'react';
import Link from 'next/link';
import {
  Menu, Input, Button, Row, Col, Card, Avatar, Form,
} from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import LoginForm from './LoginForm';
import UserProfile from './UserProfile';
import { LOAD_USER_REQUEST } from "../reducers/user";

const AppLayout = ({ children }) => {
  const { isLoggedIn, me } = useSelector(state => state.user);
  const dispatch = useDispatch();

  // 사용자가 어느 페이지로 접속할지 모르기 때문에 공통 레이아웃에 작성한다.
  // 쿠키로 내 정보를 불러옴 => 쿠키가 없을때는 LOAD_USER가 수행되지 않음.
  useEffect(() => {
    if (!me) {
      dispatch({
        type: LOAD_USER_REQUEST,
      });
    }
  }, []);

  return (
    <div>
      <Menu mode="horizontal">
        <Menu.Item key="home"><Link href="/"><a>노드버드</a></Link></Menu.Item>
        <Menu.Item key="profile"><Link href="/profile"><a>프로필</a></Link></Menu.Item>
        <Menu.Item key="mail">
          <Input.Search enterButton style={{ verticalAlign: 'middle' }} />
        </Menu.Item>
      </Menu>

      {/* 좌우 사이 간격을 조정 */}
      <Row gutter={10}>
        <Col xs={6} md={6}>
          {me
            ? <UserProfile />
            : <LoginForm />}

        </Col>
        <Col xs={12} md={12}>
          {children}
        </Col>
        <Col xs={6} md={6} />
      </Row>
    </div>
  );
};

export default AppLayout;

import React from 'react';
import Router from 'next/router';
import Link from 'next/link';
import {
  Menu, Input, Row, Col,
} from 'antd';
import { useSelector} from 'react-redux';
import LoginForm from '../containers/LoginForm';
import UserProfile from '../containers/UserProfile';

const AppLayout = ({ children }) => {
  const { me } = useSelector(state => state.user);
  const onSearch = (value) => {
    Router.push({ pathname: 'hashtag', query: { tag: value }}, `hashtag/${value}`);
  };

  return (
    <div>
      <Menu mode="horizontal">
        <Menu.Item key="home"><Link href="/"><a>노드버드</a></Link></Menu.Item>
        <Menu.Item key="profile"><Link href="/profile"><a>프로필</a></Link></Menu.Item>
        <Menu.Item key="mail">
          <Input.Search
            enterButton
            style={{ verticalAlign: 'middle' }}
            onSearch={onSearch}
          />
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

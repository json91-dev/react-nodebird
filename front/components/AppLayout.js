import React from 'react';
import Link from 'next/link'
import { Menu, Input, Button, Row, Col, Card, Avatar, Form } from 'antd';
import LoginForm from "./LoginForm";

const dummy = {
  nickname: '제로초',
  Post: [],
  Followings: [],
  Followers: [],
  isLoggedIn: true,

};

const AppLayout = ({children}) => {
  return (
    <div>
      <Menu mode="horizontal">
        <Menu.Item key="home"><Link href="/"><a>노드버드</a></Link></Menu.Item>
        <Menu.Item key="profile"><Link href="/profile"><a>프로필</a></Link></Menu.Item>
        <Menu.Item key="mail">
          <Input.Search enterButton style={{verticalAlign: 'middle'}} />
        </Menu.Item>
      </Menu>

      {/*좌우 사이 간격을 조정*/}
      <Row gutter={10}>
        <Col xs={6} md={6}>
          {dummy.isLoggedIn ?
            <Card
              actions={[
                <div key="twit">짹짹<br/>{dummy.Post.length}</div>,
                <div key="twit">팔로잉<br/>{dummy.Followings.length}</div>,
                <div key="twit">팔로워<br/>{dummy.Followers.length}</div>,

              ]}
            >
              <Card.Meta
                avatar={<Avatar>{dummy.nickname[0]}</Avatar>}
                title={dummy.nickname}
              />
            </Card>
            :
            <LoginForm />
          }


        </Col>
        <Col xs={12} md={12}>
          {children}
        </Col>
        <Col xs={6} md={6}></Col>
      </Row>
    </div>
  );
}

export default AppLayout;

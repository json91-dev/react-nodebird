import React, { useCallback } from 'react';
import { Button, Col, Form, Input } from "antd";
import Link from "next/dist/client/link";
import { useInput } from '../pages/signup';

const LoginForm = () => {
  const [id, onChangeId] = useInput('');
  const [password, onChangePassword] = useInput('');

  // 자식 컴포넌트로 넘기는 함수들을 무조건 useCallback으로 감싸준다.
  const onSubmitForm = useCallback((e) => {
    e.preventDefault()
    console.log({id, password});
  }, [id, password]);

  return (
    <Form onSubmit={onSubmitForm} style={{ padding: '10px' }}>
      <div>
        <label htmlFor="user-id">아이디</label>
        <br/>
        <Input name="user-id" value={id} onChange={onChangeId} required/>
        <div>
          <label htmlFor="user-password">비밀번호</label>
          <br/>
          <Input name="user-password" value={password} onChange={onChangePassword} type="password"  required/>
          <div>
            <Button type="primary" htmlType="submit" loading={false}>로그인</Button>
            <Link href="/signup"><a><Button>회원가입</Button></a></Link>
          </div>
        </div>
      </div>
    </Form>
  )
}

export default LoginForm;


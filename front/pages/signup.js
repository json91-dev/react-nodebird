// 메인화면
import React, { useState, useCallback } from 'react';
import AppLayout from '../components/AppLayout'
import Head from 'next/head';
import PropTypes from 'prop-types';
import { Form, Input, Checkbox, Button } from 'antd';

const TextInput = ({ value }) => {
  return (
    <div>{value}</div>
  )

};

TextInput.propTypes = {
  value: PropTypes.string,
}

const Signup = () => {
  const [ id, setId ] = useState('');
  const [ nick, setNick ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ passwordCheck, setPasswordCheck ] = useState('');
  const [ term, setTerm ] = useState(false);

  const [ passwordError, setPasswordError ] = useState(false);
  const [ termError, setTermError ] = useState(false);


  /**
   * props로 넘겨주는 함수들은 useCallback으로 감싸줘야함.
   * 함수 컴포넌트들이 state가 바뀔때마다 리렌더링되는데, 이때 함수들이 새로 생성되며, 함수를 전달받은 자식컴포넌트들은 렌더링들 다시 실행하게 된다.
   * (의도치 않은 리렌더링 발생)
   */

  const onSubmit = useCallback((e) => {
    // e.preventDefault();

    if (password !== passwordCheck) {
      return setPasswordError(true);
    }
    if (!term) {
      return setTermError(true);
    }

    console.log({ id, nick, password, passwordCheck, term });
  }, [ password, passwordCheck, term ]);

  const onChangeId = useCallback((e) => {
    setId(e.target.value);
  }, []);

  const onChangeNick = useCallback((e) => {
    setNick(e.target.value);
  }, []);

  const onChangePassword = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  const onChangePasswordChk = useCallback((e) => {
    setPasswordError(e.target.value !== password);
    setPasswordCheck(e.target.value);
  }, [ password ]);

  const onChangeTerm = useCallback((e) => {
    setTermError(false);
    setTerm(e.target.checked);
  }, []);

  return (
    <>
      <Form onFinish={onSubmit} style={{ padding: 10 }}>
        <TextInput value="135"/>
        <div>
          <label htmlFor="user-id">아이디</label>
          <br/>
          <Input name="user-id" value={id} required onChange={onChangeId}/>
        </div>
        <div>
          <label htmlFor="user-nick">닉네임</label>
          <br/>
          <Input name="user-nick" value={nick} required onChange={onChangeNick}/>

        </div>
        <div>
          <label htmlFor="user-password">비밀번호</label>
          <br/>
          <Input name="user-password" value={password} required onChange={onChangePassword}/>
        </div>
        <div>
          <label htmlFor="user-password-chk">비밀번호 체크</label>
          <br/>
          <Input name="user-password-check" value={passwordCheck} required onChange={onChangePasswordChk}/>
          {passwordError && <div style={{ color: 'red' }}>비밀번호가 일치하지 않습니다.</div>}
        </div>
        <div>
          <Checkbox name="user-term" onChange={onChangeTerm}>제로초 말을 잘 들을 것을 동의합니다.</Checkbox>
          {termError && <div style={{ color: 'red' }}>약관에 동의하셔야 합니다.</div>}
        </div>
        <div style={{ marginTop: 10 }}>
          {/*파란색버튼*/}
          <Button type="primary" htmlType="submit">가입하기</Button>
        </div>
      </Form>
    </>
  )
}

export default Signup


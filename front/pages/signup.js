// 메인화면
import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Form, Input, Checkbox, Button,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';
import { SIGN_UP_REQUEST } from '../reducers/user';

const TextInput = ({ value }) => (
  <div>{value}</div>
);

TextInput.propTypes = {
  value: PropTypes.string,
};

// 커스텀 훅
// Form의 event에 대한 input 콜백의 값을 useState에 값으로 지정하는 부분을 최소화할 수 있음
export const useInput = (initValue = null) => {
  const [value, setter] = useState(initValue);
  const handler = (e) => {
    setter(e.target.value);
  };

  return [value, handler];
};

const Signup = () => {
  const [id, setId] = useState('');
  const [nick, setNick] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [term, setTerm] = useState(false);

  const [passwordError, setPasswordError] = useState(false);
  const [termError, setTermError] = useState(false);
  const dispatch = useDispatch();
  const { isSigningUp, me } = useSelector(state => state.user);

  // 객체는 useEffect에 넣지 않는것이 좋다.
  // id가 생겼을때 signup page에서 메인페이지로 이동
  useEffect(() => {
    if (me) {
      Router.push('/');
    }
  }, [me && me.id]);

  /**
   * props로 넘겨주는 함수들은 useCallback으로 감싸줘야함.
   * 함수 컴포넌트들이 state가 바뀔때마다 리렌더링되는데, 이때 함수들이 새로 생성되며, 함수를 전달받은 자식컴포넌트들은 렌더링들 다시 실행하게 된다.
   * (의도치 않은 리렌더링 발생)
   */
  const onSubmit = useCallback((e) => {
    e.preventDefault();

    if (password !== passwordCheck) {
      return setPasswordError(true);
    }
    if (!term) {
      return setTermError(true);
    }
    dispatch({
      type: SIGN_UP_REQUEST,
      data: {
        userId: id,
        password,
        nickname: nick,
      },
    });

    console.log({
      id, nick, password, passwordCheck, term,
    });

    return null;
  }, [id, nick, password, passwordCheck, term]);

  const onChangeId = useCallback((e) => {
    setId(e.target.value);
  }, []);

  const onChangeNick = useCallback((e) => {
    console.log(e.target.value);
    setNick(e.target.value);
  }, []);

  const onChangePassword = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  const onChangePasswordChk = useCallback((e) => {
    setPasswordError(e.target.value !== password);
    setPasswordCheck(e.target.value);
  }, [password]);

  const onChangeTerm = useCallback((e) => {
    setTermError(false);
    setTerm(e.target.checked);
  }, []);

  return (
    <>
      <Form onSubmit={onSubmit} style={{ padding: 10 }}>
        <TextInput value="135" />
        <div>
          <label htmlFor="user-id">아이디</label>
          <br />
          <Input name="user-id" value={id} required onChange={onChangeId} />
        </div>
        <div>
          <label htmlFor="user-nick">닉네임</label>
          <br />
          <Input name="user-nick" value={nick} required onChange={onChangeNick} />

        </div>
        <div>
          <label htmlFor="user-password">비밀번호</label>
          <br />
          <Input name="user-password" value={password} required onChange={onChangePassword} />
        </div>
        <div>
          <label htmlFor="user-password-chk">비밀번호 체크</label>
          <br />
          <Input name="user-password-check" value={passwordCheck} required onChange={onChangePasswordChk} />
          {passwordError && <div style={{ color: 'red' }}>비밀번호가 일치하지 않습니다.</div>}
        </div>
        <div>
          <Checkbox name="user-term" onChange={onChangeTerm}>제로초 말을 잘 들을 것을 동의합니다.</Checkbox>
          {termError && <div style={{ color: 'red' }}>약관에 동의하셔야 합니다.</div>}
        </div>
        <div style={{ marginTop: 10 }}>
          {/* 파란색버튼 */}
          <Button type="primary" htmlType="submit" loading={isSigningUp}>가입하기</Button>
        </div>
      </Form>
    </>
  );
};

export default Signup;

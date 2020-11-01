import axios from 'axios';

import {
  all, fork, put, call, takeEvery, delay,
} from 'redux-saga/effects';

import {
  LOG_IN_REQUEST,
  LOG_IN_SUCCESS,
  LOG_IN_FAILURE,

  SIGN_UP_RESUEST,
  SIGN_UP_SUCCESS,
  SIGN_UP_FAILURE,

} from '../reducers/user';

axios.defaults.baseURL = 'http://localhost:3065/api';

function loginAPI(loginData) {
  // 서버에 요청을 보내는 부분
  // data.userId, data.password를 passport 로그인으로 넘겨준다.
  // withCredential을 true로 설정해주면 쿠키를 주고받을 수 있다.
  return axios.post('http://localhost:3065/api/user/login', loginData, {
    withCredentials: true,
  });
}

function* login(action) {
  try {
    const result = yield call(loginAPI, action.data);
    yield put({ // put은 dispatch와 동일하다.
      type: LOG_IN_SUCCESS,
      data: result.data,
    });
  } catch (e) { // loginAPI 실패
    console.error(e);
    yield put({
      type: LOG_IN_FAILURE,
    });
  }
}

// 로그인 액션 분기
function* watchLogin() {
  yield takeEvery(LOG_IN_REQUEST, login);
}

function signUpAPI(signUpData) {
  return axios.post('http://localhost:3065/api/user/', signUpData);
}

function* signUp(action) {
  try {
    yield call(signUpAPI, action.data);
    yield put({
      type: SIGN_UP_SUCCESS,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: SIGN_UP_FAILURE,
    });
  }
}

function* watchSignUp() {
  yield takeEvery(SIGN_UP_RESUEST, signUp);
}

export default function* userSaga() {
  yield all([
    fork(watchLogin),
    fork(watchSignUp),
  ]);
}

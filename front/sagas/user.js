import axios from 'axios';

import {
  all, fork, put, call, takeEvery, delay,
} from 'redux-saga/effects';

import {
  LOG_IN_REQUEST,
  LOG_IN_SUCCESS,
  LOG_IN_FAILURE,

  LOG_OUT_REQUEST,
  LOG_OUT_SUCCESS,
  LOG_OUT_FAILURE,

  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAILURE,

  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
  SIGN_UP_FAILURE,

} from '../reducers/user';

/** 로그인 **/

function logInAPI(logInData) {
  // 서버에 요청을 보내는 부분
  // data.userId, data.password를 passport 로그인으로 넘겨준다.
  // withCredential을 true로 설정해주면 쿠키를 주고받을 수 있다.
  return axios.post('http://localhost:3065/api/user/login', logInData, {
    withCredentials: true,
  });
}

function* logIn(action) {
  try {
    const result = yield call(logInAPI, action.data);
    yield put({ // put은 dispatch와 동일하다.
      type: LOG_IN_SUCCESS,
      data: result.data,
    });
  } catch (e) { // logInAPI 실패
    console.error(e);
    yield put({
      type: LOG_IN_FAILURE,
    });
  }
}

function* watchLogIn() {
  yield takeEvery(LOG_IN_REQUEST, logIn);
}

/** 회원가입 **/

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
  yield takeEvery(SIGN_UP_REQUEST, signUp);
}

/** 로그아웃 **/

function logOutAPI() {
  return axios.post('/user/logout', {}, {
    withCredentials: true,
  });
}

function* logOut(action) {
  try {
    yield call(logOutAPI, action.data);
    yield put({ // put은 dispatch와 동일하다.
      type: LOG_OUT_SUCCESS,
    });
  } catch (e) { // logOutAPI 실패
    console.error(e);
    yield put({
      type: LOG_OUT_FAILURE,
    });
  }
}

// 로그인 액션 분기
function* watchLogOut() {
  yield takeEvery(LOG_OUT_REQUEST, logOut);
}

/** 유저정보 **/

// 내정보를 처음에 가져오는 API => Session쿠키를 서버쪽에 보내서 서버쪽 세션 데이터를 결과로 반환받는다. (유저 정보)
function loadUserAPI() { // 쿠키는 알아서 보내주는 것이기 때문에 데이터가 필요 없다.
  return axios.get('/user/', {
    withCredentials: true, // 서버쪽에서 쿠키를 가져옴.
  });
}

function* loadUser() {
  try {
    const result = yield call(loadUserAPI); // 쿠키는 알아서 보내주는 것이기 때문에 데이터가 필요 없다.
    yield put({ // put은 dispatch와 동일하다.
      type: LOAD_USER_SUCCESS,
      data: result.data,
    });
  } catch (e) { // loadUserAPI 실패
    console.error(e);
    yield put({
      type: LOAD_USER_FAILURE,
    });
  }
}

function* watchLoadUser() {
  yield takeEvery(LOAD_USER_REQUEST, loadUser);
}

export default function* userSaga() {
  yield all([
    fork(watchLogIn),
    fork(watchLogOut),
    fork(watchLoadUser),
    fork(watchSignUp),
  ]);
}

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

function* login() {
  try {
    // yield call(loginAPI);
    yield delay(2000);
    yield put({ // put은 dispatch와 동일하다.
      type: LOG_IN_SUCCESS,
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

import {
  all, fork, put, call, takeEvery,
} from 'redux-saga/effects';
import {
  LOG_IN_REQUEST,
  LOG_IN_SUCCESS,
  LOG_IN_FAILURE,
  SIGN_UP_RESUEST,
  SIGN_UP_SUCCESS,
  SIGN_UP_FAILURE
} from '../reducers/user';

function loginAPI() {
  // 서버의 요청을 보내는 부분이다.
}

function* login() {
  try {
    yield call(loginAPI);
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

function signUpAPI() {
  return null;
}

function* signUp() {
  try {
    yield call(signUpAPI);
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
    fork(watchLogin()),
    fork(watchSignUp()),
  ]);
}

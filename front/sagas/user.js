import {
  all, fork, put, call, takeEvery,
} from 'redux-saga/effects';
import { LOG_IN_REQUEST, LOG_IN_SUCCESS, LOG_IN_FAILURE } from '../reducers/user';

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
    console.log(e);
    yield put({
      type: LOG_IN_FAILURE,
    });
  }
}

// 로그인 액션 분기
function* watchLogin() {
  yield takeEvery(LOG_IN_REQUEST, login);
}

export default function* userSaga() {
  yield all([
    fork(watchLogin()),
  ]);
}

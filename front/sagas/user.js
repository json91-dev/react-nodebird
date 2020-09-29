import { all, fork, put, call, takeEvery, takeLatest, take } from 'redux-saga/effects';
import { LOG_IN, LOG_IN_SUCCESS, LOG_IN_FAILURE } from "../reducers/user";

const HELLO_SAGA = "HELLO_SAGA";

function loginAPI() {
  // 서버의 요청을
}

function* login() {
  try{
    yield call(loginAPI);
    yield put({ // put은 dispatch와 동일하다.
      type: LOG_IN_SUCCESS,
    })
  } catch (e) { // loginAPI 실패
    console.log(e);
    yield put({
      type: LOG_IN_FAILURE
    })
  }
}

function* watchSignUp() {

}

function* watchLogin() {
 // yield takeLatest(LOG_IN, login)
  yield take(LOG_IN);
  yield put({
    type: LOG_IN_SUCCESS,
  })
}

export default function* userSaga() {
  yield all([
    watchLogin(),
    watchSignUp()
  ]);
}

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

  FOLLOW_USER_SUCCESS,
  UNFOLLOW_USER_SUCCESS,
  UNFOLLOW_USER_FAILURE,
  UNFOLLOW_USER_REQUEST,
  FOLLOW_USER_FAILURE,
  FOLLOW_USER_REQUEST,

  LOAD_FOLLOWERS_SUCCESS,
  LOAD_FOLLOWERS_FAILURE,
  LOAD_FOLLOWERS_REQUEST,
  LOAD_FOLLOWINGS_SUCCESS,
  LOAD_FOLLOWINGS_FAILURE,
  LOAD_FOLLOWINGS_REQUEST,
  REMOVE_FOLLOWER_SUCCESS,
  REMOVE_FOLLOWER_FAILURE,
  REMOVE_FOLLOWER_REQUEST,
  EDIT_NICKNAME_REQUEST, EDIT_NICKNAME_SUCCESS, EDIT_NICKNAME_FAILURE,

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

/**
 * 유저정보를 불러오는 API
 * 자신의 정보 또는 남의 정보를 불러옴
 */

// 내정보를 처음에 가져오는 API
// : Session쿠키를 서버쪽에 보내서 서버쪽 세션 데이터를 결과로 반환받는다. (유저 정보)
// 쿠키는 알아서 보내주는 것이기 때문에 데이터가 필요 없다.
function loadUserAPI(userId) {
  return axios.get(userId ? `/user/${userId}` : '/user/', {
    withCredentials: true, // 클라이언트에서 요청 보낼 때는 브라우저가 쿠키를 같이 동봉해준다.
  }); // 서버사이드 렌더링일때는 브라우저가 없어서 쿠키를 전달해주지 못한다.
}

function* loadUser(action) {
  try {
    const result = yield call(loadUserAPI, action.data); // 쿠키는 알아서 보내주는 것이기 때문에 데이터가 필요 없다.
    yield put({ // put은 dispatch와 동일하다.
      type: LOAD_USER_SUCCESS,
      data: result.data,
      me: !action.data, // userId가 없으면 내정보이기 때문에 true
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

/** 유저 Follow **/
function followAPI(userId) {
  return axios.post(`/user/${userId}/follow`, {}, {
    withCredentials: true,
  });
}

function* follow(action) {
  try {
    const result = yield call(followAPI, action.data); // 쿠키는 알아서 보내주는 것이기 때문에 데이터가 필요 없다.
    yield put({ // put은 dispatch와 동일하다.
      type: FOLLOW_USER_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: FOLLOW_USER_FAILURE,
    });
  }
}

function* watchFollow() {
  yield takeEvery(FOLLOW_USER_REQUEST, follow);
}

/** 팔로워 목록 불러오기 (내가 팔로잉하는 사람들)**/
function loadFollowersAPI(userId, offset = 0, limit = 3) { // undefined일때 기본값 설정 (null일때는 x)
  return axios.get(`/user/${userId || 0}/followers?offset=${offset}&limit=${limit}`, {
    withCredentials: true,
  });
}

function* loadFollowers(action) {
  try {
    const result = yield call(loadFollowersAPI, action.data, action.offset); // 쿠키는 알아서 보내주는 것이기 때문에 데이터가 필요 없다.
    yield put({ // put은 dispatch와 동일하다.
      type: LOAD_FOLLOWERS_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_FOLLOWERS_FAILURE,
    });
  }
}

function* watchLoadFollowers() {
  yield takeEvery(LOAD_FOLLOWERS_REQUEST, loadFollowers);
}

/** 팔로잉 목록 불러오기 (나를 팔로우하는 사람들) **/
function loadFollowingsAPI(userId, offset = 0, limit = 3) {
  return axios.get(`/user/${userId || 0}/followings?offset=${offset}&limit=${limit}`, {
    withCredentials: true,
  });
}

function* loadFollowings(action) {
  try {
    const result = yield call(loadFollowingsAPI, action.data, action.offset); // 쿠키는 알아서 보내주는 것이기 때문에 데이터가 필요 없다.
    yield put({ // put은 dispatch와 동일하다.
      type: LOAD_FOLLOWINGS_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_FOLLOWINGS_FAILURE,
    });
  }
}

function* watchLoadFollowings() {
  yield takeEvery(LOAD_FOLLOWINGS_REQUEST, loadFollowings);
}

/** 나를 팔로우 하는사람 삭제하기 **/
function removeFollowerAPI(userId) {
  return axios.delete(`/user/${userId}/follower`, {
    withCredentials: true,
  });
}

function* removeFollower(action) {
  try {
    const result = yield call(removeFollowerAPI, action.data); // 쿠키는 알아서 보내주는 것이기 때문에 데이터가 필요 없다.
    yield put({ // put은 dispatch와 동일하다.
      type: REMOVE_FOLLOWER_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: REMOVE_FOLLOWER_FAILURE,
    });
  }
}

function* watchRemoveFollower() {
  yield takeEvery(REMOVE_FOLLOWER_REQUEST, removeFollower);
}

/** 유저 Unfollow **/
function unfollowAPI(userId) {
  return axios.delete(`/user/${userId}/follow`, {
    withCredentials: true,
  });
}

function* unfollow(action) {
  try {
    const result = yield call(unfollowAPI, action.data); // 쿠키는 알아서 보내주는 것이기 때문에 데이터가 필요 없다.
    yield put({ // put은 dispatch와 동일하다.
      type: UNFOLLOW_USER_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: UNFOLLOW_USER_FAILURE,
    });
  }
}

function* watchUnfollow() {
  yield takeEvery(UNFOLLOW_USER_REQUEST, unfollow);
}

/** 닉네임 변경 **/
function editNicknameAPI(nickname) {
  return axios.patch('/user/nickname', { nickname }, {
    withCredentials: true,
  });
}

function* editNickname(action) {
  try {
    const result = yield call(editNicknameAPI, action.data); // 쿠키는 알아서 보내주는 것이기 때문에 데이터가 필요 없다.
    yield put({
      type: EDIT_NICKNAME_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: EDIT_NICKNAME_FAILURE,
    });
  }
}

function* watchEditNickname() {
  yield takeEvery(EDIT_NICKNAME_REQUEST, editNickname);
}

export default function* userSaga() {
  yield all([
    fork(watchLogIn),
    fork(watchLogOut),
    fork(watchLoadUser),
    fork(watchSignUp),
    fork(watchFollow),
    fork(watchUnfollow),
    fork(watchLoadFollowers),
    fork(watchLoadFollowings),
    fork(watchRemoveFollower),
    fork(watchEditNickname),
  ]);
}

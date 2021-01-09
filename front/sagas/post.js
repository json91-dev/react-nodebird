import axios from 'axios';
import {
  all, fork, takeLatest, throttle , put, call,
} from 'redux-saga/effects';
import {
  ADD_COMMENT_FAILURE,
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_SUCCESS,
  ADD_POST_FAILURE,
  ADD_POST_REQUEST,
  ADD_POST_SUCCESS,
  LOAD_MAIN_POSTS_REQUEST,
  LOAD_MAIN_POSTS_SUCCESS,
  LOAD_MAIN_POSTS_FAILURE,
  LOAD_USER_POSTS_SUCCESS,
  LOAD_USER_POSTS_FAILURE,
  LOAD_USER_POSTS_REQUEST,
  LOAD_HASHTAG_POSTS_REQUEST,
  LOAD_HASHTAG_POSTS_FAILURE,
  LOAD_HASHTAG_POSTS_SUCCESS,
  LOAD_COMMENTS_SUCCESS,
  LOAD_COMMENTS_FAILURE,
  LOAD_COMMENTS_REQUEST,
  UPLOAD_IMAGES_REQUEST,
  UPLOAD_IMAGES_SUCCESS,
  UPLOAD_IMAGES_FAILURE,
  UNLIKE_POST_SUCCESS,
  UNLIKE_POST_FAILURE,
  UNLIKE_POST_REQUEST,
  LIKE_POST_SUCCESS,
  LIKE_POST_FAILURE,
  LIKE_POST_REQUEST,
  RETWEET_REQUEST,
  RETWEET_SUCCESS,
  RETWEET_FAILURE,
  REMOVE_POST_SUCCESS,
  REMOVE_POST_FAILURE,
  REMOVE_POST_REQUEST,
  LOAD_POST_REQUEST,
  LOAD_POST_FAILURE,
  LOAD_POST_SUCCESS,
} from '../reducers/post';

import { ADD_POST_TO_ME, REMOVE_POST_OF_ME } from "../reducers/user";

function addPostAPI(postData) {
  return axios.post('/post', postData, {
    withCredentials: true, // 로그인한 사람만 쓸수있도록 쿠키를 같이 보내줌
  });
}

function* addPost(action) {
  try {
    const result = yield call(addPostAPI, action.data);
    yield put({ // post reducer의 데이터 수정
      type: ADD_POST_SUCCESS,
      data: result.data,
    });
    yield put({ // user reducer의 데이터 수정
      type: ADD_POST_TO_ME,
      data: result.data.id,
    });
  } catch (e) {
    yield put({
      type: ADD_POST_FAILURE,
      error: e,
    });
  }
}

function* watchAddPost() {
  yield takeLatest(ADD_POST_REQUEST, addPost);
}

/** Main 게시글 요청 **/
function loadMainPostsAPI(lastId = 0, limit = 10) { // 게시글이 하나도 안불러져 있을때는 0으로 처리
  return axios.get(`/posts?lastId=${lastId}&limit=${limit}`);
}

function* loadMainPosts(action) {
  try {
    const result = yield call(loadMainPostsAPI, action.lastId);
    yield put({
      type: LOAD_MAIN_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    yield put({
      type: LOAD_MAIN_POSTS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadMainPosts() {
  yield throttle(2000, LOAD_MAIN_POSTS_REQUEST, loadMainPosts);
}

/** 댓글 쓰기 **/
function addCommentAPI(data) {
  return axios.post(`/post/${data.postId}/comment`, { content: data.content }, {
    withCredentials: true,
  });
}

function* addComment(action) {
  try {
    const result = yield call(addCommentAPI, action.data);
    yield put({
      type: ADD_COMMENT_SUCCESS,
      data: {
        postId: action.data.postId,
        comment: result.data,
      },
    });
  } catch (e) {
    yield put({
      type: ADD_COMMENT_FAILURE,
      error: e,
    });
  }
}

function* watchAddComment() {
  yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}

/** 댓글 쓰기 **/
function loadCommentsAPI(postId) {
  return axios.get(`/post/${postId}/comments`);
}

function* loadComments(action) {
  try {
    const result = yield call(loadCommentsAPI, action.data);
    yield put({
      type: LOAD_COMMENTS_SUCCESS,
      data: {
        postId: action.data,
        comments: result.data,
      },
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_COMMENTS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadComments() {
  yield takeLatest(LOAD_COMMENTS_REQUEST, loadComments);
}

/** 해시태그 요청 **/
function loadHashtagPostsAPI(tag, lastId) {
  return axios.get(`/hashtag/${encodeURIComponent(tag)}?lastId=${lastId}&limit=10`); // 쿠키를 안넣어도 된다.
}

function* loadHashtagPosts(action) {
  try {
    const result = yield call(loadHashtagPostsAPI, action.data, action.lastId);

    yield put({
      type: LOAD_HASHTAG_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_HASHTAG_POSTS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadHashtagPosts() {
  yield throttle(2000, LOAD_HASHTAG_POSTS_REQUEST, loadHashtagPosts);
}

function loadUserPostsAPI(id, lastId) {
  return axios.get(`/user/${id || 0}/posts?lastId=${lastId}&limit=10`); // 쿠키를 안넣어도 된다.
}

function* loadUserPosts(action) {
  try {
    const result = yield call(loadUserPostsAPI, action.data, action.lastId);

    yield put({
      type: LOAD_USER_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    yield put({
      type: LOAD_USER_POSTS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadUserPosts() {
  yield throttle(2000, LOAD_USER_POSTS_REQUEST, loadUserPosts);
}

/** 이미지 업로드 **/
function uploadImagesAPI(formData) {
  return axios.post('/post/images', formData, {
    withCredentials: true, // 이미지는 로그인한 사용자만 올릴 수 있음.
  }); // 쿠키를 안넣어도 된다.
}

function* uploadImages(action) {
  try {
    const result = yield call(uploadImagesAPI, action.data);

    yield put({
      type: UPLOAD_IMAGES_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    yield put({
      type: UPLOAD_IMAGES_FAILURE,
      error: e,
    });
  }
}

function* watchUploadImages() {
  yield takeLatest(UPLOAD_IMAGES_REQUEST, uploadImages);
}

/** 좋아요 **/
function likePostAPI(postId) {
  return axios.post(`/post/${postId}/like`, {}, {
    withCredentials: true,
  });
}

function* likePost(action) {
  try {
    const result = yield call(likePostAPI, action.data);

    yield put({
      type: LIKE_POST_SUCCESS,
      data: {
        postId: action.data,
        userId: result.data.userId,
      },
    });
  } catch (e) {
    yield put({
      type: LIKE_POST_FAILURE,
      error: e,
    });
  }
}

function* watchLikePost() {
  yield takeLatest(LIKE_POST_REQUEST, likePost);
}

/** 좋아요 해제 **/
function unlikePostAPI(postId) {
  return axios.delete(`post/${postId}/like`, {
    withCredentials: true,
  });
}

function* unlikePost(action) {
  try {
    const result = yield call(unlikePostAPI, action.data);

    yield put({
      type: UNLIKE_POST_SUCCESS,
      data: {
        postId: action.data,
        userId: result.data.userId,
      },
    });
  } catch (e) {
    yield put({
      type: UNLIKE_POST_FAILURE,
      error: e,
    });
  }
}

function* watchUnlikePost() {
  yield takeLatest(UNLIKE_POST_REQUEST, unlikePost);
}

function retweetAPI(postId) {
  return axios.post(`post/${postId}/retweet`, {}, {
    withCredentials: true,
  });
}
// ERROR ...
function* retweet(action) {
  try {
    const result = yield call(retweetAPI, action.data);
    yield put({
      type: RETWEET_SUCCESS,
      data: result.data, // 리트윗한 게시글의 데이터
    });
  } catch (e) {
    alert(e.response.data);
    yield put({
      type: RETWEET_FAILURE,
      error: e,
    });
  }
}

function* watchRetweet() {
  yield takeLatest(RETWEET_REQUEST, retweet);
}

/** 게시글 삭제 **/
function removePostAPI(postId) {
  return axios.delete(`post/${postId}`, {
    withCredentials: true,
  });
}
// ERROR ...
function* removePost(action) {
  try {
    const result = yield call(removePostAPI, action.data);
    yield put({
      type: REMOVE_POST_SUCCESS,
      data: result.data, // 리트윗한 게시글의 데이터
    });
    yield put({
      type: REMOVE_POST_OF_ME,
      data: result.data,
    });
  } catch (e) {
    yield put({
      type: REMOVE_POST_FAILURE,
      error: e,
    });
  }
}

function* watchRemovePost() {
  yield takeLatest(REMOVE_POST_REQUEST, removePost);
}

/** 개별 포스트 불러오기 **/
function loadPostAPI(postId) {
  return axios.get(`post/${postId}`);
}

// ERROR ...
function* loadPost(action) {
  try {
    const result = yield call(loadPostAPI, action.data);
    yield put({
      type: LOAD_POST_SUCCESS,
      data: result.data, // 리트윗한 게시글의 데이터
    });
  } catch (e) {
    yield put({
      type: LOAD_POST_FAILURE,
      error: e,
    });
  }
}

function* watchLoadPost() {
  yield takeLatest(LOAD_POST_REQUEST, loadPost);
}

export default function* postSaga() {
  yield all([
    fork(watchLoadMainPosts),
    fork(watchAddPost),
    fork(watchAddComment),
    fork(watchLoadComments),
    fork(watchLoadHashtagPosts),
    fork(watchLoadUserPosts),
    fork(watchUploadImages),
    fork(watchLikePost),
    fork(watchUnlikePost),
    fork(watchRetweet),
    fork(watchRemovePost),
    fork(watchLoadPost),
  ]);
};

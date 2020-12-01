import axios from 'axios';
import {
  all, fork, takeLatest, delay, put, call,
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
} from '../reducers/post';

function addPostAPI(postData) {
  return axios.post('/post', postData, {
    withCredentials: true, // 로그인한 사람만 쓸수있도록 쿠키를 같이 보내줌
  });
}

function* addPost(action) {
  try {
    const result = yield call(addPostAPI, action.data);
    yield put({
      type: ADD_POST_SUCCESS,
      data: result.data,
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
function loadMainPostsAPI() {
  return axios.get('/posts'); // 쿠키를 안넣어도 된다.
}

function* loadMainPosts() {
  try {
    const result = yield call(loadMainPostsAPI);

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
  yield takeLatest(LOAD_MAIN_POSTS_REQUEST, loadMainPosts);
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
    console.error('11111');
  } catch (e) {
    console.error('2222');
    console.error(e);
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
function loadHashtagPostsAPI(tag) {
  return axios.get(`/hashtag/${tag}`); // 쿠키를 안넣어도 된다.
}

function* loadHashtagPosts(action) {
  try {
    const result = yield call(loadHashtagPostsAPI, action.data);

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
  yield takeLatest(LOAD_HASHTAG_POSTS_REQUEST, loadHashtagPosts);
}

/** 해시태그 요청 **/
function loadUserPostsAPI(id) {
  return axios.get(`/user/${id}/posts`); // 쿠키를 안넣어도 된다.
}

function* loadUserPosts(action) {
  try {
    const result = yield call(loadUserPostsAPI, action.data);

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
  yield takeLatest(LOAD_USER_POSTS_REQUEST, loadUserPosts);
}

/** 이미지 업로드 **/
function uploadImagesAPI(formData) {
  return axios.post(`/post/images`, formData, {
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


export default function* postSaga() {
  yield all([
    fork(watchLoadMainPosts),
    fork(watchAddPost),
    fork(watchAddComment),
    fork(watchLoadComments),
    fork(watchLoadHashtagPosts),
    fork(watchLoadUserPosts),
    fork(watchUploadImages),
  ]);
}

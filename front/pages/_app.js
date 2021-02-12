import React from 'react';
import PropTypes from 'prop-types';
import withRedux from 'next-redux-wrapper';
import withReduxSaga from 'next-redux-saga';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import Helmet from 'react-helmet';

import AppLayout from '../components/AppLayout';
import reducer from '../reducers';
import rootSaga from '../sagas';
import { LOAD_USER_REQUEST } from "../reducers/user";
import axios from "axios";
import { Container } from 'next/app';
import { frontUrl } from "../config/config"; // 내부 페이지를 렌더링 할수 있도록 선언

// Component는 next에서 넣어주는 props이다.
// 현재 소스코드에서 index, profile, signup등의 컴포넌트들에 대한 정보를 가지고 있다.
// pageProps는 각각의 컴포넌트에 대해 props를 내려주는데 ...pageProps로 넘겨주어야 한다.
const NodeBird = ({ Component, store, pageProps }) => (
  <Container>
    <Provider store={store}>
      <Helmet
        title="NodeBird"
        htmlAttributes={{ lang: 'ko' }} // 한국어 페이지라는것을 알려줌
        // 여기에 넣는 헬멧은 모든 페이지에 공통된 HEAD태그
        meta={[{
          charset: 'UTF-8',
        }, {
          name: 'viewport',
          content: 'width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=yew,viewport-fit=cover',
        }, {
          'http-equiv': 'X-UA-Compatible', content: 'IE-edge',
        }, {
          property: 'og:title', content: 'NodeBird', // Open Grape
        }, {
          property: 'description', content: '제로초의 NodeBird SNS', // Open Grape
        }, {
          property: 'og:description', content: '제로초의 NodeBird SNS', // Open Grape
        }, {
          property: 'og:type', content: 'website', // Open Grape
        }, {
          property: 'og:image', content: `${frontUrl}/favicon.ico`,
        }]}
        link={[{ // {}, // favicon 넣어 줄 예정
          rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/antd/4.6.3/antd.min.css',
        }, {
          rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css',
        }, {
          rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css',
        }]}
      />
      <AppLayout>
        <Component {...pageProps} />
      </AppLayout>
    </Provider>
  </Container>
);

NodeBird.propTypes = {
  // JSX로 들어갈수 있는 모든 것들 (문자, JSX, 숫자, 객체 등)
  // required : 항상 props가 존재하여야함.
  Component: PropTypes.elementType.isRequired,
  store: PropTypes.object.isRequired,
  pageProps: PropTypes.object.isRequired,
};

// next에서 실행시켜주는 부분이다.
NodeBird.getInitialProps = async (context) => {
  const { ctx, Component } = context;
  let pageProps = {};
  const state = ctx.store.getState();
  const cookie = ctx.isServer ? ctx.req.headers.cookie : '';

  if (ctx.isServer && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }

  if (!state.user.me) {
    ctx.store.dispatch({
      type: LOAD_USER_REQUEST,
    });
  }

  if (context.Component.getInitialProps) { // 컴포넌트에 getInitialProps전
    pageProps = await Component.getInitialProps(ctx) || {}; // 컴포넌트에서 return한 props가 해당 pageProps로 저장됨.
  }

  return { pageProps }; // 해당 props가 컴포넌트의 props임.
};

// nodeBird 컴포넌트에 props로 store를 넣어주는 역활을 함.
// state와 reducer가 합쳐져 있는게 store라고 생각하면 편하다.
const configureStore = (initialState, options) => {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [sagaMiddleware, (store) => (next) => (action) => { // 커스텀 미들웨어
    console.log(action);
    next(action);
  }]; // middleware는 redux에 없는 기능들을 추가 할때 주로 사용된다.

  /**
   * enhancer
   * enhancer는 middleware를 강화한다는 의미이다.
   * applyMiddleware를 통해 middleware들을 적용한 뒤,
   * compose를 통해 middleware들을 합성할 수 있다.
   *
   * windwo.REDUX_DEVTOOLS_EXTENSION_CONPOSE
   * window.REDUX_DEVTOOLS... 이하 아래부분은 REDUX DEV 공식사이트에서 가져온 내용으로, devtools를 다운받으면 __REDUX_DEVTOOLS_EXTENTION__함수가 생긴다.
   * 이 함수를 사용하여 middleware를 생성하고 합성하는 코드이다.
   * typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ !== 'undefined' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__() : (f) => f,
   *
   * 추가적으로 production일때는 redux의 state가 노출되면 안되므로, production일때 redux devtools에 대한 접근을 막아준다.
   */

  const enhancer = process.env.NODE_ENV === 'production'
    ? compose(applyMiddleware(...middlewares))
    : compose(applyMiddleware(...middlewares),
      !options.isServer && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ !== 'undefined' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__() : (f) => f);

  const store = createStore(reducer, initialState, enhancer);
  // sagaMiddleware.run(rootSaga); // 기존 코드 제거
  store.sagaTask = sagaMiddleware.run(rootSaga);

  return store;
};

// NodeBird 컴포넌트의 props로 store를 연결해주는 역활을 한다.
export default withRedux(configureStore)(withReduxSaga(NodeBird));

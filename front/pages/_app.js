import React from 'react';
import Head from "next/dist/next-server/lib/head";
import PropTypes from 'prop-types';
import AppLayout from "../components/AppLayout";

// Component는 next에서 넣어주는 props이다.
// 현재 소스코드에서 index, profile, signup등의 컴포넌트들에 대한 정보를 가지고 있다.
const NodeBird = ({Component}) => {
  return (
    <>
      <Head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/4.6.3/antd.min.css"/>
      </Head>
      <AppLayout>
        <Component/>
      </AppLayout>
    </>
  )
};

NodeBird.propTypes = {
  Component: PropTypes.elementType, // JSX로 들어갈수 있는 모든 것들 (문자, JSX, 숫자, 객체 등)

}

export default NodeBird;

// 메인화면
import React from 'react';
import AppLayout from '../components/AppLayout'
import Head from 'next/head';

const Profile = () => {
  return (
    <>
      <Head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/4.6.3/antd.min.css"/>
      </Head>
      <AppLayout>
        <div>내 프로필</div>
      </AppLayout>
    </>
  )
}

export default Profile


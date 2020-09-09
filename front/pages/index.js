// 메인화면
import Link from 'next/link';
import AppLayout from "../components/AppLayout";
import Head from 'next/head';


const Home = () => {
  return (
    <>
      <Head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/4.6.3/antd.min.css"/>
      </Head>
      <AppLayout>
        <Link href="/about"><a>about</a></Link>
        <div>Hello, next</div>
      </AppLayout>
    </>
  )
};

export default Home


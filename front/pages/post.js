import React from 'react';
import { useSelector } from 'react-redux';
import { LOAD_POST_REQUEST } from "../reducers/post";
import { PropTypes } from 'prop-types';
import Helmet from 'react-helmet';

const Post = ({ id }) => {
  const { singlePost } = useSelector(state =>  state.post);
  return (
    <>
      <Helmet
        title={`${singlePost.User.nickname}님의 글`}
        description={singlePost.content}
        meta={[{
          name: 'description', content: singlePost.content,
        }, {
          property: 'og:title', content: `${singlePost.User.nickname}님의 글`,
        }, {
          property: 'og:description', content: singlePost.content,
        }, {
          property: 'og:image', content: singlePost.Images[0] && `http://localhost:3065/${singlePost.Images[0].src}`,
        }, {
          property: 'og:url', content: `http://localhost:3065/post/${id}`,
        }]}
      />
      <div>{singlePost.content}</div>
      <div>{singlePost.User.nickname}</div>
      <div>
        {singlePost.Images[0] && <img src={`http://localhost:3065/${singlePost.Images[0].src}`}/>}
      </div>
    </>
  );
};

Post.getInitialProps = async (context) => {
  context.store.dispatch({
    type: LOAD_POST_REQUEST,
    data: context.query.id,
  });
};

Post.propTypes = {
  id: PropTypes.number.isRequired,
};

export default Post;

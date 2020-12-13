import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';

const PostCardContent = ({postData}) => {
  return (
    (
      <div>
        {postData.split(/(#[^\s]+)/g).map((v) => { // 정규표현식을 포함하여 파싱.
          if (v.match(/#[^\s]+/g)) { // 해시태그면 링크로 바꿔줌.
            return (
              <Link href={`/hashtag/${v.slice(1)}`} key={v}>
                <a>{v}</a>
              </Link>
            );
          }
          return v;
        })}
      </div>
    )
  );
};
PostCardContent.propTypes = {
  postData: PropTypes.string.isRequired,
};

export default PostCardContent;

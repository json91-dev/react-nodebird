import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import ImagesZoom from './ImagesZoom';

const PostImages = ({ images }) => {
  const [showImagesZoom, setShowImagesZoom] = useState(false); // 이미지 Zoom이 될지 말지를 지정하는 변수

  const onZoom = useCallback(() => { // 이미지 클릭시 이미지를 Zoom 시켜줌
    setShowImagesZoom(true);
  }, []);

  const onClose = useCallback(() => {
    setShowImagesZoom(false);
  }, []);

  if (images.length === 1) {
    return (
      <>
        <img src={`http://localhost:3065/${images[0].src}`} onClick={onZoom} />
        {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
      </>
    );
  }

  if (images.length === 2) {
    return (
      <>
        <div>
          <img src={`http://localhost:3065/${images[0].src}`} width="50%" onClick={onZoom} />
          <img src={`http://localhost:3065/${images[1].src}`} width="50%" onClick={onZoom} />
        </div>
        {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
      </>
    );
  }

  return (
    <>
      <div>
        <img src={`http://localhost:3065/${images[0].src}`} width="50%" onClick={onZoom} />
        <div style={{ display: 'inline-block', width: '50%', textAlign: 'center', verticalAlign: 'middle' }} onClick={onZoom}>
          <Icon type="plus"/>
          <br/>
          {images.length - 1}
          개의 사진 더보기
        </div>
      </div>
      {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
    </>
  );
};

PostImages.propTypes = {
  images: PropTypes.arrayOf(PropTypes.shape({
    src: PropTypes.string,
  })).isRequired,
};

export default PostImages;

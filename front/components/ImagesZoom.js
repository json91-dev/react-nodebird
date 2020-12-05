import PropTypes from 'prop-types';
import Slick from 'react-slick';
import { useState } from 'react';
import { Icon } from 'antd';

const ImagesZoom = ({ images, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div style={{ position: 'fixed', zIndex: 5000, top: 0, left: 0, right: 0, bottom: 0 }}>
      <header style={{ height: 44, background: 'white', position: 'relative', padding: 0, textAlign: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '17px', color: '#333', lineHeight: '44px' }}>상세 이미지</h1>
        <Icon type="close" onClick={onClose} style={{ position: 'absolute', right: 0, top: 0, padding: 15, lineHeight: '14px', cursor: 'pointer' }}></Icon>
      </header>
      <div style={{ height: 'calc(100% - 44px)', background: '#090909' }}>
        <div style={{paddingTop: '100px'}}>
          <Slick
            initialSlide={0} // 맨처음에 로딩할 슬라이드 번호
            afterChange={slide => setCurrentSlide(slide)} // slide 변화 이후
            infinite={false} // 무한 슬라이드
            arrows // 화살표 표시
            slidesToShow={1} // 한번에 보여줄 슬라이드 갯수
            slidesToScroll={1} // 한번에 넘길 슬라이드 갯수
          >
            {images.map((v) => {
              return (
                <div>
                  <img src={`http://localhost:3065/${v.src}`} style={{ margin: '0 auto', maxHeight: 750 }}/>
                </div>
              );
            })}
          </Slick>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 75, height: 30, lineHeight: '30px', borderRadius: 15, background: '#313131', display: 'inline-block', textAlign: 'center', color: 'white', fontSize: '15px' }}>{currentSlide + 1} / {images.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

ImagesZoom.propTypes = {
  images: PropTypes.arrayOf(PropTypes.shape({
    src: PropTypes.string,
  })).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ImagesZoom;

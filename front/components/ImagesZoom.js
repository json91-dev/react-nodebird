import PropTypes from 'prop-types';
import Slick from 'react-slick';
import { useState } from 'react';
import { Icon } from 'antd';
import styled from 'styled-components';
import { backUrl } from "../config/config";

const Overlay = styled.div`
  position: fixed;
  z-index: 5000;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const Header = styled.header`
  height: 44px;
  background: white;
  position: relative;
  padding: 0;
  text-align: center;
  
  & > h1 {
    margin: 0;
    font-size: 17px;
    color: #333;
    line-height: 44px 
  }
`;

const SlickWrapper = styled.div`
  height: calc(100% - 44px);
  background: #090909
`;

const CloseBtn = styled(Icon)` // Antd 디자인을 CSS 덮어 씌워서 사용
  position: absolute;
  right: 0;
  top: 0;
  padding: 15px;
  line-height: 14px;
  cursor: pointer
`;

const Indicator = styled.div`
  textAlign: center; 

  & > div {
    width: 75px;
    height: 30px;
    line-height: 30px;
    border-radius: 15px;
    background: #313131;
    display: inline-block;
    text-align: center;
    color: white;
    font-size: 15px
  }
`;

const ImgWrapper = styled.div`
  padding: 32px;
  text-align: center;
  
  & > img {
    margin: 0 auto;
    maxHeight: 750
  }
`;

const ImagesZoom = ({ images, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <Overlay>
      <Header>
        <h1>상세 이미지</h1>
        <CloseBtn type="close" onClick={onClose} />
      </Header>
      <SlickWrapper>
        <div >
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
                <ImgWrapper>
                  <img src={`${backUrl}/${v.src}`} />
                </ImgWrapper>
              );
            })}
          </Slick>
          <Indicator>
            <div>
              {currentSlide + 1} / {images.length}
            </div>
          </Indicator>
        </div>
      </SlickWrapper>
    </Overlay>
  );
};

ImagesZoom.propTypes = {
  images: PropTypes.arrayOf(PropTypes.shape({
    src: PropTypes.string,
  })).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ImagesZoom;

import { Button, Form, Input } from 'antd';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ADD_POST_REQUEST, REMOVE_IMAGE, UPLOAD_IMAGES_REQUEST } from '../reducers/post';

const PostForm = () => {
  const dispatch = useDispatch();
  const [text, setText] = useState('');
  const { imagePaths, isAddingPost, postAdded } = useSelector(state => state.post);
  const imageInput = useRef();

  useEffect(() => {
    setText('');
  }, [postAdded === true]);

  // props로 들어가는 함수는 useCallback사용
  const onSubmit = useCallback((e) => {
    // Form은 무조건 preventDefault를 붙여준다.
    e.preventDefault();
    if (!text || !text.trim()) {
      return alert('게시글을 작성하세요.');
    }
    const formData = new FormData();
    imagePaths.forEach((i) => {
      formData.append('image', i); // req.body.image에 이미지경로 저장 => 파일이었다면 req.files.images로 저
    });
    formData.append('content', text); // req.body.content에 텍스트 파일 저
    dispatch({
      type: ADD_POST_REQUEST,
      data: {
        content: text,
      },
    });
  }, [text, imagePaths]); // useCallback안에서 state쓸때 무조건 []배열 안에 넣기.

  const onChangeText = useCallback((e) => {
    setText(e.target.value);
  }, []);

  const onChangeImages = useCallback((e) => {
    console.log(e.target.files);
    const imageFormData = new FormData();
    [].forEach.call(e.target.files, (f) => { // e.target.files가 유사배열이기 때문에 배열의 foreach를 사용
      imageFormData.append('images', f);
    });
    dispatch({
      type: UPLOAD_IMAGES_REQUEST,
      data: imageFormData,
    });
  }, []);

  // 클릭했을때 이미지 인풋창이 열리도록 구현
  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  const onRemoveImage = useCallback((index) => () => {
    dispatch({
      type: REMOVE_IMAGE,
      index,
    });
  });

  return (
    <Form style={{ margin: '10px 0 20px' }} encType="multipart/form-data" onSubmit={onSubmit}>
      <Input.TextArea maxLength={140} placeholder="어떤 신기한 일이 있었나요" value={text} onChange={onChangeText} />
      <div>
        <input type="file" multiple hidden ref={imageInput} onChange={onChangeImages} />
        <Button onClick={onClickImageUpload}>이미지 업로드</Button>
        <Button type="primary" style={{ float: 'right' }} htmlType="submit" loading={isAddingPost}>짹짹</Button>
      </div>
      <div>
        {imagePaths.map((v, i) => (
          <div key={v} style={{ display: 'inline-block' }}>
            <img src={`http://localhost:3065/${v}`} style={{ width: '200px' }} alt={v} />
            <div>
              <Button onClick={onRemoveImage(i)}>제거</Button>
            </div>
          </div>
        ))}
      </div>
    </Form>
  );
};

export default PostForm;

import { Button, Form, Input } from "antd";
import React from "react";

// 타밍라인과 같은 역활을 함
const dummy = {
  isLoggedIn: true,
  imagePaths: [],
  mainPosts: [{
    User: {
      id: 1,
      nickname: '제로초',
    },
    content: '첫 번째 게시글',
    img : 'https://cdn.crowdpic.net/list-thumb/thumb_l_C033BE71DECD4E2B703A91F4FD6D59CD.jpg',
  }],
};

const PostForm = () => {

  return (
    <Form style={{ margin: '10px 0 20px'}} encType="multipart/form-data">
      <Input.TextArea maxLength={140} placeholder="어떤 신기한 일이 있었나요" />
      <div>
        <Button>이미지 업로드</Button>
        <Button type="primary" style={{ float: 'right' }} htmlType="submit">짹짹</Button>
      </div>
      <div>
        {dummy.imagePaths.map((v, i) => {
          return (
            <div key={v} style={{display: 'inline-block'}}>
              <img src={'http://localhost:3065/' + v} style={{ width: '200px' }} alt={v} />
              <div>
                <Button>제거</Button>
              </div>
            </div>
          )
        })}
      </div>
    </Form>
  )
};

export default PostForm;

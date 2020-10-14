const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const db = require('./models');
const userAPIRouter = require('./routes/user');
const postAPIRouter = require('./routes/post');
const postsAPIRouter = require('./routes/posts');

const app = express();
db.sequelize.sync(); // 테이블을 알아서 생성해 줌

// 요청이 들어왔을때 요청을 찍어주는 기능을 할 수 있게된다.
app.use(morgan('dev'));
// 아래 두줄이 있을때 req.body를 사용할 수 있게 된다.
app.use(express.json()); // JSON 형식의 본문을 처리한다.
app.use(express.urlencoded({ extended: true })); // Form으로 넘어온 데이터를 처리한다.
app.use(cors()); // cors 문제 처리

app.use('/api/user', userAPIRouter);
app.use('/api/post', postAPIRouter);
app.use('/api/posts', postsAPIRouter);

// 로컬 호스트의 서버 실행
app.listen(3065, () => {
  console.log('server is running on localhost: 3065');
});

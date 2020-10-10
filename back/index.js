const express =  require('express');

const db = require('./models');
const userAPIRouter = require('./routes/user');
const postAPIRouter = require('./routes/post');
const postsAPIRouter = require('./routes/posts');

const app = express();
db.sequelize.sync(); // 테이블을 알아서 생성해 줌

app.use('/api/user', userAPIRouter);
app.use('/api/post', postAPIRouter);
app.use('/api/posts', postsAPIRouter);

// 로컬 호스트의 서버 실행
app.listen(3065, () => {
  console.log('server is running on localhost: 8080');
});

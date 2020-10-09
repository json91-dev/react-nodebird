const express =  require('express');

const db = require('./models');

const app = express();
db.sequelize.sync(); // 테이블을 알아서 생성해 줌

app.get('/', (req, res) => {
  res.send('Hello Server');
});

// 로컬 호스트의 서
app.listen(3065, () => {
  console.log('server is running on localhost: 8080');
});

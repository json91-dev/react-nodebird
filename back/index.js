const express =  require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello Server');
});

// 로컬 호스트의 서
app.listen(3065, () => {
  console.log('server is running on localhost: 8080')
});

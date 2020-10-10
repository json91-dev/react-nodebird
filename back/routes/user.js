const express = require('express');
const router = express.Router();

// API는 다른 서비스가 내 서비스의 기능을 실행 할 수 있게 열어둔 창구
// router.post('/api/user', (req, res) => { => /api/user 부분을 /로 대체
router.post('/', (req, res) => { // /api/user/

});

router.post('/', (req, res) => {

});

// :id는 req.params.id로 가져올 수 있다.
// 남의 정보 가져오는 것 ex) /api/user/3 => 아이디가 3인 유저정보를 get
router.get('/:id', (req, res) => {

});

router.post('/logout', (req, res) => { // /api/user/logout

});

router.post('/login', (req, res) => {

});

router.get('/:id/follow', (req, res) => { // /api/user/:id/follow

});

router.post('/:id/follow', (req, res) => {

});

router.delete('/:id/follow', (req, res) => {

});

router.delete('/:id/follower', (req, res) => {

});

router.get('/:id/posts', (req, res) => {

});

module.exports = Router;

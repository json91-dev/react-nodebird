const express = require('express');
const multer = require('multer');
const path = require('path');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');

const db = require('../models');
const { isLoggedIn } = require('./middleware');

const router = express.Router();

AWS.config.update({
  region: 'ap-northeast-2', // 서울 리전,
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});

const upload = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: 'react-nodebird-json91',
    key(req, file, cb) {
      cb(null, `original/${+new Date()}${path.basename(file.originalname)}`); // timestamp + 파일이름
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 },
});

router.post('/', isLoggedIn, upload.none(), async (req, res, next) => { // POST /api/post
  try {
    const hashtags = req.body.content.match(/#[^\s]+/g);
    const newPost = await db.Post.create({
      content: req.body.content, // ex) '제로초 파이팅 #구독 #좋아요 눌러주세요'
      UserId: req.user.id,
    });

    if (hashtags) {
      const result = await Promise.all(hashtags.map(tag => db.Hashtag.findOrCreate({
        where: { name: tag.slice(1).toLowerCase() }, // #떼고 영어는 대문자에서 소문자
      })));

      console.log(result);
      await newPost.addHashtags(result.map(r => r[0]));
    }

    // 이미지 주소를 따로 DB에 저장한 뒤 게시글과 연결합니다.
    if (req.body.image) { // 이미지 주소를 여러개 올리면 image: [주소1, 주소2]
      if (Array.isArray(req.body.image)) {
        const images = await Promise.all(req.body.image.map(v => {
          return db.Image.create({ src: v });
        }));
        await newPost.addImages(images);
      } else { // 이미지를 하나만 올리면 image: 주소1
        const image = await db.Image.create({ src: req.body.image });
        await newPost.addImage(image);
      }
    }

    // const User = await newPost.getUser();
    // newPost.user = User;
    // res.json(newPost);
    const fullPost = await db.Post.findOne({
      where: { id: newPost.id },
      include: [{
        model: db.User,
      }, {
        model: db.Image,
      }],
    });

    res.json(fullPost);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post('/images', upload.array('images'), (req, res) => { // 프론트에서 FormData로 보내주는 이름이 일치하여야함.
  console.log(req.files);
  res.json(req.files.map(v => v.location)); // v에 이미지 업로드 결과에 대한 데이터들이 담겨있다.
});

router.get('/:id', async (req, res, next) => {
  try {
    const post = await db.Post.findOne({
      where: { id: req.params.id },
      include: [{
        model: db.User,
        attributes: ['id', 'nickname'],
      }, {
        model: db.Image,
      }],
    });
    res.json(post);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.delete('/:id', isLoggedIn, async (req, res, next) => {
  try {
    const post = await db.Post.findOne({ where: { id: req.params.id } });
    if (!post) {
      return res.status(404).send('포스트가 존재하지 않습니다.');
    }
    await db.Post.destroy({ where: { id: req.params.id }});
    res.send(req.params.id);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.get('/:id/comments', async (req, res, next) => {
  try {
    const post = await db.Post.findOne({ where: { id: req.params.id } });
    if (!post) {
      return res.status(404).send('포스트가 존재하지 않습니다.');
    }
    const comments = await db.Comment.findAll({
      where: {
        PostId: req.params.id,
      },
      order: [['createdAt', 'ASC']],
      include: [{
        model: db.User,
        attributes: ['id', 'nickname'],
      }],
    });
    return res.json(comments);
  } catch (e) {
    console.error(e);
    return next(e);
  }
});

router.post('/:id/comment', isLoggedIn, async (req, res, next) => { // POST /api/post/3/comment
  try {
    const post = await db.Post.findOne({ where: { id: req.params.id } });
    if (!post) {
      return res.status(404).send('포스트가 존재하지 않습니다.');
    }
    const newComment = await db.Comment.create({
      PostId: post.id,
      UserId: req.user.id,
      content: req.body.content,
    });
    await post.addComment(newComment.id);

    // 완성된 게시글 조회하여 프론트로 보내줌
    const comment = await db.Comment.findOne({
      where: {
        id: newComment.id,
      },
      include: [{
        model: db.User, // 댓글 작성자 정보 넣기
        attributes: ['id', 'nickname'],
      }],
    });

    return res.json(comment); // 코드가 중간에서 끊어지지 않았다는것을 확인하기 위해 return을 써준다.
  } catch (e) {
    console.error(e);
    return next(e);
  }
});

router.post('/:id/like', isLoggedIn, async (req, res, next) => {
  try {
    const post = await db.Post.findOne({ where: { id: req.params.id }});
    if (!post) {
      return res.status(404).send('포스트가 존재하지 않습니다.');
    }
    await post.addLiker(req.user.id);
    res.json({ userId: req.user.id });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.delete('/:id/like', isLoggedIn, async (req, res, next) => {
  try {
    const post = await db.Post.findOne({ where: { id: req.params.id }});
    if (!post) {
      return res.status(404).send('포스트가 존재하지 않습니다.');
    }
    await post.removeLiker(req.user.id);
    res.json({ userId: req.user.id });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post('/:id/retweet', isLoggedIn, async (req, res, next) => {
  try {
    const post = await db.Post.findOne({
      where: { id: req.params.id },
      include: [{
        model: db.Post,
        as: 'Retweet',
      }],
    });
    if (!post) {
      return res.status(404).send('포스트가 존재하지 않습니다.');
    }
    if ((req.user.id === post.UserId) || (post.Retweet && post.Retweet.UserId === req.user.id)) {
      return res.status(403).send('자신의 글은 리트윗할 수 없습니다.');
    }
    const retweetTargetId = post.RetweetId || post.id; // 리트윗한 게시글을 다시 리트윗할때 => 원본게시글 또는 반복 리트윗
    const exPost = await db.Post.findOne({ // 이미 리트윗을 한 경우 체크
      where: {
        UserId: req.user.id,
        RetweetId: retweetTargetId,
      },
    });

    if (exPost) {
      return res.status(403).send('이미 리트윗했습니다.');
    }

    const retweet = await db.Post.create({
      UserId: req.user.id,
      RetweetId: retweetTargetId,
      content: 'retweet',
    });

    const retweetWidthPrevPost = await db.Post.findOne({ // 리트윗게시글은 항상 이전 게시글이 들어있어야 함.
      where: { id: retweet.id },
      include: [{
        model: db.User,
        attributes: ['id', 'nickname'],
      }, {
        model: db.Post, // 리트윗할 게시물에 대한 Post (이전 게시글)
        as: 'Retweet',
        include: [{
          model: db.User,
          attributes: ['id', 'nickname'],
        }, {
          model: db.Image,
        }],
      }],
    });

    res.json(retweetWidthPrevPost);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;

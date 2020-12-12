const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../models');
const { isLoggedIn } = require('./middleware');
const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({ // 서버쪽 하드디스크나, SSD에 저장하는 옵션, S3나 구글 클라우드 스토리지로 바꿀수도 있음 (배포때 s3)
    destination(req, file, done) { // 어떤 폴더에 저장할지 정해줌
      done(null, 'uploads'); // uploads 폴더로 저장
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname); // path모듈로 확장자를 추출해낸다.ex)제로초.png, ext===.png, basename===제로초
      const basename = path.basename(file.originalname, ext); // 확장자가 아닌 파일 이름을 추출해낸다.
      done(null, basename + new Date().valueOf() + ext); // 기존 파일이 덮어써지는것을 방지하기 위해 Date를 붙인다.
    },
    limits: { fileSize: 20 * 1024 * 1024 }, // 업로드 가능 용량을 20MB로 용량을 제한.너무 많은 용량 할당시 해커의 공격대상이 될 수도 있다.
  }),
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
  res.json(req.files.map(v => v.filename)); // v에 이미지 업로드 결과에 대한 데이터들이 담겨있다.
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

module.exports = router;

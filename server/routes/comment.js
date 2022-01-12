const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");

//=================================
//             Comments
//=================================

router.post("/saveComment", (req, res) => {
  const comment = new Comment(req.body);
  //클라이언트에서 불러온 정보를 모두 넣어줌

  comment.save((err, comment) => {
 //모든 정보들을 몽고db에 저장해준다 save
    if (err) return res.json({ success: false, err });

    Comment.find({ _id: comment._id }) //저장 후 id를 이용하여 바로 해당 witer정보를 찾는다.
      .populate("writer") // save 를 썻을때는 populate를 쓸수가 없기 때문에 모델(Comment)를 가져온다음 find 찾는다
      .exec((err, result) => { //쿼리를 돌린다
        if (err) return res.json({ success: false, err });
        res.status(200).json({ success: true, result });
      });
  });
});


router.post("/getComments", (req, res) => {
  Comment.find({ postId: req.body.videoId })
    .populate("writer")
    .exec((err, comments) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, comments });
    });
});

module.exports = router;
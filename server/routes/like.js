const express = require("express");
const router = express.Router();
const Like = require("../models/Like");
const Dislike = require("../models/Dislike");

//=================================
//             like
//=================================

router.post("/getlikes", (req, res) => {

  let variable = {};
  console.log(req.body);

  if (req.body.videoId) {
    variable = { videoId: req.body.videoId };
    //비디오 좋아요
  }
  else if (req.body.nftId) {
    variable = { nftId: req.body.nftId };
    //nft 좋아요
  }
  else {
    variable = { commentId: req.body.commentId };
    //댓글 좋아요
  }

  Like.find(variable).exec((err, likes) => {
    if (err) return res.status(400).send(err);
    // console.log('likes', likes)
    res.status(200).json({ success: true, likes });
  });
});

router.post("/getDislikes", (req, res) => {

    let variable = {};
    if (req.body.videoId) {
      variable = { videoId: req.body.videoId };
    } else {
      variable = { commentId: req.body.commentId };
    }
  
    Dislike.find(variable).exec((err, dislikes) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, dislikes });
    });
  });

  router.post("/upLike", (req, res) => {
    let variable = {};
    console.log(req.body);

    if (req.body.videoId) {
      variable = { videoId: req.body.videoId, userId: req.body.userId };
    }
    else if (req.body.nftId) {
      variable = { nftId: req.body.nftId, userId: req.body.userId };
    }
    else {
      variable = { commentId: req.body.commentId, userId: req.body.userId };
    }


    // if (req.body.nftId) {
    //   variable = { nftId: req.body.nftId, userId: req.body.userId };
    // }
    // Like collection에다가 클릭 정보를 넣기

    const like = new Like(variable);
    console.log('like', like);
    like.save((err, likeResult) => {
      if (err) return res.json({ success: false, err });
  
      //만약 Dislike이 이미 클릭이 되어있다면, Dislike을 1 줄여준다.
      Dislike.findOneAndDelete(variable).exec((err, disLikeResult) => {
        if (err) return res.status(400).json({ success: false, err });
        res.status(200).json({ success: true });
      });
    });
  });
  
  router.post("/unLike", (req, res) => {
    let variable = {};
    if (req.body.videoId) {
      variable = { videoId: req.body.videoId, userId: req.body.userId };
    } 
    else if (req.body.nftId) {
      variable = { nftId: req.body.nftId, userId: req.body.userId };
    }
    else {
      variable = { commentId: req.body.commentId, userId: req.body.userId };
    }

    Like.findOneAndDelete(variable).exec((err, result) => {
      if (err) return res.status(400).json({ success: false, err });
      res.status(200).json({ success: true });
    });
  });
  
  router.post("/unDislike", (req, res) => {
    let variable = {};
    if (req.body.videoId) {
      variable = { videoId: req.body.videoId, userId: req.body.userId };
    } else {
      variable = { commentId: req.body.commentId, userId: req.body.userId };
    }
  
    Dislike.findOneAndDelete(variable).exec((err, result) => {
      if (err) return res.status(400).json({ success: false, err });
      res.status(200).json({ success: true });
    });
  });
  
  router.post("/upDislike", (req, res) => {
    let variable = {};
    if (req.body.videoId) {
      variable = { videoId: req.body.videoId, userId: req.body.userId };
    } else {
      variable = { commentId: req.body.commentId, userId: req.body.userId };
    }
    // DisLike collection에다가 클릭 정보를 넣기
    const dislike = new Dislike(variable);
    dislike.save((err, dislikeResult) => {
      if (err) return res.json({ success: false, err });
  
      //만약 like이 이미 클릭이 되어있다면, like을 1 줄여준다.
      Like.findOneAndDelete(variable).exec((err, LikeResult) => {
        if (err) return res.status(400).json({ success: false, err });
        res.status(200).json({ success: true });
      });
    });
  });

module.exports = router;
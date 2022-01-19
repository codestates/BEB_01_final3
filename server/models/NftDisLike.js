const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const nftdislikeSchema = mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    nftId: {
      type: Schema.Types.ObjectId,
      ref: "Nft",
    },
  },
  { timestamps: true }
);
const DisNftLike = mongoose.model("DisNftLike", nftdislikeSchema); //1st모델의이름,2nd데이터

module.exports = DisNftLike; //다른파일에서사용가능


//좋아요를 누르는 유저 Id
//유저가 좋아요를 누를 수 있는 아이템 ( 댓글, 비디오 )
//를 스키마로 형성
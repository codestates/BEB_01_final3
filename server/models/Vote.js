const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vote = mongoose.Schema(
  {
    voter: {
      type: Schema.Types.ObjectId, //이런식으로 설정하면 User모델에있는 모든 데이터들을 불러올 수있다.
      ref: "User", //User모델에서 불러오기위해
    },
    userAddress: {
      type: String,
    },
    contentName: {
      type: String,
    },
    contentNum: {
      type: Number,
    },
    serialNo: {
      type: Number,
    },
    select: {
      type: String,
      default: 0
    },
    amount: {
      type: Number,
    },
      
  },
  { timestamps: true } //만든 날짜와 update시 날짜가 표시가 된다.
);
const Vote = mongoose.model("Vote", vote); //1st모델의이름,2nd데이터

module.exports = {Vote}; //다른파일에서사용가능
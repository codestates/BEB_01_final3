const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vote = mongoose.Schema(
  {
    userId: {
      type: String,
    },
    userAddress: {
      type: String,
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
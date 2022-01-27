const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const battingSchema = mongoose.Schema(
  {
    videoId : {
      type: String,
    },
    contentsName: {
      type: String,
    },
    contentsNum: {
      type: Number,
    },
    subTitle: {
      type: String,
    },
    serial: {
      type: Number,
      default: 0
    },
    status: {
      type: Boolean,
      default: true
    },
      
  },
  { timestamps: true } //만든 날짜와 update시 날짜가 표시가 된다.
);
const Batting = mongoose.model("Batting", battingSchema); //1st모델의이름,2nd데이터

module.exports = {Batting}; //다른파일에서사용가능
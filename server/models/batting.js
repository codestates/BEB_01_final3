const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const battingSchema = mongoose.Schema(
  {
   
    contentsName: {
      type: String,
      unique: 1,
    },
      
  },
  { timestamps: true } //만든 날짜와 update시 날짜가 표시가 된다.
);
const Batting = mongoose.model("Batting", battingSchema); //1st모델의이름,2nd데이터

module.exports = {Batting}; //다른파일에서사용가능
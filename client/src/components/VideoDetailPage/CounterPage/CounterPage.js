import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { useCallback } from "react";
import { useParams } from "react-router-dom";
import { Form, Row, Col } from "react-bootstrap";
import { Button, Card } from "react-bootstrap";
// const { Meta } = Card;

function CounterPage() {
  const videoId = useParams().videoId;
  const variable = { videoId: videoId };
  const [VideoDetail, setVideoDetail] = useState([]);
  const [Survival, setSurvival] = useState([]);

  useEffect(async () => {
    await axios.post("/api/video/getVideoDetail", variable).then((response) => {
      if (response.data.success) {
        console.log("getvideodata", response.data);
        console.log('Img', response.data.videoDetail.image)
        const image = response.data.videoDetail.image
        setVideoDetail(response.data.videoDetail);
        const Member = response.data.videoDetail.survival[0].split(", ");
        const NameImg = [];
        for(let i=0; i<Member.length; i++){
          NameImg.push({name:Member[i],img : image[i]})
        }
        console.log(NameImg);
        setSurvival(NameImg);
      } else {
        alert("비디오 정보를 가져오길 실패했습니다.");
      }
    });
  }, []);

  
  // console.log("s", Survival);
  // console.log("img",response.data.videoDetail.image)
  //랜더링 되자 마자 videoData 를 제일 먼저 호출해버림 = undefined
  //console.log('videoData', VideoDetail.survival) => 아직 useEffect가 호출되지 않은상태이고
  //따라서 그 값을 불러오지 못함
  //그래서 useEffect 안에서 함수처리를 다해주고
  //함수를 useState로 감싸서 들고 나온다.

  const countDownTimer = useCallback((date) => {
    let _vDate = moment(date);
    let _second = 1000;
    let _minute = _second * 60;
    let _hour = _minute * 60;
    let _day = _hour * 24;
    let timer;

    function showRemaining() {
      try {
        let now = moment();
        let distDt = _vDate - now;

        if (distDt < 0) {
          clearInterval(timer);
          let HapDate = "0" + "d " + "0" + "h " + "0" + "m " + "0" + "s";
          document.getElementById("timer").innerHTML = HapDate;
          return;
        }
        let days = Math.floor(distDt / _day);
        let hours = Math.floor((distDt % _day) / _hour);
        let minutes = Math.floor((distDt % _hour) / _minute);
        let seconds = Math.floor((distDt % _minute) / _second);

        let HapDate =
          parseInt(days) +
          "d " +
          parseInt(hours) +
          "h " +
          parseInt(minutes) +
          "m " +
          parseInt(seconds) +
          "s";
        document.getElementById("timer").innerHTML = HapDate;
      } catch (e) {
        console.log(e);
      }
    }
    timer = setInterval(showRemaining, 1000);
  }, []);
  
  const renderCard = Survival.map((survival, index) => {
    return (
      <Card style={{ width: "20rem", margin: "1%", cursor: "pointer"}}>
        <div>
          <Card.Img size={100} src={`http://localhost:5000/${survival.img}`} alt style={{ margin: "10px" }} />
        </div>
        <Card.Body style={{ marginRight: "1%" }}>
          <Card.Title>생존자 후보</Card.Title>
          <hr />
          <Card.Text>{survival.name}</Card.Text>
          <Button variant="danger" size="md" className="me-1" onClick>
            투표
          </Button>
        </Card.Body>
      </Card>
    );
  });

  // setTimeout(`location.href='/video/${videoId}/'`,1000);  

  return (
    <div>
      <Row gutter={16} 
      style={{ display: "flex", justifyContent: "center"}}>{renderCard}</Row>
      <div>
        <span id="timer">{countDownTimer(VideoDetail.opendate)}</span>
      </div>
    </div>
  );
}

export default CounterPage;

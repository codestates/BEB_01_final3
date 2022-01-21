import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import moment from "moment";
import { useCallback } from "react";
import { useParams } from "react-router-dom";
import { Form, Row, Col } from "react-bootstrap";
import { Button, Card } from "react-bootstrap";
// const { Meta } = Card;
// import Moment from 'react-moment';
// import 'moment-timezone';

function CounterPage() {
  const videoId = useParams().videoId;
  const variable = { videoId: videoId };
  const [VideoDetail, setVideoDetail] = useState([]);
  const [Survival, setSurvival] = useState([]);
  // const [complete, setComplete] = useState(false);

  useEffect(() => {
    async function getVideo() {
      await axios
        .post("/api/video/getVideoDetail", variable)
        .then((response) => {
          if (response.data.success) {
            console.log("getvideodata", response.data);
            console.log("Img", response.data.videoDetail.image);
            const image = response.data.videoDetail.image;
            setVideoDetail(response.data.videoDetail);
            const Member = response.data.videoDetail.survival[0].split(", ");
            const NameImg = [];
            for (let i = 0; i < Member.length; i++) {
              NameImg.push({ name: Member[i], img: image[i] });
            }
            console.log(NameImg);
            setSurvival(NameImg);
          } else {
            alert("비디오 정보를 가져오길 실패했습니다.");
          }
        });
    }
    getVideo();
  }, []);

  // console.log('s', Survival);
  // console.log("img",response.data.videoDetail.image)
  //랜더링 되자 마자 videoData 를 제일 먼저 호출해버림 = undefined
  //console.log('videoData', VideoDetail.survival) => 아직 useEffect가 호출되지 않은상태이고
  //따라서 그 값을 불러오지 못함
  //그래서 useEffect 안에서 함수처리를 다해주고
  //함수를 useState로 감싸서 들고 나온다.

  const countDownTimer = useCallback((date) => {
    // data : 영화 시작 날짜, 시간
    // 현재시각(서버) 이랑 비디오 정보의 시작시간 비교 코드

    let timer;
    let _vDate = moment(date);
    // let _vDate = new Date(date).getTime();
    let _second = 1000;
    let _minute = _second * 60;
    let _hour = _minute * 60;
    let _day = _hour * 24;

    function showRemaining() {
      try {
        if (date !== undefined) {
          let now = moment();
          // let now = new Date().getTime();
          let distDt = _vDate - now;
          if (distDt < 0) {
            clearInterval(timer);
            let HapDate =
              "0" + "일 " + "0" + "시간 " + "0" + "분 " + "0" + "초 가 남음";
            document.getElementById("timer").innerHTML = HapDate;
            window.location.replace(`/video/${videoId}`); //video/${videoId}
            return;
          } else {
            // setComplete(true);
            let days = Math.floor(distDt / _day);
            let hours = Math.floor((distDt % _day) / _hour);
            let minutes = Math.floor((distDt % _hour) / _minute);
            let seconds = Math.floor((distDt % _minute) / _second);
            let HapDate =
              parseInt(days) +
              "일 " +
              parseInt(hours) +
              "시간 " +
              parseInt(minutes) +
              "분 " +
              parseInt(seconds) +
              "초 가 남음";
            document.getElementById("timer").innerHTML = HapDate;
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
    timer = setInterval(showRemaining, 1000);
  }, []);

  const renderCard = Survival.map((survival, index) => {
    return (
      <Card style={{ width: "20rem", margin: "1%", cursor: "pointer" }}>
        <div>
          <Card.Img
            size={150}
            src={`http://localhost:5000/${survival.img}`}
            alt
            style={{ margin: "10px" }}
          />
        </div>
        <Card.Body style={{ marginRight: "1%" }}>
          <Card.Title>생존자 후보</Card.Title>
          <hr />
          <Card.Text>{survival.name}</Card.Text>
         
			
            <input
              type="text"
              size="8"
              style={{ border: "none", borderBottom: "1px solid" }}
              onChange
              placeholder="WT 갯수"
			//   style={{justifyContent: 'flex-start', alignItems: 'flex-start'}}
            ></input>

            <Button variant="danger" size="md" className="me-1" onClick style={{justifyContent: 'flex-end', alignItems: 'flex-end'}}>
              투표
            </Button>
          
        </Card.Body>
      </Card>
    );
  });

  return (
    <div>
      <div>
        <span id="timer" style={{ fontSize: "20px" }}>
          {countDownTimer(VideoDetail.opendate)}
        </span>
      </div>
      <Row gutter={16} style={{ display: "flex", justifyContent: "center" }}>
        {renderCard}
      </Row>
    </div>
  );
}

export default CounterPage;

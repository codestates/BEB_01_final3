import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment'
import { useCallback } from 'react';
import { useParams } from "react-router-dom";
import { Form, Row, Col} from 'react-bootstrap';


function CounterPage() {
  const videoId = useParams().videoId;
  const variable = { videoId: videoId };
  const [VideoDetail, setVideoDetail] = useState([]);
  const [Survival, setSurvival] = useState("");

  useEffect(async () => {
    await axios.post("/api/video/getVideoDetail", variable).then((response) => {
      if (response.data.success) {
        console.log("getvideodata", response.data);
        setVideoDetail(response.data.videoDetail);
        const Member = response.data.videoDetail.survival[0].split(", ");
        setSurvival(Member);
      } else {
        alert("비디오 정보를 가져오길 실패했습니다.");
      }
    });
  }, []);

  console.log("s1", Survival[0]);
  console.log("s", Survival);
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

  return (
    <div>
      <fieldset>
        <Form.Group as={Row} className="mb-3">
          <Form.Label as="legend" column sm={2}>
            투표
          </Form.Label>
          <Col sm={10}>
            <Form.Check
              type="radio"
              label="first radio"
              name="formHorizontalRadios"
              id="formHorizontalRadios1"
            />
            <Form.Check
              type="radio"
              label="second radio"
              name="formHorizontalRadios"
              id="formHorizontalRadios2"
            />
            <Form.Check
              type="radio"
              label="third radio"
              name="formHorizontalRadios"
              id="formHorizontalRadios3"
            />
          </Col>
        </Form.Group>
      </fieldset>
      <div>
        <span id="timer">{countDownTimer(VideoDetail.opendate)}</span>
      </div>
    </div>
  );
}

export default CounterPage;

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import moment from "moment";
import { useCallback } from "react";
import { useParams } from "react-router-dom";
import { Form, Row, Col } from "react-bootstrap";
import { Button, Card } from "react-bootstrap";
// const { Meta } = Card;
import Moment from "react-moment";
import "moment-timezone";
import "../style.css";
import Modals from "./Modals";
import ImgModals from "./ImgModals";

function CounterPage() {
  const videoId = useParams().videoId;
  const variable = { videoId: videoId };
  const [VideoDetail, setVideoDetail] = useState([]);
  const [Survival, setSurvival] = useState([]);
  const [complete, setComplete] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [imgModalShow, setImgModalShow] = useState(false);
  const [survivalImgShow, setSurvivalImgShow] = useState("");

  const showImg = (e) => {
    setSurvivalImgShow(e.target.src);
    console.log(e.target.src);
    setTimeout(() => {
      setImgModalShow(true);
    }, 1000);
  };

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
              // '0' + 'd ' +
              "0" + "h " + "0" + "m " + "0" + "s ";
            document.getElementById("timer").innerHTML = HapDate;
            window.location.replace(`/video/${videoId}`); //video/${videoId}
            return;
          } else {
            setComplete(true);
            let days = Math.floor(distDt / _day);
            let hours = Math.floor((distDt % _day) / _hour);
            let minutes = Math.floor((distDt % _hour) / _minute);
            let seconds = Math.floor((distDt % _minute) / _second);
            let HapDate =
              // parseInt(days) +
              // 'd ' +
              parseInt(hours) +
              " : " +
              parseInt(minutes) +
              " : " +
              parseInt(seconds) +
              " ";
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
      <Card
        style={{
          width: "15rem",
          margin: "1%",
          // cursor: 'pointer',
          height: "21rem",
        }}
      >
        {/* <div onClick={(e) => showImg}> */}
        <a style={{ cursor: "pointer" }} onClick={showImg}>
          <Card.Img
            // height: {'20vh'},
            // width: {"20vw"},
            size={150}
            src={`http://localhost:5000/${survival.img}`}
            alt
            style={{
              margin: "10px",
              width: "15vw",
              height: "15.5vh",
              justifyContent: "center",
              // cursor: 'pointer',
            }}
          />
        </a>
        <Card.Body style={{ marginRight: "1%" }}>
          <Card.Title>생존자 후보</Card.Title>
          <hr />
          <Card.Text>{survival.name}</Card.Text>
          <Button variant="danger" size="md" className="me-1" onClick>
            투표
          </Button>
          <input
            type="text"
            size="8"
            style={{ border: "none", borderBottom: "1px solid" }}
            onChange
            placeholder="WT 갯수"
            //   style={{justifyContent: 'flex-start', alignItems: 'flex-start'}}
          ></input>
        </Card.Body>
      </Card>
    );
  });

  return (
    <div className="CounterPageBody">
      <br />
      <br />
      <br />
      <br />
      <div>
        <div className="timerTitle">Count Down</div>
        <span id="timer" className="timer">
          {countDownTimer(VideoDetail.opendate)}
        </span>
      </div>
      <span
        onClick={() => {
          setModalShow(true);
        }}
      >
        <Button variant="danger" size="lg" className="mb-2">
          투표하기
        </Button>
      </span>

      {modalShow === true ? (
        <Modals
          show={modalShow}
          cards={renderCard}
          off={() => {
            setModalShow(false);
          }}
        ></Modals>
      ) : null}

      {imgModalShow === true ? (
        <ImgModals
          show={imgModalShow}
          img={survivalImgShow}
          off={() => {
            setImgModalShow(false);
          }}
        />
      ) : null}
    </div>
  );
}

export default CounterPage;

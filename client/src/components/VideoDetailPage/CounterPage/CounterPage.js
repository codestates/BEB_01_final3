import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import moment from "moment";
import { useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Row, Col } from "react-bootstrap";
import { Button, Card } from "react-bootstrap";
// const { Meta } = Card;
import Moment from "react-moment";
import "moment-timezone";
import "../style.css";
import Modals from "./Modals";
import ImgModals from "./ImgModals";
import Swal from "sweetalert2";

function CounterPage() {
  const videoId = useParams().videoId;
  const variable = { videoId: videoId };
  const [VideoDetail, setVideoDetail] = useState([]);
  const [Survival, setSurvival] = useState([]);
  const [complete, setComplete] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [imgModalShow, setImgModalShow] = useState(false);
  const [survivalImgShow, setSurvivalImgShow] = useState("");
  const [videoName, setVideoName] = useState('');
  const [amount, setAmount] = useState('');
  const [closeInfo, setCloseInfo] = useState("");
  const navigate = useNavigate();

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
            // console.log("close",response.data.close);
            console.log("getvideodata", response.data);
            console.log("Img", response.data.videoDetail.image);
            // setCloseInfo(response.data.success);
           setVideoName(response.data.videoDetail.title);
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
            // let days = Math.floor(distDt / _day);
            let hours = Math.floor(distDt  / _hour);
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


  function vote(name) {
    

    //일단 누가 누구에게 투표를 했는지 보낸다. 
    //필수정보 방이름 방번호가 필요하다. 그이
    console.log(name);
    const rawTitle = videoName;
		const title = rawTitle.slice(0, rawTitle.indexOf("]") + 1).replace(/(\s*)/g, "");
		const subTitle = rawTitle.slice(rawTitle.indexOf("]") + 1, rawTitle.indexOf("E")).replace(/(\s*)/g, "")
    const serialNo = rawTitle.slice(rawTitle.indexOf(".") + 1, rawTitle.length).replace(/(\s*)/g, "")
    
    
    axios.post('/api/bat/vote', { select: name, title, serialNo, amount })
      .then((res) => {
        if (res.data.success) {
          Swal.fire({
            icon: 'success',
            title: 'Wow.....' ,  
            text: `${name}에 ${amount}WT를 베팅했습니다.`,
            // showCancelButton: true, // cancel버튼 보이기. 기본은 원래 없음
            // confirmButtonColor: '#3085d6', // confrim 버튼 색깔 지정
            // cancelButtonColor: '#d33', // cancel 버튼 색깔 지정
            // confirmButtonText: '승인', // confirm 버튼 텍스트 지정
            // cancelButtonText: '취소', // cancel 버튼 텍스트 지정
            // reverseButtons: true, // 버튼 순서 거꾸로
          }).then((result) => {
           
            if (result.value) {
               navigate('/')
            }
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',  
            text:  res.data.detail,
            // showCancelButton: true, // cancel버튼 보이기. 기본은 원래 없음
            // confirmButtonColor: '#3085d6', // confrim 버튼 색깔 지정
            // cancelButtonColor: '#d33', // cancel 버튼 색깔 지정
            // confirmButtonText: '승인', // confirm 버튼 텍스트 지정
            // cancelButtonText: '취소', // cancel 버튼 텍스트 지정
            // reverseButtons: true, // 버튼 순서 거꾸로
          }).then((result) => {
            console.log(result);
            if (result.value) {
               navigate('/')
            }
          });
         
        
        }
      })
  }

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
           
            size={150}
            src={`http://localhost:5000/${survival.img}`}
            alt
            style={{
              display: 'flex',
              margin: "10px",
              width: "15vw",
              height: "15.5vh",
              justifyContent: "center",
              height: '15vh',
              width: "11vw",
              
              // cursor: 'pointer',
            }}
          />
        </a>
        <Card.Body style={{ marginRight: "1%" }}>
          <Card.Title>생존자 후보</Card.Title>
          <hr />
          <Card.Text>{survival.name}</Card.Text>
          <Button variant="danger" size="md" className="me-1" onClick={() => {vote(survival.name)}}>
            투표
          </Button>
          <input
            type="text"
            size="8"
            style={{ border: "none", borderBottom: "1px solid" }}
            onChange={(e) => { setAmount(e.target.value)}}
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

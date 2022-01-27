import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
// import { loginUser, auth } from "../../actions/user_action";
import { useNavigate, useParams } from "react-router-dom";
// import { Modal,Card, Button } from "react-bootstrap";
import wtImg from "./basic.png";
import { Card, Avatar, Col, Typography, Row } from "antd";
import moment from "moment";
import Subscribe from "./Subscribe";

// import { myPageCheck } from "../../actions/user_action";
import axios from "axios";
import Modals  from './Modals';
import LikeNft from './Like/LikeNft';
import LikeConTent from './Like/LikeConTent';
import MyNft from "./MyNft";
import MyConTent from "./MyConTent";



		// ******** 비디오까지 넘겼으니 이제 채널 프론트 처리하자 ********** //



const Channel = (props) => {

//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [Email, setEmail] = useState("");
//   const [Password, setPassword] = useState("");
  const [pbKey, setPbKey] = useState("");
  const [privKey, setPrivKey] = useState("");
  const [nftInfo, setNftInfo] = useState([]);
  const [videoId, setVideoInfo] = useState([]);
  // const [userInfo, setUserInfo] = useState("");
//   const [wtToken, setWtToken] = useState("");
//   const [nwtToken, setNwtToken] = useState("");
  const [isCheck, setIsCheck] = useState();
  const [sellPrice, setSellPrice] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [profile, setProfile] = useState('')
  const [changeSell, setChangeSell] = useState(true);
  const [Value, setValue] = useState()
  
  const { Meta } = Card;

  
  //타이머가 끝나는 조건 

  const [SubscribeNumber, setSubscribeNumber] = useState(0);
  const [userid, setUserid] = useState('');
  const [likeOption, setlikeOption] = useState("");
  
  const user = useSelector(state=> state.user)
  const variable = {userTo: userid}
  // console.log(response);
  console.log("채널페이지");
  console.log("props", props);
  console.log("user", user);

  const userInfo = user.data.userdata
  const contentInfo = user.data.contentdata
  
  // console.log(userInfo[0].image);


  

  const videos = contentInfo.map((video, index) => {
    var minutes = Math.floor(video.duration / 60);
    var seconds = Math.floor(video.duration - minutes * 60);
    // console.log(video._id)
    return (
      <Col lg={7} md={10} xs={24} key={index}>
        {/*lg:가장클때 6그리드를쓰겠다. md:중간크기일때 8그리드를 쓰겠다. 
            xs:가장작은 크기일때는 24그리드를 쓰겠다. 총24그리드 */}
        <div style={{ position: "relative" }}>
          <a href={`/video/${video._id}/counterpage`}>
            <img
              style={{ width: "100%" }}
              alt="thumbnail"
              src={`http://localhost:5000/${video.thumbnail}`}
            />

            <div
              className="duration"
              style={{
                bottom: 0,
                right: 0,
                position: "absolute",
                margin: "4px",
                color: "#fff",
                backgroundColor: "rgba(17, 17, 17, 0.8)",
                opacity: 0.8,
                padding: "2px 4px",
                borderRadius: "2px",
                letterSpacing: "0.5px",
                fontSize: "12px",
                fontWeight: "500",
                lineHeight: "12px",
              }}
            >
              <span>
                {minutes} : {seconds}
              </span>
            </div>
          </a>
        </div>
        <br />
        <Meta
          // avatar={<Avatar src={video.writer.image} />}
          title={video.title}
        />
        {/* <span>{video.writer.name} </span> */}
        <br />
        <span style={{ marginLeft: "3rem" }}> {video.views}</span>-
        <span> {moment(video.createdAt).format("MMM Do YY")} </span>
      </Col>
    );
  })



  const subscribeButton = userInfo[0]._id !==
			localStorage.getItem('userId') && (
			<Subscribe
				userTo={userInfo[0]._id}
				userFrom={localStorage.getItem('userId')}
			/> //만약 페이지의 동영상이 본인의 동영상이면 구독버튼을 안보이게만든다.
		);
  
  



  return (
    <div
      style={{
        // margin: "2% auto",
        width: "100%",
        // display: "flex",
        // justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      {/* {modalShow === true ? <Modals show={modalShow} pfp={pfp}off={() => { setModalShow(false)}} img={nftInfo}></Modals> : null} */}
        
      
      
      <div
        style={{
          width: "60%",
          height: "40vh",
          display: "flex",
          flexWrap: "wrap",
          
          // backgroundColor: "gray",
          border: "solid",
          borderRadius:"50px 50px 50px 50px",
          margin:"1% 0 1% 25%",
          paddingBottom: "1%",
          color: "white",
          background: "black",
          

        }}
      >
          <div style={{
            width:"80%",
            marginTop: "1.7%",
            padding: "1%",
            display: "flex",
            // border: "solid",
            // borderRight: "0px",
            // borderRadius:"10px 0 0 10px"
            justifyContent: "left",

          }}>
          <div>{ userInfo[0].image !== "cryptoWT" ? <img src={userInfo[0].image} style={{ height: "30vh", width: "15vw" }} ></img> : <img src={wtImg}></img>}</div>
          <div style={{marginLeft: "3%"}}>
          <p style={{ fontWeight: "bold", fontSize: "4rem" }}>{userInfo[0].name}</p>
          
          <p style={{ fontWeight: "bold", fontSize: "2rem" }}>구독자 수 : {user.data.subscribeNumber}명</p>
          </div>    
          
          </div>
          <div style={{marginTop: "8%"
}}>
            {subscribeButton}
          </div>

        
      </div>
      
      <div style={{ padding: "1%", width:"100%", background: "black"}}>
          
      { {videos} ? <Row gutter={16}>{videos}</Row> : <div>없습니다</div>} 
        </div>
    </div>
  );
}

export default Channel;

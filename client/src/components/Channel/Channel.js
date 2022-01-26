import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
// import { loginUser, auth } from "../../actions/user_action";
import { useNavigate, useParams } from "react-router-dom";
import { Modal,Card, Button } from "react-bootstrap";
import wtImg from "./basic.png";
// import { myPageCheck } from "../../actions/user_action";
import axios from "axios";
import Modals  from './Modals';
import LikeNft from './Like/LikeNft';
import LikeConTent from './Like/LikeConTent';
import MyNft from "./MyNft";
import MyConTent from "./MyConTent";



		// ******** 비디오까지 넘겼으니 이제 채널 프론트 처리하자 ********** //



function Channel() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [Email, setEmail] = useState("");
//   const [Password, setPassword] = useState("");
  const [pbKey, setPbKey] = useState("");
  const [privKey, setPrivKey] = useState("");
  const [nftInfo, setNftInfo] = useState([]);
  const [videoId, setVideoInfo] = useState([]);
  const [userInfo, setUserInfo] = useState("");
//   const [wtToken, setWtToken] = useState("");
//   const [nwtToken, setNwtToken] = useState("");
  const [isCheck, setIsCheck] = useState(false);
  const [sellPrice, setSellPrice] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [profile, setProfile] = useState('')
  const [changeSell, setChangeSell] = useState(true);


  
  //타이머가 끝나는 조건 

  const [SubscribeNumber, setSubscribeNumber] = useState(0);
  const [userid, setUserid] = useState('');
  const [likeOption, setlikeOption] = useState("");
  
  // const user = useSelector(state=> state.user.userData)
  const variable = {userTo: userid}


  useEffect(() => {
    
    

    axios.get("/channel").then((res) => {
      const videoInfo = res.data.nftInfo;
      const userInfo = res.data.userInfo;
      console.log(1);

      // console.log(nftInfo);
      // console.log((user._id, nftInfo._id));
       
    
      if (userInfo.image !== "cryptoWT") {
        setProfile(userInfo.image);
      } else if (userInfo.image === "cryptoWT") {
        setProfile(wtImg);
      }

      if (videoInfo[0] !== undefined) {
        setVideoInfo(videoInfo);
        setIsCheck(true);
      }


      setUserInfo(userInfo);
    });
  }, []);

  useEffect(() => {
    if(userInfo) {
      setUserid(userInfo._id)
    }
  })
  // console.log(userid);

  // useEffect(() => {
    axios.post('/api/subscribe/subscribeNumber', variable).then((response) => {
      if (response.data.success) {
        // console.log(response.data.subscribeNumber);
        setSubscribeNumber(response.data.subscribeNumber);
      } else {
        alert('구독자 수 정보를 받아오지 못했습니다.');
      }
    });

  // }, []);

  // console.log(SubscribeNumber);

    
  const obj = {
    0: <LikeNft />,
    1: <LikeConTent />,
    2: <MyNft nftlist={nftInfo} />,
    3: <MyConTent />
  }


  function likeResult(userId, click) {
    if(click === "LIKENFT") {
      setlikeOption(0)
    }
    else if(click === "LIKECONTENT"){
      setlikeOption(1)
    }
    else if (click === "MYNFT"){
      setlikeOption(2)
    }
    else if (click === "MYCONTENT"){
      setlikeOption(3)
    }
  }


  

 
  function sellNFT(tokenId, imgUri) {
    // console.log(userInfo.privateKey);
    // console.log(userInfo.image === imgUri);
    
    if (userInfo.image === imgUri) {
      setProfile(wtImg);
      axios 
        .post("/api/contract/nft/sell", {
          tokenId,
          sellPrice,
          privateKey:userInfo.privateKey
        })
        .then((res) => {
          if (res.data.success) {
            window.location.reload();
          }
        });
    } else {
      axios
        .post("/api/contract/nft/sell", {
          tokenId,
          sellPrice,
        })
        .then((res) => {
          if (res.data.success) {
            window.location.reload();
          }
        });
    }
    
   
  }

  function cancel(tokenId) {
    console.log(tokenId);

    axios
      .post("/api/contract/nft/cancel", { tokenId })
      .then((res) => {
        if (res.data.success) {
          window.location.reload();
        }
      });
  }
  
  function pfp(a) {
   
    
    axios
      .post("/api/users/setImg", {
        img :a
      }) 
      .then((res) => {
        if (res.data.success) {
          setProfile(a);
        }
      });
  }
  // modal을 ON / OFF하는 함수 true/false


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
          height: "100%",
          display: "flex",
          flexWrap: "wrap",
          // backgroundColor: "gray",
          border: "solid",
          borderRadius:"50px 50px 50px 50px",
          margin:"1% 0 1% 25%",
          paddingBottom: "1%",
          color: "white",
          background: "black"
        }}
      >
        <div
          style={{
            width: "50%",
            // paddingLeft: "15%",
            
          }}
        >
          <div style={{
            marginTop: "1%",
            padding: "1%",
            // border: "solid",
            // borderRight: "0px",
            // borderRadius:"10px 0 0 10px"
            justifyContent: "center",

          }}>
          <p style={{ fontWeight: "bold", fontSize: "4rem" }}>NFT PROFILE</p>
            <span onClick={() => { setModalShow(true) }}>
              <img src={profile} style={{ height: "30vh", width: "15vw" }} ></img>
            </span>
          
          </div>
        </div>

        <div
        style={{
          // width: "40%",
          // height: "50%",
          // backgroundColor: "red",
          display: "flex",
          flexDirection: "column",
          textAlign:"left",
          // paddingTop: "5%",
          // alignItems: "center",
          marginLeft: "8%",
          justifyContent: "center",
          // float: "left",
          // backgroundColor: "#eee",
          
        }}
      >
        <div>{userInfo.name}</div>
        <div style={{marginTop: "2%",}}><p>구독자 수 : {SubscribeNumber}명</p></div>
      </div>

        
      </div>
      <div style={{ padding: "1%", width:"100%", background: "black"}}>
          <Button className="me-3" variant="light" onClick={()=>{likeResult(userInfo._id, "LIKENFT")}}>Favorite NFT</Button>
          <Button className="me-3" variant="light" onClick={()=>{likeResult(userInfo._id, "LIKECONTENT")}} >Favorite ConTent</Button>
          <Button className="me-3" variant="light" onClick={()=>{likeResult(userInfo._id, "MYNFT")}} >My NFT</Button>
          <Button className="" variant="light" onClick={()=>{likeResult(userInfo._id, "MYCONTENT")}} >My ConTent</Button>

        </div>
        <div style={{width: "100%", background:"black", display:"flex", justifyContent: "center",}}>{obj[likeOption]}</div>
    </div>
  );
}

export default Channel;

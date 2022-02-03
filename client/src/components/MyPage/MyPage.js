import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import wtImg from "./basic.png";
import axios from "axios";
import Modals from "./Modals";
import LikeNft from "./Like/LikeNft";
import LikeConTent from "./Like/LikeConTent";
import MyNft from "./MyNft";
import MyConTent from "./MyConTent";
import copyimg from "./copy.png";
import styled, { keyframes } from "styled-components";

const Div = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin: 0;
  

`;

const BoxDiv = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  border: none;
  border-radius: 50px;
  margin: 1% 0 1% 25%;
  padding-bottom: 1%;
  box-shadow: 4px 12px 20px 6px rgb(0 0 0 / 50%);
`;
const ImgDiv = styled.div`
  margin-left: 100px;
  width: 50%;
  cursor: pointer;
  border-radius: 5%;
  transition: all 0.2s ease-in-out;
  &:hover {
    box-shadow: 4px 12px 20px 6px rgb(0 0 0 / 18%);
    transform: translateY(5px);
  }
`;
const Button = styled.button`
  border-radius: 5px;
  border: 1px solid #71b852;
  padding: 5px;
  min-width: 120px;
  color: white;
  font-weight: 600;
  -webkit-appearance: none;
  background-color: #7DE7A6;
  box-shadow: 4px 12px 30px 6px rgb(0 0 0 / 20%);
  cursor: pointer;
  &:active,
  &:foucus {
    outline: none;
  }
  transition: all 0.2s ease-in-out;
&:hover {

  box-shadow: 4px 12px 20px 6px rgb(0 0 0 / 50%);
  transform: translateY(3px);

}
`;
function MyPage() {
  const [pbKey, setPbKey] = useState("");
  const [privKey, setPrivKey] = useState("");
  const [nftInfo, setNftInfo] = useState([]);
  const [userInfo, setUserInfo] = useState("");
  const [wtToken, setWtToken] = useState("");
  const [nwtToken, setNwtToken] = useState("");
  const [isCheck, setIsCheck] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [profile, setProfile] = useState("");
  const [check, setCheck] = useState(false);

  const [SubscribeNumber, setSubscribeNumber] = useState(0);
  const [userid, setUserid] = useState("");
  const [likeOption, setlikeOption] = useState("");

  const user = useSelector((state) => state.user.userData);
  const variable = { userTo: userid };

  useEffect(() => {
    if (user) {
      setUserid(user._id);
    }
  });

  axios.post("/api/subscribe/subscribeNumber", variable).then((response) => {
    if (response.data.success) {
      setSubscribeNumber(response.data.subscribeNumber);
    } else {
      alert("구독자 수 정보를 받아오지 못했습니다.");
    }
  });

  useEffect(() => {
    axios.get("/api/contract/myPage").then((res) => {
      const nftInfo = res.data.nftInfo;
      const userInfo = res.data.userInfo;
      console.log(1);

      if (userInfo.image !== "cryptoWT") {
        setProfile(userInfo.image);
      } else if (userInfo.image === "cryptoWT") {
        setProfile(wtImg);
      }

      if (nftInfo[0] !== undefined) {
        setNftInfo(nftInfo);
        setIsCheck(true);
      }

      setPrivKey(userInfo.privateKey);
      setPbKey(userInfo.publicKey);
      setUserInfo(userInfo);
      setWtToken(userInfo.wtToken);
      setNwtToken(userInfo.nwtToken);
    });
  }, []);

  const obj = {
    0: <LikeNft />,
    1: <LikeConTent />,
    2: <MyNft nftlist={nftInfo} />,
    3: <MyConTent />,
  };

  function likeResult(userId, click) {
    if (click === "LIKENFT") {
      setlikeOption(0);
      setCheck(true);
    } else if (click === "LIKECONTENT") {
      setlikeOption(1);
      setCheck(true);
    } else if (click === "MYNFT") {
      setlikeOption(2);
      setCheck(true);
    } else if (click === "MYCONTENT") {
      setlikeOption(3);
      setCheck(true);
    }
  }

  function pfp(a) {
    axios
      .post("/api/users/setImg", {
        img: a,
      })
      .then((res) => {
        if (res.data.success) {
          setProfile(a);
        }
      });
  }
  // modal을 ON / OFF하는 함수 true/false

  const firstkey = pbKey.substring(0, 4);
  const lastkey = pbKey.substring(38, 42);

  const firstprikey = privKey.substring(0, 4);
  const lastprikey = privKey.substring(60, 64);

  // console.log(lastprikey);
  const textcopy = useRef();

  const copy = () => {
    // const el = pbKey;
    // console.log(el);
    textcopy.current.select();
    document.execCommand("copy");
  };

  return (
    <div
      style={{
        width: "100%",
        flexWrap: "wrap",
        paddingTop: "70px"
      }}
    >
      {modalShow === true ? (
        <Modals
          show={modalShow}
          pfp={pfp}
          off={() => {
            setModalShow(false);
          }}
          img={nftInfo}
        ></Modals>
      ) : null}

      <BoxDiv>
        <div
          style={{
            width: "50%",
          }}
        >
          <div
            style={{
              marginTop: "1%",
              padding: "1%",
              justifyContent: "center",
            }}
          >
            <p style={{ fontWeight: "bold", fontSize: "2rem" }}>NFT PROFILE</p>
            <span
              onClick={() => {
                setModalShow(true);
              }}
            >
              <ImgDiv>
                <img
                  src={profile}
                  style={{ height: "30vh", width: "15vw" }}
                ></img>
              </ImgDiv>
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            textAlign: "left",
            marginLeft: "5%",
            justifyContent: "center",
          }}
        >
          <div>
            <p>
              <span>{wtToken} WT (stable)</span>
            </p>
          </div>
          <div
            style={{
              marginTop: "2%",
            }}
          >
            <p>
              <span>{nwtToken} NWT (Flexible Coin)</span>
            </p>
          </div>
          <div
            style={{
              marginTop: "2%",
            }}
          >
            <p>
              내 주소 :
              <input
                readOnly
                ref={textcopy}
                value={pbKey}
                style={{
                  display: "inline-block",
                  background: "",
                  border: "none",
                  outline: "none",
                }}
              ></input>
              <img src={copyimg} width="23px" onClick={copy} />
            </p>
          </div>
          <div
            style={{
              marginTop: "2%",
            }}
          >
            <p>
              비공개키 : {firstprikey}………{lastprikey}
            </p>
          </div>
          <div style={{ marginTop: "2%" }}>
            <p>구독자 수 : {SubscribeNumber}명</p>
          </div>
          
        </div>

      </BoxDiv>
      
      <div style={{ padding: "1%", width: "100%", background: "" }}>
        <Button
          className="me-3"
          variant="light"
          onClick={() => {
            likeResult(user._id, "LIKENFT");
          }}
        >
          Favorite NFT
        </Button>
        <Button
          className="me-3"
          variant="light"
          onClick={() => {
            likeResult(user._id, "LIKECONTENT");
          }}
        >
          Favorite ConTent
        </Button>
        <Button
          className="me-3"
          variant="light"
          onClick={() => {
            likeResult(user._id, "MYNFT");
          }}
        >
          My NFT
        </Button>
        <Button
          className=""
          variant="light"
          onClick={() => {
            likeResult(user._id, "MYCONTENT");
          }}
        >
          My ConTent
        </Button>
      </div>
      {check === true ? <Div>{obj[likeOption]}</Div> : <div></div>}
      
    </div>
  );
}

export default MyPage;

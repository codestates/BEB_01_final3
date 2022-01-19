import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loginUser, auth } from "../../actions/user_action";
import { useNavigate, useParams } from "react-router-dom";
import { Modal,Card, Button } from "react-bootstrap";
import wtImg from "./basic.png";
import { myPageCheck } from "../../actions/user_action";
import axios from "axios";
import  Modals  from './Modals';

function MyPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [pbKey, setPbKey] = useState("");
  const [privKey, setPrivKey] = useState("");
  const [nftInfo, setNftInfo] = useState([]);
  const [userInfo, setUserInfo] = useState("");
  const [wtToken, setWtToken] = useState("");
  const [nwtToken, setNwtToken] = useState("");
  const [isCheck, setIsCheck] = useState(false);
  const [sellPrice, setSellPrice] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [profile, setProfile] = useState('')
  const [changeSell, setChangeSell] = useState(true);

  useEffect(() => {

    

    axios.get("/api/contract/myPage").then((res) => {
      const nftInfo = res.data.nftInfo;
      const userInfo = res.data.userInfo;
       
    
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
        margin: "2% auto",
        width: "90%",
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      {modalShow === true ? <Modals show={modalShow} pfp={pfp}off={() => { setModalShow(false)}} img={nftInfo}></Modals> : null}
        
      
      <div
        style={{
          width: "50%",
          height: "18rem",
          backgroundColor: "red",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#eee",
          
        }}
      >
        <div
          style={{
            width: "100%",
            height: "50%",
          }}
        >
          <p>WT Coin [stable]</p>
          <p>
            <input
              value={wtToken}
              readOnly
              style={{ border: "none", backgroundColor: "#eee" }}
            />
          </p>
        </div>
        <div
          style={{
            width: "100%",
            height: "50%",
          }}
        >
          <p>NWT Coin [flexible Coin]</p>
          <p>
            <input
              value={nwtToken}
              readOnly
              style={{ border: "none", backgroundColor: "#eee" }}
            />
          </p>
        </div>
      </div>
      <div
        style={{
          width: "50%",
          height: "18rem",
          backgroundColor: "#eee",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "50%",
          }}
        >
          <p>내 주소</p>
          <p>{pbKey}</p>
        </div>
        <div
          style={{
            width: "100%",
            height: "50%",
          }}
        >
          <p>비공개키</p>
          <p>{privKey}</p>
        </div>
      </div>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexWrap: "wrap",
          backgroundColor: "gray",
        }}
      >
        <div
          style={{
            width: "100%",
          }}
        >
          <div style={{ padding: "1%", borderBottom: "1px dashed" }}>
          <p style={{ fontWeight: "bold", fontSize: "4rem" }}>NFT PROFILE</p>
            <span onClick={() => { setModalShow(true) }}>
              <img src={profile} style={{ height: "30vh", width: "15vw" }} ></img>
            </span>
          
          </div>
        </div>  
       
        <div style={{
           margin: "2% auto",
           width: "100%",
           display: "flex",
           justifyContent: "center",
           flexWrap: "wrap",
        }}>
        {isCheck === true ? (
          nftInfo.map((el) => {
            return (
              <Card style={{ width: "20rem", margin: "1%", cursor: "pointer" }}>
                <Card.Img
                  variant="top"
                  src={el.imgUri}
                  style={{ height: "80%" }}
                />
                <Card.Body style={{ marginRight: "1%" }}>
                  <Card.Title>Content : {el.contentTitle}</Card.Title>
                  <Card.Title>Name : {el.nftName}</Card.Title>
                  <Card.Text>desription : {el.description}</Card.Text>
                  <Card.Title>Name : {el.nftName}</Card.Title>
                  {el.sale ? (
                    <>
                      <Button variant="primary" style={{ marginRight: "2%" }}>
                        판매중
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => {
                          cancel(el.tokenId);
                        }}
                      >
                        판매취소
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="primary"
                        style={{ marginRight: "2%" }}
                        onClick={() => {
                          sellNFT(el.tokenId,el.imgUri);
                        }}
                      >
                        판매
                      </Button>
                      <input
                        type="text"
                        size="10"
                        style={{ border: "none", borderBottom: "1px solid" }}
                        onChange={(e) => {
                          setSellPrice(e.target.value);
                        }}
                      ></input>
                      <span>
                        <img
                            src={wtImg}
                            style={{ height: "3vh", width: "1.5vw" }}
                            ></img>
                      </span>
                    </>
                  )}
                </Card.Body>
              </Card>
            );
          })
        ) : (
              <div style={{ height: "40vh" }}><p style={{fontSize:"4rem"}}> NFT를 소유하고 있지않습니다.</p></div>
          )}
          </div>
      </div>
    </div>
  );
}

export default MyPage;

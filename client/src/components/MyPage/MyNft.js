import React, { useState, useEffect } from "react";
import { Modal,Card, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import wtImg from "./basic.png";
import axios from "axios";
import FixedModal  from './FixedModal';
import AuctionModal  from './AuctionModal';
import LikeDisLike from "../NFTcreate/LikeDisLike";
import styled, { keyframes } from "styled-components";
import Swal from "sweetalert2";

const loadEffect2 = keyframes `
  from{
    opacity: 0
  }
  to {
    opacity: 100
  }
  `

const MainDiv = styled.div`
  animation: ${loadEffect2} 5s ease, step-start ;
`


const Div = styled.div`
margin: 2%;
border-radius: 4%;

box-shadow: 4px 12px 30px 6px rgb(0 0 0 / 9%);
transition: all 0.2s ease-in-out;
&:hover {

  box-shadow: 4px 12px 20px 6px rgb(0 0 0 / 18%);
  transform: translateY(5px);

}
`
const ButtonDiv = styled.div`

display: flex;
flex-wrap: wrap;
/* justify-content: center; */
margin-top: -20px;

`

const TBody = styled.div`
    display: flex;
    /* justify-content: left; */
    text-align: left;
    `


function MyNft () {
    const [nftInfo, setNftInfo] = useState([]);
    const [pbKey, setPbKey] = useState("");
    const [privKey, setPrivKey] = useState("");
    // const [nftInfo, setNftInfo] = useState([]);
    const [userInfo, setUserInfo] = useState("");
    const [wtToken, setWtToken] = useState("");
    const [nwtToken, setNwtToken] = useState("");
    const [modalShow, setModalShow] = useState(false);
    const [profile, setProfile] = useState('')
    const [isCheck, setIsCheck] = useState(false);
    const [sellPrice, setSellPrice] = useState("");
    const [fixed, setFixed] = useState(false);
    const [auction, setAuction] = useState(false);
  const [modalInfo, setModalInfo] = useState({});
  const [sale, setSale] = useState(true);

    const navigate = useNavigate();


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

  function sellNFT(tokenId, imgUri, sellPrice) {

    if (userInfo.image === imgUri) {
      axios 
        .post("/api/contract/nft/sell", {
          tokenId,
          sellPrice,
          privateKey : userInfo.privateKey
        })
        .then((res) => {
       
          if (res.data.success) {
            setProfile(wtImg);
            Swal.fire({
              icon: 'success',
              title: `${sellPrice}NWT 가격이 설정되었습니다.` ,  
            }).then(res => {
              setFixed(false);
              return
            })
          } else {
            Swal.fire({
              icon: 'error',
              title: 'price need to number' ,  
            }).then(res => {
              setFixed(false);
              return
            })
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
            Swal.fire({
              icon: 'success',
              title: `${sellPrice}NWT 가격이 설정되었습니다.` ,  
            }).then(res => {
              setFixed(false);
              return
            })
          } else {
            Swal.fire({
              icon: 'error',
              title: 'price need to number',  
            }).then(res => {
              setFixed(false);
              return;
            })
          }
        });
    }
  }

  function cancel(tokenId) {

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

  function Fixed(info) {
   
      if (fixed) {
        setFixed(false);
      } else {
        setFixed(true);
      }
      setModalInfo(info);
  }
  function Auction(info) {
   
    if (auction) {
      setAuction(false);
    } else {
      setAuction(true);
    }
    setModalInfo(info);
}


  

  return (

    <div>
      <MainDiv>
    <div style={{
        fontSize: "50px",
        color: "white",
        background:'black',
        // marginBottom:"2%"
    }}>
      
    </div>

    <div style={{
    width:'100vw', 
    height:'100%',
     display:'flex',
    flexWrap:'wrap',
    justifyContent: 'center',
     alignContent: 'center',
    backgroundColor:'black'
      }}>
        
        {/* 판매부분 fixed / Acution 모달창  */}
        {fixed === true ? <FixedModal check={Fixed} modalInfo={modalInfo} sellNFT={sellNFT}/> : null}
        {auction === true ? <AuctionModal check={Auction} modalInfo={modalInfo} userInfo={userInfo} /> : null}
    {nftInfo.length !== 0 ? (
    nftInfo.map((el) => {
      return (
             <>
             <Div>
            <Card bg='black' text='white' border='white' style={{ width:'25rem', borderRadius:'4%', margin:"auto",borderRadius:'4%' }}>
                <Card.Img variant="top" src={el.imgUri} style={{ width: '100%', height:'25rem', borderTopLeftRadius:'4%',borderTopRightRadius:"4%" }} />
                <TBody>
                <Card.Body>
                <Card.Title>
                    Content : {el.contentTitle}
                </Card.Title>
                <Card.Text>
                    Name : {el.nftName}<br />
                    desription : {el.description}
                  </Card.Text>
                
            </Card.Body>
            <Card.Body>
                <Card.Title>
                  { sale === el.sale ?  <Card.Title>
                    Price : {el.price}
                  </Card.Title> : <Card.Title>
                    판매중이 아닙니다
                  </Card.Title> }
                </Card.Title>
            </Card.Body>
            </TBody>
              <Card.Body>
                <ButtonDiv>
            {
                el.sale === true ?
                  <>
                  <div>
                      <Button variant="warning" style={{fontWeight:"bold"}}  onClick={()=>{cancel(el.tokenId)}} >판매취소</Button>
                  </div>
                    <div style={{ width: "55%" }}></div>
                    </>
                  :
                  <>
                  <div style={{ display: 'flex' }}>
                    <span style={{ marginRight: "8%" }}><Button variant="warning" style={{ fontWeight: "bold" }} onClick={() => { Fixed({tokenId:el.tokenId,imgUri:el.imgUri}) }} >Fixed</Button></span>
                    <span><Button variant="warning" style={{ fontWeight: "bold" }}  onClick={() => { Auction({tokenId:el.tokenId,imgUri:el.imgUri}) }} >Auction</Button></span>
                  </div>
                    <div style={{ width: "40%" }}></div>
                    </>
                     }
                  <LikeDisLike userId={localStorage.getItem('userId')} nftId={el._id} />
                  </ButtonDiv>
                </Card.Body>
            </Card>
            </Div>
           </>
        )
    })
    ) : (
      <div style={{ height: "40vh" }}><p style={{fontSize:"4rem", color: "white"}}> NFT is not exist</p></div>
  )}

</div>
</MainDiv>
</div>
  )
}

export default MyNft;

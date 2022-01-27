import React, { useState, useEffect } from "react";
import { Modal,Card, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import wtImg from "./basic.png";
import axios from "axios";
import FixedModal  from './FixedModal';
import AuctionModal  from './AuctionModal';
import LikeDisLike from "../NFTcreate/LikeDisLike";
import Swal from "sweetalert2";


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

    //   console.log(nftInfo);
      // console.log((user._id, nftInfo._id));
       
    
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
    // console.log(userInfo.privateKey);
    // console.log(userInfo.image === imgUri);
    if (userInfo.image === imgUri) {
      console.log("이미지가 똑같네?");
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
             
            <Card style={{ width: '19rem', margin:"1.5%", cursor:"pointer"}} bg='black' text='white' border='white'>
                <Card.Img variant="top" src={el.imgUri} style={{height:'100%', width:'100%'}} />
                <Card.Body style={{marginBottom: '0px', borderBottom: '1px solid #DCDCDC'}}>
                <Card.Title style={{textAlign:'left', marginTop: '3%', marginLeft:'-3%'}}>
                    Content : {el.contentTitle}
                </Card.Title>
                <Card.Title style={{textAlign:'left', marginTop: '5%', marginLeft:'-3%'}}>
                    Name : {el.nftName}
                </Card.Title>
                { sale === el.sale ?  <Card.Title style={{textAlign:'left', marginTop: '5%', marginLeft:'-3%'}}>
                    Price : {el.price}
                  </Card.Title> : null }
            </Card.Body>
            <Card.Body style={{marginBottom: '0px', borderBottom: '1px solid #DCDCDC'}}>
                <Card.Text style={{textAlign:'left', marginLeft:'-3%', fontSize:'20px'}}>
                    desription : {el.description}
                </Card.Text>
            </Card.Body>
            <Card.Body style={{display:"flex", marginLeft:'-3%', marginRight:'-9%'}}>
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
                    <div style={{ width: "30%" }}></div>
                    </>
                     }
                <LikeDisLike userId={localStorage.getItem('userId')} nftId={ el._id } />
                </Card.Body>
            </Card>
           </>
        )
    })
    ) : (
      <div style={{ height: "40vh" }}><p style={{fontSize:"4rem", color: "white"}}> NFT is not exist</p></div>
  )}

</div>
</div>
  )
}

export default MyNft;

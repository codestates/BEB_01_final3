import React, { useState, useEffect } from "react";
import { Modal,Card, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import wtImg from "./basic.png";
import axios from "axios";
import Modals  from './Modals';
import LikeDisLike from "../NFTcreate/LikeDisLike";

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

  function BuyNFT(tokenId){
    axios.post('/api/contract/buyNFT',{tokenId:tokenId})
      .then((res) => {
              
        
           if(res.data.failed === false){
             alert('구매가 되지 않았습니다. 확인해주세요!!!, reason :'+res.data.reason)
           }else if(res.data.success){
             alert('구매가 완료되었습니다. 구매자의 mypage로 이동하겠습니다.')
             navigate('/user/myPage')

           }
          
        });
  }

  return (

    <div>
    <div style={{
        fontSize: "50px",
        color: "white",
        background:'black',
        // marginBottom:"2%"
    }}>
        My NFT ! !
    </div>

    <div style={{
    width:'100vw', 
    height:'100vh',
     display:'flex',
    flexWrap:'wrap',
    justifyContent: 'center',
     alignContent: 'center',
    backgroundColor:'black'
  }}>
    {nftInfo.length !== 0 ? (
    nftInfo.map((el) => {
        return(
            <Card style={{ width: '19rem', margin:"1.5%", cursor:"pointer"}} bg='black' text='white' border='white'>
                <Card.Img variant="top" src={el.imgUri} style={{height:'100%', width:'100%', }} />
                <Card.Body style={{marginBottom: '0px', borderBottom: '1px solid #DCDCDC'}}>
                <Card.Title style={{textAlign:'left', marginTop: '3%', marginLeft:'-3%'}}>
                    Content : {el.contentTitle}
                </Card.Title>
                <Card.Title style={{textAlign:'left', marginTop: '5%', marginLeft:'-3%'}}>
                    Name : {el.nftName}
                </Card.Title>
                <Card.Title style={{textAlign:'left', marginTop: '5%', marginLeft:'-3%'}}>
                    Price : {el.price}
                </Card.Title>
            </Card.Body>
            <Card.Body style={{marginBottom: '0px', borderBottom: '1px solid #DCDCDC'}}>
                <Card.Text style={{textAlign:'left', marginLeft:'-3%', fontSize:'20px'}}>
                    desription : {el.description}
                </Card.Text>
            </Card.Body>
            <Card.Body style={{display:"flex", marginLeft:'-3%', marginRight:'-9%'}}>
                <div>
                    <Button variant="warning" style={{fontWeight:"bold"}}  onClick={()=>{BuyNFT(el.tokenId)}} >판매중</Button>
                </div>
                <div style={{width:"60%"}}></div>
                <LikeDisLike userId={localStorage.getItem('userId')} nftId={ el._id } />
                </Card.Body>
            </Card>

        )
    })
    ) : (
      <div style={{ height: "40vh" }}><p style={{fontSize:"4rem", color: "white"}}> NFT를 소유하고 있지않습니다.</p></div>
  )}

</div>
</div>
  )
}

export default MyNft;

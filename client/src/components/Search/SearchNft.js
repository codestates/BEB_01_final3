import React, { useState, useEffect } from "react";
import { Modal,Card, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import wtImg from "./sub/basic.png";
import axios from "axios";
import FixedModal  from './sub/FixedModal';
import AuctionModal  from './sub/AuctionModal';
import LikeDisLike from "../NFTcreate/LikeDisLike";
import styled from "styled-components";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from 'react-redux';


const Div = styled.div`
margin: 2%;
border-radius: 4%;
box-shadow: 4px 12px 30px 6px rgb(0 0 0 / 9%);
transition: all 0.2s ease-in-out;
&:hover {

  box-shadow: 4px 12px 20px 6px rgb(0 0 0 / 18%);
  transform: translateY(5px);

}
padding-top: 70px;
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

const SearchNft = (props) => {
  const dispatch = useDispatch();

  const [searchValue, setSearchValue] = useState("");
  const [fixed, setFixed] = useState(false);
  const [auction, setAuction] = useState(false);
  const [modalInfo, setModalInfo] = useState({});
  const [sale, setSale] = useState(true);
  const [profile, setProfile] = useState('')
  const [userInfo, setUserInfo] = useState("");

  const user = useSelector((state) => state.user);
  console.log(props);
  let flag = false;

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

  if(user.searchNft.success === true) {
    flag = user.searchNft.success
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

      { flag ? (user.searchNft.data.map((el) => {
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
  </div>
  )

  
  
};
 

export default SearchNft;

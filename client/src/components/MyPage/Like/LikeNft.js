import React, {useState, useEffect} from "react"
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios';
import {Card,Button} from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom';
import LikeDisLike from '../../NFTcreate/LikeDisLike';
import styled, { keyframes } from "styled-components";
import FixedModal  from '../FixedModal';
import AuctionModal  from '../AuctionModal';
import Swal from "sweetalert2";
import wtImg from "../basic.png";

// import NFTbuy from './NFTbuy'



function LikeNft () {
    const user = useSelector(state=> state.user.userData)

    console.log(user._id);

    const [Likes, setLikes] = useState('');
    const [nft, setNft] = useState([]);
    const [loading, setLoading] = useState(false)
    const [fixed, setFixed] = useState(false);
    const [auction, setAuction] = useState(false);
    const [modalInfo, setModalInfo] = useState({});
    const [sale, setSale] = useState(true);
    const [userInfo, setUserInfo] = useState("");
    const [profile, setProfile] = useState('')

    const loadEffect2 = keyframes `
    from{
      opacity: 0
    }
    to {
      opacity: 10
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


    const navigate = useNavigate();

    useEffect(() => {
        axios.post('/api/contract/nft/list', {type:"fixed"}).then((res) => {
            console.log(res);
          if(res.data.data.length !== 0){
            setNft(res.data.data)
            console.log(res.data.data.length);
            setLoading(true)
          }else if( res.data.data.lenght === 0){
            setLoading(false)
          }
        });
    }, []);
    
    let variable = {}
    variable = { userId: user._id };
    // console.log('var',variable)

    useEffect(() => {

        axios.post('/api/like/getlikes', variable)
            .then(response => {
                if (response.data.success) {
                    // console.log("?!", response.data.likes);
                    setLikes(response.data.likes);
                    
                } else {
                    alert('좋아요 정보 받기 실패')
                }
            })
    }, [])

    const res = [];
    let k = 0;
    for(let i = 0; i < Likes.length; i++){
            // console.log(nft[i]._id);
            // console.log(Likes[i]);

            if(Likes[i].nftId && Likes[i].userId === user._id) {
                // console.log("Nft임 !", Likes[i]);
                res[k] = Likes[i].nftId;
                k = k + 1;
                // console.log("res", res[i]);
            } 
            else {
                // console.log("Nft가 아님!?", Likes[i]);
            } 
         
            
    }
    
    // console.log(res);

    const result = [];
    for (let i = 0; i < nft.length; i++){
        // console.log(nft[i]);
        result[i] = nft[i];

    }
    console.log(result)

    const Likenft = [];
    for(let i = 0 ; i < res.length; i++) {
        for(let k = 0; k < result.length; k++){
            if(res[i] === result[k]._id){
                // console.log("맞음?", res[i], result[k]);
                Likenft[i] = result[k]
            } 
        }
    }
    console.log(Likenft);

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

    // function BuyNFT(tokenId){
    //     axios.post('/api/contract/buyNFT',{tokenId:tokenId})
    //       .then((res) => {
                  
            
    //            if(res.data.failed === false){
    //              alert('구매가 되지 않았습니다. 확인해주세요!!!, reason :'+res.data.reason)
    //            }else if(res.data.success){
    //              alert('구매가 완료되었습니다. 구매자의 mypage로 이동하겠습니다.')
    //              navigate('/user/myPage')
    
    //            }
              
    //         });
    //   }

      function cancel(tokenId) {

        axios
          .post("/api/contract/nft/cancel", { tokenId })
          .then((res) => {
            if (res.data.success) {
              window.location.reload();
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

    return(
      <div>
        <MainDiv>
            <div style={{
                fontSize: "50px",
                color: "white",
                background:'black',
                // marginBottom:"2%"
            }}>
                My Favorite NFT ! !
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
            {fixed === true ? <FixedModal check={Fixed} modalInfo={modalInfo} sellNFT={sellNFT}/> : null}
            {auction === true ? <AuctionModal check={Auction} modalInfo={modalInfo} userInfo={userInfo} /> : null}
            {Likenft.length !== 0 ? (
            Likenft.map((el) => {
                return(
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
                           <div style={{ width: "30%" }}></div>
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

export default LikeNft
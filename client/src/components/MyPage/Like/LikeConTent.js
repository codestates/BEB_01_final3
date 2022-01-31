import React, {useState, useEffect} from "react"
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios';
// import {Card,Button} from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom';
import LikeDisLike from '../../NFTcreate/LikeDisLike';
import "antd/dist/antd.css";
import { Card, Avatar, Col, Typography, Row, Layout } from "antd";
import moment from "moment";
import styled, { keyframes } from "styled-components";

const { Meta } = Card;
const { Content, Sider } = Layout;


// import NFTbuy from './NFTbuy'
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


function LikeNft () {
    const user = useSelector(state=> state.user.userData)

    // console.log(user);

    const [Likes, setLikes] = useState('');
    const [Video, setVideo] = useState([]);
    const [nft, setNft] = useState([]);
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate();

    useEffect(() => {
        axios.get("/api/video/getVideos").then((response) => {
          if (response.data.success) {
            // console.log('랜딩페이지', response.data)
            setVideo(response.data.videos);
          } else {
            alert("비디오 가져오기를 실패했습니다.");
          }
        });
      }, []);

    
    // let variable = {}
    // variable = { nftId: {nft}._id, userId: user._id };
    // console.log('var',variable)

    useEffect(() => {

        axios.post('/api/like/getlikes', user._id)
            .then(response => {
                if (response.data.success) {

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
            
            if(Likes[i].videoId && Likes[i].userId === user._id) {
                // console.log("Nft임 !", Likes[i]);
                res[k] = Likes[i].videoId;
                k = k + 1;

                // console.log("res", res[i]);
            } 
            else {
                // console.log("Nft가 아님!?", Likes[i]);
            } 
    }
    
    // console.log(res);

    const result = [];
    for (let i = 0; i < Video.length; i++){
        // console.log(nft[i]);
        result[i] = Video[i];

    }
    // console.log(result[0]._id)

    const LikeContent = [];
    for(let i = 0 ; i < res.length; i++) {
        for(let k = 0; k < result.length; k++){
            if(res[i] === result[k]._id){
                // console.log("맞음?", res[i], result[k]);
                LikeContent[i] = result[k]
            } 
        }
    }
    // console.log(LikeContent);

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

      const renderCards = LikeContent.map((video, index) => {
        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor(video.duration - minutes * 60);
    
        return (
          <Col lg={7} md={10} xs={24} key={index} style={{color:"white", margin:"1% 1% 1% 1%", paddingBottom:"1%", borderBottom:"solid white", width:"80vw"}}>
            {/*lg:가장클때 6그리드를쓰겠다. md:중간크기일때 8그리드를 쓰겠다. 
                xs:가장작은 크기일때는 24그리드를 쓰겠다. 총24그리드 */}
            <div style={{ position: "relative"}}>
              <a href={`/video/${video._id}/counterpage`}>
                <img
                  style={{ width: "80%" }}
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
                    color: "white",
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
              avatar={<Avatar src={video.writer.image} />}
              title={video.title}
            />
            <span>{video.writer.name} </span>
            <br />
            <span style={{ marginLeft: "3rem" }}> {video.views}</span>-
            <span> {moment(video.createdAt).format("MMM Do YY")} </span>
          </Col>
        );
      });

    return(
        <div style={{}}>
          <MainDiv>
            <div style={{
                fontSize: "50px",
                color: "white",
                marginBottom: "-2%"
                // background:'black',
                // marginBottom:"2%"
            }}>
                My Favorite ConTent ! !
            </div>
            
            <div style={{
                width: "100%",
                margin: "3rem auto",
                // textAlign:"center",

                // marginRight: "250px",
            }}>
              <Row gutter={16}>{renderCards}</Row>

            </div>
            </MainDiv>
        </div>
        
    )


}

export default LikeNft
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Card, Avatar, Col, Typography, Row } from "antd";
import "antd/dist/antd.css";
import { Layout, Menu } from "antd";
import moment from "moment";
import { UserAddOutlined } from "@ant-design/icons";
import styled, { keyframes } from "styled-components";

const BigBox = styled.div`
width:70%;
display: flex;
justify-content: center;
border-radius: 8%;
box-shadow: 4px 12px 30px 6px rgb(0 0 0 / 15%);
flex-wrap: wrap;
margin-left: 300px;
`;

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
  display: block;
  width: 100%;
  margin-left: 20%;
`

const ImgDiv = styled.div`
	background: no-repeat center;
	outline: none;
	cursor: pointer;
	border: none;
	border-radius: 5%;
	box-shadow: 4px 12px 30px 6px rgb(0 0 0 / 25%);
	transition: all 0.2s ease-in-out;
	margin: 20px;
	&:hover {
		box-shadow: 4px 12px 20px 6px rgb(0 0 0 / 50%);
		transform: translateY(5px);
	}
`;

const TextBox = styled.div`
	margin-left: 10px;
	text-align: left;
  color: black;
`;
function MyConTent () {

    const [Video, setVideo] = useState([]);
    const [UserVideo, setUserVideo] = useState([]);
    const { Content, Sider } = Layout;
    const { Title } = Typography;
    const { Meta } = Card;

    const user = useSelector(state=> state.user.userData)

    useEffect(() => {
        axios.get("/api/video/getVideos").then((response) => {
        if (response.data.success) {
            console.log('랜딩페이지', response.data)
            setVideo(response.data.videos);
        } else {
            alert("비디오 가져오기를 실패했습니다.");
        }
        });
    }, []);

    useEffect(() => {
      axios.get('/api/user/video/getVideos').then((response) => {
        if (response.data.success) {
          console.log('제너럴', response.data);
          setUserVideo(response.data.videos);
        } else {
          alert('비디오 가져오기를 실패했습니다.');
        }
      });
    }, []);

    const userVideo = [];
    for(let i = 0; i < Video.length; i++){
      if(Video[i].writer._id === user._id) {
        userVideo[i] = Video[i];
      }
    }

    const myVideo = [];
    for(let i = 0; i < UserVideo.length; i++){
      if(UserVideo[i].writer._id === user._id) {
        myVideo[i] = UserVideo[i];
      }
    }

    const renderCards = userVideo.map((video, index) => {
        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor(video.duration - minutes * 60);
    
        return (
          <Col lg={7} md={10} xs={24} key={index} style={{color:"white", margin:"1% 1% 1% 1%", paddingBottom:"1%", borderBottom:"solid white"}}>
            {/*lg:가장클때 6그리드를쓰겠다. md:중간크기일때 8그리드를 쓰겠다. 
                xs:가장작은 크기일때는 24그리드를 쓰겠다. 총24그리드 */}
            <ImgDiv>
              {/*lg:가장클때 6그리드를쓰겠다. md:중간크기일때 8그리드를 쓰겠다. 
                xs:가장작은 크기일때는 24그리드를 쓰겠다. 총24그리드 */}
              <div style={{ position: 'relative' }}>
                <a href={`/videos/${video._id}`}>
                  <img
                    style={{
                      width: '95%',
                      marginTop: '5px',
                      borderRadius: '5px',
                    }}
                    alt='thumbnail'
                    src={`http://localhost:5000/${video.thumbnail}`}
                  />
    
                  <div
                    className='duration'
                    style={{
                      bottom: 0,
                      right: 0,
                      position: 'absolute',
                      margin: '4px',
                      color: '#fff',
                      backgroundColor: 'rgba(17, 17, 17, 0.8)',
                      opacity: 0.8,
                      padding: '2px 4px',
                      borderRadius: '2px',
                      letterSpacing: '0.5px',
                      fontSize: '12px',
                      fontWeight: '500',
                      lineHeight: '12px',
                    }}>
                    <span>
                      {minutes} : {seconds}
                    </span>
                  </div>
                </a>
              </div>
              <br />
              <Meta
                avatar={<Avatar src={video.writer.image} size={45} />}
                title={video.title}
                style={{ marginLeft: '10px'}}
              />
              <TextBox>
                <span>{video.writer.name} </span>
                <br />
                <span style={{ marginLeft: '3rem' }}>
                  {' '}
                  조회수 {video.views}
                </span>
                <span>
                  {' '}
                  {moment(video.createdAt).format('MMM Do YY')}{' '}
                </span>
                <br />
                <br />
              </TextBox>
            </ImgDiv>
          </Col>
        );
      });

      const renderUserCards = myVideo.map((video, index) => {
        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor(video.duration - minutes * 60);
        //  console.log(video._id)
        return (
          <Col lg={7} md={10} xs={24} key={index}>
            <ImgDiv>
              {/*lg:가장클때 6그리드를쓰겠다. md:중간크기일때 8그리드를 쓰겠다. 
                xs:가장작은 크기일때는 24그리드를 쓰겠다. 총24그리드 */}
              <div style={{ position: 'relative' }}>
                <a href={`/videos/${video._id}`}>
                  <img
                    style={{
                      width: '95%',
                      marginTop: '5px',
                      borderRadius: '5px',
                    }}
                    alt='thumbnail'
                    src={`http://localhost:5000/${video.thumbnail}`}
                  />
    
                  <div
                    className='duration'
                    style={{
                      bottom: 0,
                      right: 0,
                      position: 'absolute',
                      margin: '4px',
                      color: '#fff',
                      backgroundColor: 'rgba(17, 17, 17, 0.8)',
                      opacity: 0.8,
                      padding: '2px 4px',
                      borderRadius: '2px',
                      letterSpacing: '0.5px',
                      fontSize: '12px',
                      fontWeight: '500',
                      lineHeight: '12px',
                    }}>
                    <span>
                      {minutes} : {seconds}
                    </span>
                  </div>
                </a>
              </div>
              <br />
              <Meta
                avatar={<Avatar src={video.writer.image} size={45} />}
                title={video.title}
                style={{ marginLeft: '10px'}}
              />
              <TextBox>
                <span>{video.writer.name} </span>
                <br />
                <span style={{ marginLeft: '3rem' }}>
                  {' '}
                  조회수 {video.views}
                </span>
                <span>
                  {' '}
                  {moment(video.createdAt).format('MMM Do YY')}{' '}
                </span>
                <br />
                <br />
              </TextBox>
            </ImgDiv>
          </Col>
        );
      });

    return (
          <div>
            <MainDiv>
            
                <div style={{
                    fontSize: "50px",
                    color:"black",
                    marginBottom: "-2%",
                    width: "1340px"
                    // marginLeft: "20%"
                }}>
                    My ConTent ! !
                    <hr />
                </div>
                <div
                  style={{
                    width: "100%",
                    margin: "3rem auto",
                  }}
                >{
                  renderCards.length === 0 ?  <div style={{ height: "40vh" }}><p style={{fontSize:"4rem"}}> 관리자 계정이 아니거나</p><p style={{fontSize:"4rem"}}>서바이벌 컨텐츠가 없습니다 !</p></div>
                 : 
                 <div>
                 <Title level={0}>Survivals</Title>
                 <hr />

                 <Row
								style={{
									width: '100%',
									display: 'inline-flex',
									justifyContent: 'center',
									marginBottom: '50px',
								}}
								gutter={16}>
                    {renderCards}</Row>
                 </div>
                 }
                  <Title level={0}>General Contents</Title>
							<hr />
							<Row
								style={{
									width: '100%',
									display: 'inline-flex',
									justifyContent: 'center',
									marginBottom: '50px',
								}}
								gutter={16}>
								{renderUserCards}
							</Row>
                </div>
              
              </MainDiv>   
              </div>
                

      );
}

export default MyConTent;

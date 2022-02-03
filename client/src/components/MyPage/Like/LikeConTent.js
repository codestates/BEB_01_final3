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
    margin-left: 25%;
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

function LikeNft () {
    const user = useSelector(state=> state.user.userData)


    const [Likes, setLikes] = useState('');
    const [Video, setVideo] = useState([]);
    const [UserVideo, setUserVideo] = useState([]);
    const [nft, setNft] = useState([]);
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const { Title } = Typography;

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
            if(Likes[i].videoId && Likes[i].userId === user._id) {
                res[k] = Likes[i].videoId;
                k = k + 1;
            } 
    }
    
    const result = [];
    for (let i = 0; i < Video.length; i++){
        result[i] = Video[i];
    }

    const LikeContent = [];
    for(let i = 0 ; i < res.length; i++) {
        for(let k = 0; k < result.length; k++){
            if(res[i] === result[k]._id){
                LikeContent[i] = result[k]
            } 
        }
    }

    const res1 = [];
    // let k = 0;
    for(let i = 0; i < Likes.length; i++){
            if(Likes[i].videoId && Likes[i].userId === user._id) {
                res1[k] = Likes[i].videoId;
                k = k + 1;
            } 
    }
    
    const result1 = [];
    for (let i = 0; i < UserVideo.length; i++){
        result1[i] = UserVideo[i];
    }

    const LikeContent1 = [];
    for(let i = 0 ; i < res1.length; i++) {
        for(let k = 0; k < result1.length; k++){ 
            if(res1[i] === result1[k]._id){
                LikeContent1[i] = result1[k]
            }
        }
    }

      const renderCards = LikeContent.map((video, index) => {
        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor(video.duration - minutes * 60);
    
        return (
          <Col lg={7} md={10} xs={24} key={index} style={{color:"white", margin:"1% 1% 1% 1%", paddingBottom:"1%", borderBottom:"solid white", width:"80vw"}}>
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

      const renderUserCards = LikeContent1.map((video, index) => {
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

    return(
        <div style={{}}>
          <MainDiv>
            <div style={{
                fontSize: "50px",
                color: "black",
                marginBottom: "-2%"
                // background:'black',
                // marginBottom:"2%"
            }}>
                My Favorite ConTent ! !
                <hr />
            </div>
            
            <div style={{
                width: "100%",
                margin: "3rem auto",
                // textAlign:"center",

                // marginRight: "250px",
            }}>
              <Title level={0}>Survival Contents</Title>
              <Row
								style={{
									width: '100%',
									display: 'inline-flex',
									justifyContent: 'center',
									marginBottom: '50px',
								}}
								gutter={16}>
                  {renderCards}</Row>
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
        
    )


}

export default LikeNft
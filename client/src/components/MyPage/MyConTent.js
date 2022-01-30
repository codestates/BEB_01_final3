import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Card, Avatar, Col, Typography, Row } from "antd";
import "antd/dist/antd.css";
import { Layout, Menu } from "antd";
import moment from "moment";
import { UserAddOutlined } from "@ant-design/icons";


function MyConTent () {

    const [Video, setVideo] = useState([]);
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
    // console.log("video", Video);

    const userVideo = [];
    for(let i = 0; i < Video.length; i++){
      if(Video[i].writer._id === user._id) {
        userVideo[i] = Video[i];
      }
    }

    // console.log(userVideo);
    const renderCards = userVideo.map((video, index) => {
        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor(video.duration - minutes * 60);
    
        return (
          <Col lg={7} md={10} xs={24} key={index} style={{color:"white", margin:"1% 1% 1% 1%", paddingBottom:"1%", borderBottom:"solid white"}}>
            {/*lg:가장클때 6그리드를쓰겠다. md:중간크기일때 8그리드를 쓰겠다. 
                xs:가장작은 크기일때는 24그리드를 쓰겠다. 총24그리드 */}
            <div style={{ position: "relative", }}>
              <a href={`/video/${video._id}/counterpage`}>
                <img
                  style={{ width: "100%" }}
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

    return (

            <div style={{width: "100%"}}>
                <div style={{
                    fontSize: "50px",
                    // marginBottom:"2%"
                    color:"white",
                    marginBottom: "-2%"
                }}>
                    My ConTent ! !
                </div>
                <div
                  style={{
                    width: "100%",
                    margin: "3rem auto",
                    // marginRight: "250px",
                  }}
                >{renderCards.length === 0 ?  <div style={{ height: "40vh" }}><p style={{fontSize:"4rem"}}> 를 소유하고 있지 않습니다.</p></div>
                 : 
                 <Row gutter={16}>{renderCards}</Row>}
                  
                </div>
            </div>
                

      );
}

export default MyConTent;

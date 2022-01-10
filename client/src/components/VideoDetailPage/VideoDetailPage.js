import React, { useState, useEffect } from 'react';
import { Row, Col, Avatar, List } from 'antd';
import axios from 'axios';
import { useParams } from "react-router-dom";
import SideVideo from './Sections/SideVideo';
import Subscribe from './Sections/Subscribe';

function VideoDetailPage(props) {

    const videoId = useParams().videoId;
    //랜딩페이지에서 주소창뒤에 videoId를 보내주고있기때문에가능
    const variable = { videoId: videoId };
    const [VideoDetail, setVideoDetail] = useState([]);

    useEffect(() => {
        axios.post('/api/video/getVideoDetail', variable).then((response) => {
            if (response.data.success) {
                console.log('getvideodata', response.data);
                setVideoDetail(response.data.videoDetail);
            } else {
                alert('비디오 정보를 가져오길 실패했습니다.');
            }
        });
    }, []);

    if (VideoDetail.writer) {
        const subscribeButton = VideoDetail.writer._id !==
            localStorage.getItem('userId') && (
                <Subscribe
                    userTo={VideoDetail.writer._id}
                    userFrom={localStorage.getItem('userId')}
                /> //만약 페이지의 동영상이 본인의 동영상이면 구독버튼을 안보이게만든다.
            );
        //witer를 서버에서 가져오기전에 페이지를 렌더링 할려고해서
        //VideoDetail.writer.image 부분에서 type error가 발생한다.
        return (
            <Row gutter={(16, 16)}>
                <Col lg={18} xs={24}>
                    <div style={{ width: '100%', padding: '3rem 4rem' }}>
                        <video
                            style={{ width: '100%' }}
                            src={`http://localhost:5000/${VideoDetail.filePath}`}
                            controls
                        />
                        <List.Item actions={[subscribeButton]}>
                            <List.Item.Meta
                                avatar={<Avatar src={VideoDetail.writer.image} />}
                                title={VideoDetail.writer.name}
                                description={VideoDetail.description}
                            />
                        </List.Item>
                        {/* comment*/}
                    </div>
                </Col>

                <Col lg={6} xs={24}>
                    <SideVideo />
                </Col>
            </Row>
        );
    } else {
        return <div>...loding</div>;
    }
}

export default VideoDetailPage;
import React, { useState, useEffect } from 'react';
import { Row, Col, Avatar, List } from 'antd';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import SideVideo from './Sections/SideVideo';
import Subscribe from './Sections/Subscribe';
import Comment from './Sections/Comment';
import LikeDisLike from './Sections/LikeDisLike';

import './style.css';

function VideoDetailPage(props) {
	const videoId = useParams().videoId;
	//랜딩페이지에서 주소창뒤에 videoId를 보내주고있기때문에가능
	const variable = { videoId: videoId };
	const [VideoDetail, setVideoDetail] = useState([]);
	const [Comments, setComments] = useState([]);

	console.log(videoId);

	useEffect(() => {
		axios.post('/api/video/getVideoDetail', variable).then((response) => {
			if (response.data.success) {
				console.log('getvideodata', response.data);
				setVideoDetail(response.data.videoDetail);
			} else {
				alert('비디오 정보를 가져오길 실패했습니다.');
			}
		});

		axios.post('/api/comment/getComments', variable).then((response) => {
			if (response.data.success) {
				setComments(response.data.comments);
				// console.log('getComments', response.data.comments)
			} else {
				alert('댓글 정보 가져오기 실패');
			}
		});
		//모든 comment 정보를 받는다 getComment
		//api 완성을 위해 라우터 comment로 이동
	}, []);

	if (VideoDetail.writer) {
		console.log('VD', VideoDetail)
		const subscribeButton = VideoDetail.writer._id !==
			localStorage.getItem('userId') && (
			<Subscribe
				userTo={VideoDetail.writer._id}
				userFrom={localStorage.getItem('userId')}
			/> //만약 페이지의 동영상이 본인의 동영상이면 구독버튼을 안보이게만든다.
		);
		//witer를 서버에서 가져오기전에 페이지를 렌더링 할려고해서
		//VideoDetail.writer.image 부분에서 type error가 발생한다.

		const refreshpage = (newComment) => {
			//부모의 Comments state값을 업데이트하기위한 함수
			setComments(Comments.concat(newComment)); //자식들한테 값을 전달받아 Comments값 업데이트
		};

		//   console.log('videoId', videoId)
		//   console.log('user', user.userData._id)
		return (
			<div style={{paddingTop: "70px", height: "100%"}}>
			<Row gutter={(16, 16)}>
				<Col lg={18} xs={24}>
					<div style={{ width: '100%', padding: '3rem 4rem' }}>
						<video
							style={{ width: '100%' }}
							src={`http://localhost:5000/${VideoDetail.filePath}`}
							controls
						/>

						<div
							style={{
								width: '30%',
							}}>
							<List.Item>
								<List.Item.Meta title={VideoDetail.title} />
							</List.Item>
						</div>
						<hr />

						<List.Item
							actions={[
								<LikeDisLike
									video
									userId={localStorage.getItem('userId')}
									VideoId={videoId}
								/>,
								subscribeButton,
							]}>
							<div style={{ width: '30%', padding: '3rem 4rem' }}>
								<List.Item.Meta
									avatar={
										<Avatar
											src={VideoDetail.writer.image}
										/>
									}
									title={VideoDetail.writer.name}
									description={VideoDetail.description}
								/>
							</div>
						</List.Item>
						<hr />

						<Comment
							refreshpage={refreshpage}
							commentLists={Comments}
						/>
						{/*Comment.js파일 컴포넌트에서 받음 */}
						{/* <CounterPage setVideoDetail /> */}
					</div>
				</Col>

				<Col lg={6} xs={24}>
					<SideVideo />
				</Col>
			</Row>
			</div>
		);
	} else {
		return <div>...loding</div>;
	}
}

export default VideoDetailPage;

//LoginPage.js 에서
//로그인할때 로컬스토리지에
//window.localStorage.setItem('userId', response.payload.userId);
// 데이터 저장하기 localStorage.setItem(key, value);
// 데이터 불러오기 localStorage.getItem(key);
// 데이터 삭제 localStorage.removeItem(key)
// 모든 것 삭제 localStorage.clear()
// index에 해당하는 키 소환 localStorage.key(index)
// 저장된 항목의 수 localStorage.length

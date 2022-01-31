import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import { Facoad } from 'react-icons/fa'
import { Card, Avatar, Col, Typography, Row } from 'antd';
import moment from 'moment';
import 'antd/dist/antd.css';
import '../../index.css';
import { Layout, Menu } from 'antd';
import {
	BankOutlined,
	LaptopOutlined,
	NotificationOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import SideBar from '../NavBar/SideMainBar';
import Slider from 'react-slick';
import styled from 'styled-components';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// syled

const StyledSlider = styled(Slider)`
	.slick-slide div {
		outline: none;
	}
	/* .slick-list {
		//슬라이드 스크린
		width: 100%;
		height: 100%;
		margin: 0 auto;
		overflow-x: hidden;
	}
	 .slick-slide div {
		//슬라이더  컨텐츠
		 cursor: pointer; 
	}

	.slick-dots {
		//슬라이드의 위치
		bottom: 20px;
		margin-top: 200px;
	}

	.slick-track {
		//이건 잘 모르겠음
		width: 100%;
	}  */
`;

const Container = styled.div`
	overflow: hidden;
`;

const ImageContainer = styled.div`
	margin: 3px 5px;
	height: 10%;
	width: 10%;
	justify-content: center;
`;

const Image = styled.img`
	/* max-width: 100%;
	max-height: 100%; */
	width: 50vw;
	height: 60vh;
	justify-content: center;
`;

// syled

const { SubMenu } = Menu;
const { Content, Sider } = Layout;
const { Title } = Typography;
const { Meta } = Card;

function LandingPage() {
	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 2000,
	};
	const [Video, setVideo] = useState([]);
	const [UserVideo, setUserVideo] = useState([]);
	// const [Category, setCategory] = useState([]);
	useEffect(() => {
		axios.get('/api/video/getVideos').then((response) => {
			if (response.data.success) {
				console.log('랜딩페이지', response.data);
				setVideo(response.data.videos);
				// console.log('카테고리', response.data.videos.category)
				// setCategory(response.data.videos.category)
			} else {
				alert('비디오 가져오기를 실패했습니다.');
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

	console.log('SV', Video);
	console.log('UV', UserVideo);

	const renderCards = Video.map((video, index) => {
		var minutes = Math.floor(video.duration / 60);
		var seconds = Math.floor(video.duration - minutes * 60);
		// console.log(video._id)
		return (
			<Col>
				{/* lg={7} md={10} xs={24} key={index} */}
				{/*lg:가장클때 6그리드를쓰겠다. md:중간크기일때 8그리드를 쓰겠다. 
            xs:가장작은 크기일때는 24그리드를 쓰겠다. 총24그리드 */}
				<div style={{ position: 'relative' }}>
					<a href={`/video/${video._id}/counterpage`}>
						<img
							style={{ width: '100%' }}
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
								padding: '2px 6px',
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
					// avatar={<Avatar src={video.writer.image} />}
					title={video.title}
					style={{ marginBottom: '-8%', marginTop: '-6%' }}
				/>
				{/* <span>{video.writer.name} </span> */}
				<br />
				{/* style={{ marginLeft: "3rem" }} */}
				<span>조회수 {video.views}회</span>
				<br />
				<span> {moment(video.createdAt).format('MMM Do YY')} </span>
			</Col>
		);
	});

	const renderUserCards = UserVideo.map((video, index) => {
		var minutes = Math.floor(video.duration / 60);
		var seconds = Math.floor(video.duration - minutes * 60);
		//  console.log(video._id)
		return (
			<Col lg={7} md={10} xs={24} key={index}>
				{/*lg:가장클때 6그리드를쓰겠다. md:중간크기일때 8그리드를 쓰겠다. 
            xs:가장작은 크기일때는 24그리드를 쓰겠다. 총24그리드 */}
				<div style={{ position: 'relative' }}>
					<a href={`/videos/${video._id}`}>
						<img
							style={{ width: '100%' }}
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
					avatar={<Avatar src={video.writer.image} />}
					title={video.title}
				/>
				<span>{video.writer.name} </span>
				<br />
				<span style={{ marginLeft: '3rem' }}> {video.views}</span>-
				<span> {moment(video.createdAt).format('MMM Do YY')} </span>
			</Col>
		);
	});

	return (
		<Layout style={{ paddingTop: '70px' }}>
			<Layout>
				<SideBar width={300} />
				<Layout>
					<Content>
						<div
							style={{
								// width: '70%',
								height: '70%',
								width: '100%',
								// margin: 100,
								// margin: '10px 0px 0px 20%',
								// marginRight: "200px",
							}}>
							<Title level={0}>Survivals</Title>
							<hr />
							{/* <Row gutter={16}>{renderCards}</Row> */}
							{/* <Container> */}
							<div
								style={{
									width: '100%',
									// height: '100%',
									height: '500px',
									backgroundColor: 'gray',
									// margin: 10,
									padding: 45,
									// justifyContent: 'center',
								}}>
								<StyledSlider {...settings}>
									{Video.map((item) => {
										return (
											<div key={item.id}>
												<ImageContainer>
													<a
														href={`/video/${item._id}/counterpage`}>
														<Image
															src={`http://localhost:5000/${item.thumbnail}`}
														/>
													</a>
												</ImageContainer>
											</div>
										);
									})}
								</StyledSlider>
							</div>
							{/* </Container> */}
							<hr />
							<Title level={0}>General Contents</Title>
							<hr />
							<Row gutter={16}>{renderUserCards}</Row>
						</div>
					</Content>
				</Layout>
			</Layout>
		</Layout>
	);
}

export default LandingPage;

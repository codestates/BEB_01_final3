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
const SliderBackDiv = styled.div`
	background: linear-gradient(
		20deg,
		#00c3ff,
		#ffff1c /* #77A1D3,
  #79CBCA,
  #E684AE */
	);
	height: 500px;
	width: 100%;
	padding: 45;
`;

const StyledSlider = styled(Slider)`
	.slick-list div {
		//슬라이드 스크린
		width: 100%;
		height: 100%;
		/* margin: 0 auto; */
		overflow-x: hidden;
		order: 0;
		.slick-arrow .slick-prev div {
		}
		.slick-arrow .slick-next div {
		}
	}
	.slick-slider div {
		outline: none;
		order: 0;
	}
`;

const ImageContainer = styled.div`
	margin: 3px 5px;
	margin-top: 30px;
	height: 10%;
	width: 10%;
	justify-content: center;
	display: inline-flex;
`;

const Image = styled.img`
	/* max-width: 100%;
	max-height: 100%; */
	width: 700px;
	height: 400px;
	display: flex;
	justify-content: center;
`;
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
`;
// syled

function SampleNextArrow(props) {
	const { className, style, onClick } = props;
	return (
		<div
			// className={className}
			className={className}
			style={{
				...style,
				display: 'block',
				// background: 'black',
				right: '25px',
			}}
			onClick={onClick}
		/>
	);
}

function SamplePrevArrow(props) {
	const { className, style, onClick } = props;
	return (
		<div
			className={className}
			style={{
				...style,
				display: 'block',
				left: '25px',
				zIndex: 1,
			}}
			onClick={onClick}
		/>
	);
}

const { SubMenu } = Menu;
const { Content, Sider } = Layout;
const { Title } = Typography;
const { Meta } = Card;

function LandingPage() {
	const settings = {
		slide: 'div',
		arrows: true,
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 3500,
		prevArrow: <SamplePrevArrow />,
		nextArrow: <SampleNextArrow />,
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

	const renderUserCards = UserVideo.map((video, index) => {
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
						style={{ marginLeft: '10px' }}
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
		<Layout style={{ paddingTop: '70px' }}>
			<Layout>
				<SideBar width={300} />
				<Layout>
					<Content>
						<div
							style={{
								height: '70%',
								width: '100%',
							}}>
							<Title level={0}>Survivals</Title>
							<hr />
							{/* <Row gutter={16}>{renderCards}</Row> */}
							{/* <Container> */}
							<SliderBackDiv>
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

												<div>{item.title}</div>
											</div>
										);
									})}
								</StyledSlider>
							</SliderBackDiv>
							{/* </Container> */}
							<hr />
							<Title level={0}>General Contents</Title>
							<hr />
							<Row
								style={{
									width: '80%',
									display: 'inline-flex',
									justifyContent: 'center',
									marginBottom: '50px',
								}}
								gutter={16}>
								{renderUserCards}
							</Row>
						</div>
					</Content>
				</Layout>
			</Layout>
		</Layout>
	);
}

export default LandingPage;

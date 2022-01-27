import React, { useEffect, useState } from 'react';
import '../../App.css';
import Sidebar from './DevComponent/Sidebar';
import Layout, { Content } from 'antd/lib/layout/layout';
import { Button, Card } from 'react-bootstrap';
import Avatar from 'antd/lib/avatar/avatar';
import wtImg from '../img/wtimg.png';
import axios from 'axios';
import { default as Spinner } from './Spinner';
import { Form, Col, Row } from 'antd';

function Minting() {
	const [totalWT, setTotalWT] = useState(0);
	const [serverWTAmount, setServerWTAmount] = useState(0);
	const [totalNWT, setTotalNWT] = useState(0);
	const [serverNWTAmount, setServerNWTAmount] = useState(0);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		async function getTokens() {
			try {
				const res = await axios.get('/api/contract/totalTokens');
				const tokens = await res.data;
				setTotalWT(tokens.data.totalWT);
				setTotalNWT(tokens.data.totalNWT);
				setServerWTAmount(tokens.data.serverWT);
				setServerNWTAmount(tokens.data.serverNWT);
			} catch (err) {
				console.log(err);
			}
		}
		getTokens();
	}, []);

	const onSubmitWT = async (e) => {
		// console.log('WT token');
		setIsLoading(true);
		await axios
			.get('/api/contract/token/faucetWT')
			.then((res) => {
				// console.log(res);
				setIsLoading(false);
				alert('WT 추가 발급 완료');
				window.location.reload();
			})
			.catch((err) => {
				setIsLoading(false);
				alert('WT 추가 발급 오류');
				// console.log(err);
			});
	};

	const onSubmitNWT = async (e) => {
		// console.log('NWT token');
		setIsLoading(true);
		await axios
			.get('/api/contract/token/faucetNWT')
			.then((res) => {
				setIsLoading(false);
				alert('NWT 추가 발급 완료');
				window.location.reload();
			})
			.catch((err) => {
				setIsLoading(false);
				alert('NWT 추가 발급 오류');
			});
	};
	return (
		<Layout>
			<Layout width={300} className='ant-layout-has-sider' style={{paddingLeft: "350px"}}>
				<Layout>
					<Content>
						<form
							style={{
								display: 'flex',
								// justifyContent: "center",
								// marginLeft: "0"
							}}>
							<Card
								style={{
									width: '22rem',
									margin: '80px',
									marginTop: '40px',
								}}>
								<Card.Body>
									<Card.Title>
										현재 개시된 Survival Contents 수
									</Card.Title>
									<Card.Text>개</Card.Text>
									<hr />
									<Card.Title>
										현재 개시된 Contents 수
									</Card.Title>
									<Card.Text>개</Card.Text>
									<hr />
									<Card.Title>현재 이용자 수</Card.Title>
									<Card.Text>명</Card.Text>
								</Card.Body>
							</Card>
							{isLoading ? (
								<Spinner />
							) : (
								<Form
									style={{
										display: 'flex',
										justifyContent: 'center',
									}}>
									<Card
										style={{
											width: '18rem',
											margin: '40px',
											marginTop: '40px',
										}}>
										<div>
											<Avatar
												size={150}
												src={wtImg}
												alt
												style={{
													margin: '10px',
												}}
											/>
										</div>
										<Card.Body>
											<Card.Title>WT</Card.Title>
											<hr />
											<Card.Text>WT 총 발행량</Card.Text>
											{totalWT}
											<Card.Text>개</Card.Text>
											<hr />
											<Card.Text>
												WT 서버 보유량
											</Card.Text>
											{serverWTAmount}
											<Card.Text>개</Card.Text>
											<hr />
											<Button
												variant='danger'
												size='md'
												className='me-1'
												onClick={onSubmitWT}>
												WT 추가 발행
											</Button>
										</Card.Body>
									</Card>

									<Card
										style={{
											width: '18rem',
											margin: '40px',
											marginTop: '40px',
										}}>
										<div>
											<Avatar
												size={150}
												src={''}
												alt
												style={{
													margin: '10px',
												}}
											/>
										</div>
										<Card.Body>
											<Card.Title>NWT</Card.Title>
											<hr />
											<Card.Text>NWT 총 발행량</Card.Text>
											{totalNWT}
											<Card.Text>개</Card.Text>
											<hr />
											<Card.Text>
												NWT 서버 보유량
											</Card.Text>
											{serverNWTAmount}
											<Card.Text>개</Card.Text>
											<hr />
											<Button
												variant='danger'
												size='md'
												className='me-1'
												onClick={onSubmitNWT}>
												NWT 추가 발행
											</Button>
										</Card.Body>
									</Card>
								</Form>
							)}
						</form>
					</Content>
				</Layout>
			</Layout>
		</Layout>
	);
}

export default Minting;

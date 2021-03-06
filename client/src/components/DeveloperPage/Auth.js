import React, { useEffect, useState } from 'react';
import '../../App.css';
import Layout, { Content } from 'antd/lib/layout/layout';
import { Button, Card, ListGroup, ListGroupItem } from 'react-bootstrap';
import axios from 'axios';
import { Form, Col, Row } from 'antd';
import wtImg from './basic.png';
import BootstrapSwitchButton from 'bootstrap-switch-button-react';
import styled from 'styled-components';
import Spinner from '../spinner/nftListSpinner'

const Box = styled.div`
box-shadow: 4px 12px 30px 6px rgb(0 0 0 / 25%);
margin: 20px;
margin-Top: 40px;
display: flex;
justify-content: center;
border-radius: 10px;
/* margin-left: 150px; */
`;

function Auth() {
	const [addOwner, setAddOwner] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [pk, setPk] = useState('');
	const [list, setList] = useState([
		{
			// idx: 0,
			name: '',
			email: '',
			publicKey: '',
			role: '',
			img: '',
			checkAuth: false,
			checkOwner: 0,
		},
	]);
	const [currentWT, setCurrentWT] = useState('');
	const [currentNWT, setCurrentNWT] = useState('');
	// const [PublicKey, setPublicKey] = useState('');
	useEffect(() => {
		async function getList() {
			try {
				const res = await axios.get('/api/users/serverList');

				const server = res.data.serverInfo;
				const currentWT = res.data.totalCurrentWT;
				const currentNWT = res.data.totalCurrentNWT;
				// console.log('server', server);
				const inputData = server.map((rowData) => ({
					name: rowData.name,
					email: rowData.email,
					publicKey: rowData.publicKey,
					role: rowData.role,
					img: rowData.image,
					checkAuth: rowData.checkAuth,
					checkOwner: rowData.checkOwner,
				}));
				setCurrentWT(currentWT);
				setCurrentNWT(currentNWT);
				setList(list.concat(inputData));
			} catch (err) {
				console.log(err);
			}
		}
		getList();
	}, []);

	const toggleClick = (e) => {
		const publicKey = e.publicKey;
		// e 값이 boolean 값
		setIsLoading(true);
		if (e.checkAuth === false) {
			axios
				.post('/api/users/serverAddOwner', {
					publicKey,
				})
				.then((res) => {
					setIsLoading(false);
					console.log('여기는 프론트', res);
					alert('권한 부여 완료');
					window.location.reload();
				})
				.catch((err) => {
					setIsLoading(false);
					console.log(err);
					alert('권한 부여 실패');
					window.location.reload();
				});
			console.log('aaa');
		} else {
			axios
				.post('/api/users/serverRemoveOwner', { publicKey })
				.then((res) => {
					setIsLoading(false);
					console.log('여기는 프론트', res);
					alert('권한 삭제 완료');
					window.location.reload();
				})
				.catch((err) => {
					setIsLoading(false);
					console.log(err);
					alert('권한 삭제 실패');
					window.location.reload();
				});
		}
	};

	// function toggleClick(e) {
	// 	setPublicKey(e);
	// }
	return (
		<Layout width={300} className='ant-layout-has-sider' style={{paddingLeft: "0px", paddingTop: "20px",}}>
			<Content>
				<div style={{ }}>
					<div>각 서버계정의 현 보유 토큰 총 량</div>
					<div>wt : {currentWT}</div>
					<div>nwt : {currentNWT}</div>
				</div>
				{isLoading ? (
					<Spinner />
				) : (
					<form
						style={{
							display: 'flex',
							flexWrap: 'wrap',
							justifyContent: 'center',
							// margin: '1%',
						}}>
						{list.map((data) => {
							if (data.name !== '') {
								return (
								<Box>
									<Card
										// key={idx}
										style={{
											width: '18rem',
											height: '27rem',
											// margin: '1%',
										}}>
										{data.img === undefined ? (
											<Card.Img
												variant='top'
												src={wtImg}
												alt
												style={{
													// margin: '1px',
													width: '18rem',
													height: '15.5vh',
													justifyContent: 'center',
												}}
											/>
										) : (
											<Card.Img
												variant='top'
												src={data.img}
												alt
												style={{
													// margin: '1px',
													width: '18rem',
													height: '15.5vh',
													justifyContent: 'center',
												}}
											/>
										)}
										<Card.Body>
											<Card.Title>
												name : {data.name}
											</Card.Title>
											<Card.Text>
												publicKey : {data.publicKey}
											</Card.Text>
										</Card.Body>
										<ListGroup className='list-group-flush'>
											<ListGroupItem>
												email : {data.email}
											</ListGroupItem>
											<ListGroupItem>
												role : {data.role}
											</ListGroupItem>
										</ListGroup>
										<Card.Body>
											{data.checkOwner === 1 ? (
												'최고관리자'
											) : (
												<BootstrapSwitchButton
													checked={data.checkAuth}
													onstyle='dark'
													size='lg'
													onChange={() => {
														toggleClick({
															publicKey:
																data.publicKey,
															checkAuth:
																data.checkAuth,
														});
													}}
												/>
											)}
										</Card.Body>
									</Card>
									</Box>
								);
							}
						})}
					</form>
				)}
			</Content>
		</Layout>
	);
}

export default Auth;

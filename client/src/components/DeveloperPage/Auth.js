import React, { useEffect, useState } from 'react';
import '../../App.css';
import Layout, { Content } from 'antd/lib/layout/layout';
import { Button, Card, ListGroup, ListGroupItem } from 'react-bootstrap';
import axios from 'axios';
import { Form, Col, Row } from 'antd';
import wtImg from './basic.png';
import BootstrapSwitchButton from 'bootstrap-switch-button-react';
import { default as Spinner } from './Spinner';
// import Toggle from 'react-bootstrap-toggle';

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
		<Layout width={300} className='ant-layout-has-sider'>
			<Content>
				<div>각 서버계정의 현 보유 토큰 총 량</div>
				<div>wt : {currentWT}</div>
				<div>nwt : {currentNWT}</div>
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
									<Card
										// key={idx}
										style={{
											width: '18rem',
											height: '27rem',
											// flexWrap: 'wrap',
											margin: '1%',
										}}>
										{data.img === undefined ? (
											<Card.Img
												// size={100}

												variant='top'
												src={wtImg}
												alt
												style={{
													margin: '1px',
													width: '15vw',
													height: '15.5vh',
													justifyContent: 'center',
												}}
											/>
										) : (
											<Card.Img
												// size={100}

												variant='top'
												src={data.img}
												alt
												style={{
													margin: '1px',
													width: '15vw',
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
											{/* <Button variant='primary'>
											Add Ownership
										</Button> */}
											{data.checkOwner === 1 ? (
												'최고관리자'
											) : (
												<BootstrapSwitchButton
													checked={data.checkAuth}
													onstyle='dark'
													size='lg'
													// key={data.publicKey}
													// onChange={toggleClick}
													onChange={() => {
														toggleClick({
															publicKey:
																data.publicKey,
															checkAuth:
																data.checkAuth,
														});
													}}
													// onClick={toggleClick(
													// 	data.publicKey
													// )}
												/>
											)}
										</Card.Body>
									</Card>
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

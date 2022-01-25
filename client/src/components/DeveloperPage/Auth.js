import React, { useEffect, useState } from 'react';
import '../../App.css';
import Layout, { Content } from 'antd/lib/layout/layout';
import { Button, Card, ListGroup, ListGroupItem } from 'react-bootstrap';
import axios from 'axios';
import { Form, Col, Row } from 'antd';
import wtImg from './basic.png';
import BootstrapSwitchButton from 'bootstrap-switch-button-react';
// import Toggle from 'react-bootstrap-toggle';

function Auth() {
	const [addOwner, setAddOwner] = useState(false);
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

	useEffect(() => {
		async function getList() {
			try {
				const res = await axios.get('/api/users/serverList');

				const server = res.data.serverInfo;
				const currentWT = res.data.totalCurrentWT;
				const currentNWT = res.data.totalCurrentNWT;
				console.log(server);
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

	const onChange = (e) => {
		console.log('클릭함');
		console.log(e.target.value);
	};

	// setInfoData((prevState) => ({
	// 	...prevState,
	// 	major: {
	// 	  ...prevState.major,
	// 	  name: "Tan Long",
	// 	}
	//   }));

	// const onToggle = id => {
	// 	setUsers(users.map(
	// 	  user => user.id === id
	// 	  ? {...user, active: !user.active}
	// 	  : user
	// 	))
	//   }

	const toggleClick = (e) => {
		// e 값이 boolean 값
		// console.log(e.target.value);
		console.log(e);
		console.log(e.id);
	};

	return (
		<Layout width={300} className='ant-layout-has-sider'>
			<Content>
				<div>각 서버계정의 현 보유 토큰 총 량</div>
				<div>wt : {currentWT}</div>
				<div>nwt : {currentNWT}</div>
				<form
					style={{
						display: 'flex',
						flexWrap: 'wrap',
						justifyContent: 'center',
						// margin: '1%',
					}}>
					{/* <div> */}
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
											// <Toggle
											// 	onClick={this.onToggle}
											// 	on={<h2>ON</h2>}
											// 	off={<h2>OFF</h2>}
											// 	size='xs'
											// 	offstyle='danger'
											// 	active={this.state.toggleActive}
											// />
											<BootstrapSwitchButton
												checked={data.checkAuth}
												onstyle='dark'
												size='lg'
												id={data.publicKey}
												// key={data.publicKey}
												onChange={toggleClick}
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
					{/* </div> */}
				</form>
			</Content>
		</Layout>
	);
}

export default Auth;

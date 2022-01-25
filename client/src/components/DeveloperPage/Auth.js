import React, { useEffect, useState } from 'react';
import '../../App.css';
import Layout, { Content } from 'antd/lib/layout/layout';
import { Button, Card, ListGroup, ListGroupItem } from 'react-bootstrap';
import axios from 'axios';
import { Form, Col, Row } from 'antd';
import wtImg from './basic.png';

function Auth() {
	const [addOwner, setAddOwner] = useState(false);
	const [list, setList] = useState([
		{
			name: '',
			email: '',
			publicKey: '',
			role: '',
			img: '',
		},
	]);

	useEffect(() => {
		async function getList() {
			try {
				const res = await axios.get('/api/users/serverList');
				const server = res.data.serverInfo;
				const inputData = server.map((rowData) => ({
					name: rowData.name,
					email: rowData.email,
					publicKey: rowData.publicKey,
					role: rowData.role,
					img: rowData.image,
				}));
				setList(list.concat(inputData));
			} catch (err) {
				console.log(err);
			}
		}
		getList();
	}, []);

	return (
		<Layout width={300} className='ant-layout-has-sider'>
			<Content>
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
										<Button variant='primary'>
											Add Ownership
										</Button>
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

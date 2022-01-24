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

	// if (list.img !== "") {
	//     setList(userInfo.image);
	//   } else if (userInfo.image === "cryptoWT") {
	//     setProfile(wtImg);
	//   }

	// console.log(list);

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

									{/* variant="top"
                                        src={el.imgUri}
                                        style={{
                                            height:"100%"
                                        }} */}
									{/* 이미지 링크 넣기 */}
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

			{/* <Card style={{ width: '18rem' }}>
  <Card.Img variant="top" src="holder.js/100px180?text=Image cap" />
  <Card.Body>
    <Card.Title>Card Title</Card.Title>
    <Card.Text>
      Some quick example text to build on the card title and make up the bulk of
      the card's content.
    </Card.Text>
  </Card.Body>
  <ListGroup className="list-group-flush">
    <ListGroupItem>Cras justo odio</ListGroupItem>
    <ListGroupItem>Dapibus ac facilisis in</ListGroupItem>
    <ListGroupItem>Vestibulum at eros</ListGroupItem>
  </ListGroup>
  <Card.Body>
    <Card.Link href="#">Card Link</Card.Link>
    <Card.Link href="#">Another Link</Card.Link>
  </Card.Body>
</Card>  */}
		</Layout>
		// <div>
		// 	<span style={{ fontSize: '50px' }}>준비중입니다?</span>
		// </div>
	);
}

export default Auth;

import React, { useEffect, useState } from 'react';
import '../../App.css';
import Layout, { Content } from 'antd/lib/layout/layout';
import { Card } from 'react-bootstrap';
import Avatar from 'antd/lib/avatar/avatar';
import wtImg from '../img/wtimg.png';
import axios from 'axios';
import { default as Spinner } from './Spinner';
import { Form } from 'antd';
import WNTlogo from '../img/WNT-logo.png';
import styled from 'styled-components';


const Box = styled.div`
box-shadow: 4px 12px 30px 6px rgb(0 0 0 / 25%);
margin: 20px;
margin-Top: 40px;
display: flex;
justify-content: center;
margin-left: 150px;
`;
const Button = styled.button`
  border-radius: 5px;
  border: 1px solid red;
  padding: 5px;
  min-width: 120px;
  color: white;
  font-weight: 600;
  -webkit-appearance: none;
  background-color: red;
  box-shadow: 4px 12px 30px 6px rgb(0 0 0 / 9%);
  cursor: pointer;
  &:active,
  &:foucus {
    outline: none;
  }
  transition: all 0.2s ease-in-out;
&:hover {

  box-shadow: 4px 12px 20px 6px rgb(0 0 0 / 20%);
  transform: translateY(5px);

}
`;

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
							}}>
						<Box>
							<Card
								style={{
									width: '22rem',
								
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
							</Box>
							{isLoading ? (
								<Spinner />
							) : (
								<Form
									style={{
										display: 'flex',
										justifyContent: 'center',
									}}>
									<Box>
									<Card
										style={{
											width: '18rem'
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
									</Box>
									<Box>
									<Card
										style={{
											width: '18rem',
										
										}}>
										<div>
											<Avatar
												size={150}
												src={WNTlogo}
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
									</Box>
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

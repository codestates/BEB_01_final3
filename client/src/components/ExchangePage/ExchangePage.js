import React, { useState, useEffect } from 'react';
// import auth from '../../actions/user_action';
import { useNavigate } from 'react-router-dom';
import { Typography, Form, Input, Row, Col } from 'antd';
import axios from 'axios';
import { SwapOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { wtTokenExchange, nwtTokenExchange } from '../../actions/token_action';
import Spinner from '../spinner/nftListSpinner';
import styled from 'styled-components';

const AllBox = styled.div`
	box-shadow: 4px 12px 20px 6px rgb(0 0 0 / 20%);
	width: 100%;
	height: 25rem;
	border-radius: 4%;
	display: flex;
	justify-content: center;
`;

const Button = styled.button`
	border-radius: 5px;
	border: 1px solid #71b852;
	padding: 5px;
	min-width: 120px;
	color: white;
	font-weight: 600;
	-webkit-appearance: none;
	background-color: #7de7a6;
	box-shadow: 4px 12px 30px 6px rgb(0 0 0 / 15%);
	cursor: pointer;
	&:active,
	&:foucus {
		outline: none;
	}
	transition: all 0.2s ease-in-out;
	&:hover {
		box-shadow: 4px 12px 20px 6px rgb(0 0 0 / 40%);
		transform: translateY(5px);
	}
`;

// const { TextArea } = Input;
const { Title, Text } = Typography;

function ExchangePage() {
	// 현재 토큰 보유량 표시
	// 가격을 넣으면 상점으로 가기 -> 나중에
	// 가라로 가격을 넣었다 치고 그 가격에 맞는 토큰 지급
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [isLoading, setIsLoading] = useState(false);

	const [myWTTokens, setMyWTTokens] = useState(''); // 계정의 현재 보유 토큰양(WT)
	const [myNWTTokens, setMyNWTTokens] = useState(''); // 계정의 현재 보유 토큰양(NWT)

	const [WTBalance, setWTBalance] = useState(''); // 변환시킬 wt tokens
	const [NWTBalance, setNWTBalance] = useState('');
	const [Price, setPrice] = useState(''); // string 값ß

	// const user = useSelector((state) => state.user);
	// console.log('user token : ', user);

	const onPaymentChange = (e) => {
		setPrice(e.currentTarget.value);
	};

	const onWTBalanceChange = (e) => {
		setWTBalance(e.currentTarget.value);
	};

	// 유저의 보유 토큰량 표시
	useEffect(() => {
		async function getTokens() {
			try {
				const res = await axios.get('/api/users/tokens');
				const tokens = await res.data;
				setMyWTTokens(tokens.userTokens.wtToken);
				setMyNWTTokens(tokens.userTokens.nwtToken);
			} catch (err) {
				console.log(err);
			}
		}
		getTokens();
	}, []);

	const isNumber = (str) => {
		// 입력 값 숫자 확인
		return !/\D/.test(str);
	};

	// won -> wt
	const onSubmit1 = async (e) => {
		e.preventDefault(); //새로고침방지
		// console.log('Price: ', Price);

		if (!isNumber(Price)) {
			alert('숫자를 입력해라');
		} else {
			setIsLoading(true);
			dispatch(wtTokenExchange(Price)).then((response) => {
				// console.log(response);
				if (response.payload.success) {
					setIsLoading(false);
					alert('WT 교환 완료');
					setPrice('0');
					window.location.reload();
					// navigate('')
				} else {
					setIsLoading(false);
					alert('WT 교환 실패');
					setPrice('0');
				}
			});
		}
	};

	// wt -> nwt
	const onSubmit2 = (e) => {
		e.preventDefault(); //새로고침방지
		// console.log('WTBal : ', WTBalance);
		if (!isNumber(WTBalance)) {
			alert('숫자를 입력해라');
			// console.log('숫자가 아님');
			window.location.reload();
		} else {
			setIsLoading(true);
			dispatch(nwtTokenExchange(WTBalance)).then((response) => {
				// console.log(response);
				if (response.payload.success) {
					setIsLoading(false);
					alert('NWT 교환 완료');
					setPrice('0');
					window.location.reload();
				} else {
					setIsLoading(false);
					alert('NWT 교환 실패');
					setPrice('0');
				}
			});
		}
	};

	return (
		<div
			style={{
				maxWidth: '1000px',
				margin: '7rem auto',
			}}>
			<div
				style={{
					textAlign: 'center',
					marginBottom: '2rem',
				}}>
				<Title level={1}>
					<Text>Token Exchange</Text>
				</Title>
			</div>
			{isLoading ? (
				<Spinner />
			) : (
				<AllBox>
					<Form>
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								marginTop: '10px',
							}}></div>
						<label style={{ fontSize: 'x-large' }}>
							Token Balance
						</label>
						<br />
						<strong style={{ fontSize: 'large' }}>
							{myWTTokens} WT
						</strong>
						<br />
						<strong style={{ fontSize: 'large' }}>
							{myNWTTokens} NWT
						</strong>
						<br />
						<br />
						<Form.Item>
							<Row gutter={[50, 24]}>
								<Col span={12}>
									<label style={{ fontSize: 'large' }}>
										Payment
									</label>
									<Input
										onChange={onPaymentChange}
										value={Price}
									/>{' '}
									원
									<div>
										<strong style={{ fontSize: 'large' }}>
											{Price === ''
												? 0
												: parseInt(Price) / 1000}{' '}
											WT
										</strong>
									</div>
									<br />
									<SwapOutlined
										style={{ fontSize: '60px' }}
									/>
									<br />
									<Button
										type='primary'
										size='middle'
										onClick={onSubmit1}>
										exchange WT
									</Button>
								</Col>
								<br />
								<br />
								<Col span={12}>
									<label style={{ fontSize: 'large' }}>
										Exchange NWT
									</label>
									<Input
										onChange={onWTBalanceChange}
										value={WTBalance}
									/>{' '}
									WT
									<div>
										<strong style={{ fontSize: 'large' }}>
											{WTBalance === ''
												? 0
												: parseInt(WTBalance) / 5}{' '}
											NWT
										</strong>
									</div>
									<br />
									<SwapOutlined
										style={{ fontSize: '60px' }}
									/>
									<br />
									<Button
										type='primary'
										size='middle'
										onClick={onSubmit2}>
										exchange NWT
									</Button>
								</Col>
							</Row>
						</Form.Item>
					</Form>
				</AllBox>
			)}
		</div>
	);
}

export default ExchangePage;

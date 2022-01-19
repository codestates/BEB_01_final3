import React, { useState, useEffect } from 'react';
// import auth from '../../actions/user_action';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Form, Input, Row, Col } from 'antd';
import axios from 'axios';
import { SwapOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { wtTokenExchange, nwtTokenExchange } from '../../actions/token_action';
import { default as Spinner } from './Spinner';

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
				setMyWTTokens(tokens.wtToken);
				setMyNWTTokens(tokens.nwtToken);
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
				maxWidth: '700px',
				margin: '2rem auto',
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
				<Form>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
						}}></div>
					<label style={{ fontSize: 'x-large' }}>Token Balance</label>
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
								<SwapOutlined style={{ fontSize: '60px' }} />
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
								<SwapOutlined style={{ fontSize: '60px' }} />
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
			)}
		</div>
	);
}

export default ExchangePage;

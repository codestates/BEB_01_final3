const { User } = require('../models/User');
const Web3 = require('web3');
const web3 = new Web3(
	new Web3.providers.HttpProvider(
		'https://ropsten.infura.io/v3/c2cc008afe67457fb9a4ee32408bcac6'
	)
);

module.exports = {
	userJoin: async (req, res) => {
		//지갑을 생성하고 지갑을 추가해주는 메서드
		const account = await web3.eth.accounts.create(
			web3.utils.randomHex(32)
		);
		await web3.eth.accounts.wallet.add({
			address: account.address,
			privateKey: account.privateKey,
		});
		const userInfo = {
			...req.body,
			publicKey: account.address,
			privateKey: account.privateKey,
			wtToken: 5,
			nwtToken: 5,
			nftToken: '',
		};
		const user = new User(userInfo);

		user.save((err, userInfo) => {
			if (err) {
				res.json({ success: false, err });
				return;
			}
			console.log('ui', userInfo);
			res.status(200).json({
				success: true,
			});
		});
	},
	userLogin: (req, res) => {
		// console.log('ping')
		//요청된 이메일을 데이터베이스에서 있는지 찾는다.
		User.findOne({ email: req.body.email }, (err, user) => {
			// console.log('user', user)
			if (!user) {
				return res.json({
					loginSuccess: false,
					message: '제공된 이메일에 해당하는 유저가 없습니다.',
				});
			}

			//요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호 인지 확인.
			user.comparePassword(req.body.password, (err, isMatch) => {
				// console.log('err',err)

				// console.log('isMatch',isMatch)

				if (!isMatch)
					return res.json({
						loginSuccess: false,
						message: '비밀번호가 틀렸습니다.',
					});

				//비밀번호 까지 맞다면 토큰을 생성하기.
				user.generateToken((err, user) => {
					if (err) return res.status(400).send(err);

					// 토큰을 저장한다.  어디에 ?  쿠키 , 로컳스토리지
					res.cookie('x_auth', user.token)
						.status(200)
						.json({ loginSuccess: true, userId: user._id });
				});
			});
		});
	},

	Auth: (req, res) => {
		//여기 까지 미들웨어를 통과해 왔다는 얘기는  Authentication 이 True 라는 말.
		res.status(200).json({
			_id: req.user._id,
			isAdmin: req.user.role === 0 ? false : true,
			isAuth: true,
			email: req.user.email,
			name: req.user.name,
			lastname: req.user.lastname,
			role: req.user.role,
			image: req.user.image,
		});
	},
	userLogout: (req, res) => {
		// console.log('req.user', req.user)
		User.findOneAndUpdate(
			{ _id: req.user._id },
			{ token: '' },
			(err, user) => {
				if (err) return res.json({ success: false, err });
				return res.status(200).send({
					success: true,
				});
			}
		);
	},
	userTokens: (req, res) => {
		try {
			User.findOne({ _id: req.user._id }, (err, user) => {
				const userTokens = {
					wtToken: user.wtToken,
					nwtToken: user.nwtToken,
				};
				res.json(userTokens);
			});
		} catch (err) {
			res.json({ success: false, err });
		}
	},

	exchange_WTToken: (req, res) => {
		console.log('Aa');
		console.log(req.body);
		res.json({ success: true });
	},
};

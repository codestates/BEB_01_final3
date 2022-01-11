const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
	userJoin,
	userLogin,
	Auth,
	userLogout,
	test,
	userTokens,
} = require('../controller/api');

//회원 가입 할떄 필요한 정보들을  client에서 가져오면
//그것들을  데이터 베이스에 넣어준다.
router.post('/users/register', userJoin);

router.post('/users/login', userLogin);

router.get('/users/auth', auth, Auth);

router.get('/users/logout', auth, userLogout);

router.get('/users/tokens', auth, userTokens);

module.exports = router;

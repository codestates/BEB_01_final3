const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
// const {
// 	userJoin,
// 	userLogin,
// 	Auth,
// 	userLogout,
// 	userTokens,
// 	Search,
// 	setProfilImg,
// 	getServerList,
// 	addAuth,
// 	removeAuth,
// 	searchChannelPage,
// } = require('../controller/api');

const {
	userJoin,
	userLogin,
	Auth,
	userLogout,
	userTokens,
	Search,
	setProfilImg,
	getServerList,
	addAuth,
	removeAuth,
	searchChannelPage,

} = require('../controller/api');

const { KIP_userJoin } = require('../controller/caver_api');

// const { default: Search } = require('../../client/src/components/Search/Search');

//회원 가입 할떄 필요한 정보들을  client에서 가져오면
//그것들을  데이터 베이스에 넣어준다.
router.post('/users/register', KIP_userJoin);

router.post('/users/login', userLogin);

router.get('/users/auth', auth, Auth);

router.get('/users/logout', auth, userLogout);

router.get('/users/tokens', userTokens);

router.post('/users/setImg', auth, setProfilImg);

// server owner 계정들 가져오기
router.get('/users/serverList', auth, getServerList);

router.post('/users/serverAddOwner', auth, addAuth);

router.post('/users/serverRemoveOwner', auth, removeAuth);

router.post('/channel', auth, searchChannelPage);

// router.post('/users/Search', Search);

module.exports = router;

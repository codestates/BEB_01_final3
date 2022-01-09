const mongoose = require('mongoose');
// tokenId, nftName, imgUrl, description, 발행자:(주식회사Watto), tokenUrl
// 좋아요, 즐겨찾기 칼럼 추가하기
const nftSchema = mongoose.Schema({
	tokenId: {
		type: Number,
	},
	nftName: {
		type: String,
		maxlength: 50,
	},
	description: {
		type: String,
	},
	imgUri: {
		type: String,
	},
	tokenUrl: {
		type: String,
	},
});

const Nft = mongoose.model('Nft', nftSchema);

module.exports = Nft;

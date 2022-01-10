// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.10;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// stable Coin 1 : 1200(원)
// stable Coin 5 : 1 (유동성 코인) - nft 구매 가능
// 서버 계정은 stable coin, 유동성 coin 둘다 가지고 있음.
// user1 => server : token1 전송
// server => user1 : token2 전송

contract TokenSwap{

    IERC20 public token1;  // stable coin
    address public owner1;  // user. (token1의 소유자 계정 주소)
    IERC20 public token2;  // 유동성 코임
    address public owner2; // server address

    constructor (address _token1, address _token2, address serverAddress) public {
        token1 = IERC20(_token1);
        token2 = IERC20(_token2);
        owner2 = serverAddress; 
    }

    // function checkAllowance(address token, address owner) public view returns(uint256){
    //     return token.allowance()
    // }

    function swap(uint256 _amount, address user) public {
        uint256 tokenAmount = _amount * 1e18;
        require(msg.sender == owner2, "Not authorized");
        require(token1.allowance(user, address(this)) >= tokenAmount, "Token 1 allowance too low");
        require(token2.allowance(owner2, address(this)) >= tokenAmount/5, "Token 2 allowance too low");

        // transfer tokens
        // token1, owner1, amount1 -> owner2
        _safeTransferFrom(token1, user, owner2, tokenAmount);

        // token2, owner2, amount2 -> owner1
        _safeTransferFrom(token2, owner2, user, tokenAmount/5);

    }

    function _safeTransferFrom(IERC20 token, address sender, address recipient, uint256 amount) private {
        bool sent = token.transferFrom(sender, recipient, amount);
        require(sent, "Token transfer failed");
    }
}
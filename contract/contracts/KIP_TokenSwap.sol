// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.5.6;

import "../klaytn-contracts-master/contracts/token/KIP7/KIP7.sol";
import "../klaytn-contracts-master/contracts/token/KIP7/IKIP7.sol";

contract TokenSwap{
    IKIP7 public token1;  // stable coin
    address public owner1;  // user. (token1의 소유자 계정 주소)
    IKIP7 public token2;  // 유동성 코임
    address public owner2; // server address

    constructor (address _token1, address _token2, address serverAddress) public {
        token1 = IKIP7(_token1);
        token2 = IKIP7(_token2);
        owner2 = serverAddress; 
    }

    function swap(uint256 _amount, address user, address spender, address _contract1, address _contract2) public {
        uint256 tokenAmount = _amount * 1e18;

        _exchangeToken(user, spender, _contract1);
        _exchangeToken(owner2, spender, _contract2);

        require(msg.sender == owner2, "Not authorized");

        require(token1.allowance(user, address(this)) >= tokenAmount, "Token 1 allowance too low");
        require(token2.allowance(owner2, address(this)) >= tokenAmount/5, "Token 2 allowance too low");

        _safeTransferFrom(token1, user, owner2, tokenAmount);
        _safeTransferFrom(token2, owner2, user, tokenAmount/5);

    }

    function _exchangeToken(address owner,address spender, address _contract)public returns(uint){
        (bool data, ) = _contract.call(abi.encodeWithSignature("approveToken(address,address)",owner,spender));
        if(data == true){
            return 1;
        }
    }

    function _safeTransferFrom(IKIP7 token, address sender, address recipient, uint256 amount) private {
        bool sent = token.transferFrom(sender, recipient, amount);
        require(sent, "Token transfer failed");
    }
}
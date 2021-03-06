// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.10;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract NWTToken is ERC20, Ownable {
    // IERC20 public token1;  // stable coin
    // address public owner1;  // user. (token1의 소유자 계정 주소)
    // IERC20 public token2;  // 유동성 코임
    // address public owner2; // server address

    constructor() ERC20("NWToken", "NWT") {
        // token1 = IERC20(_token1);
        // owner2 = serverAddress;
    }
    
    function mintToken(address to, uint256 amount) public onlyAuthorized returns (bool) {  // NFT 구매할 FT 토큰
        require(to != address(0x0));
        require(amount > 0);
        _mint(to, amount);
        // _approve(to, msg.sender, allowance(to, msg.sender)+amount);  // approve 추가
        // _approve(to, contractAddress1, allowance(to, contractAddress1) + amount);  // approve 추가 => nft 컨트랙트 연결
        // _approve(to, contractAddress2, allowance(to, contractAddress2) + amount);  // approve 추가 => swap 컨트랙트 연결

        return true;
    }

    function approveToken(address owner,address spender) public {
         uint256 amount = balanceOf(owner);
        _approve(owner,spender,amount);
    }

    function multiMintToken(address[] calldata toArr, uint256[] calldata amountArr) public onlyAuthorized returns (bool) {
        require(toArr.length == amountArr.length);
        for (uint256 i=0; i<toArr.length; i++) {
            require(toArr[i] != address(0x0));
            require(amountArr[i] > 0);
            _mint(toArr[i], amountArr[i]);
            _approve(toArr[i], msg.sender, allowance(toArr[i], msg.sender) + amountArr[i]);
        }
        return true;
    }
}
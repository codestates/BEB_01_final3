// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.10;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract NWTToken is ERC20, Ownable {
    constructor() ERC20("NWToken", "NWT") {
        
    }
    
    function mintToken(address to, uint256 amount, address contractAddress) public onlyOwner returns (bool) {  // NFT 구매할 FT 토큰
        require(to != address(0x0));
        require(amount > 0);
        _mint(to, amount);
        // _approve(to, msg.sender, allowance(to, msg.sender)+amount);  // approve 추가
        _approve(to, contractAddress, allowance(to, contractAddress) + amount);  // approve 추가

        return true;
    }

    function approveToken(address owner,address spender)public {
         uint256 amount = balanceOf(owner);
        _approve(owner,spender,amount);
    }

    function multiMintToken(address[] calldata toArr, uint256[] calldata amountArr) public onlyOwner returns (bool) {
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
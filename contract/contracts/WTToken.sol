// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.10;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "./Price.sol";

contract WTToken is ERC20, Ownable {
    uint256 _amountToken;
    // uint256 _price;
    // event showPrice(uint256 price);
    // mapping(address => uint256) private _balances;
    // uint256 private _totalSupply;
    // Price _price;
    // mapping(address => uint256) private _balances;

    constructor() ERC20("WToken", "WT") {
    }

    function mintToken(address to, uint256 amount, address contractAddress) public onlyOwner returns (bool) {
        require(to != address(0x0));
        require(amount > 0);
        _mint(to, amount);
        // _approve(to, msg.sender, allowance(to, msg.sender)+amount);  // approve 추가
        // _approve(to, contractAddress, allowance(to, contractAddress) + amount);  // approve 추가  => 베팅 컨트렉트 연결

        return true;
    }

    function approveToken(address owner,address spender) public {
         uint256 amount = balanceOf(owner);
        _approve(owner,spender,amount);
    }

    function exchange(address _to, uint256 price) public onlyOwner returns (bool) {
        require(_to != address(0x0));
        require(balanceOf(msg.sender) > 0);
        _amountToken = (price * 1e18) / 1000;  // 가라로 고정으로 설정 (원화)
        require(balanceOf(msg.sender) >= _amountToken);
        _transfer(msg.sender, _to, _amountToken);
        return true;
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
import React, { useState } from "react";
import {  Card } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { searchNFT } from "../../actions/user_action.js";
import NFTbuy from '../NFTcreate/NFTbuy';
import { crearteStore } from 'redux';


const SearchNft = (props) => {
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");
  const user = useSelector((state) => state.user);

  let flag = false;

  if(user.searchNft.success === true) {
    flag = user.searchNft.success
  }

  return (
    <div>
      { flag ? user.searchNft.data.map((el) => {
    return (
      <Card style={{ width: "18rem", margin: "1%", cursor: "pointer" }}>
        <Card.Img variant="top" src={el.imgUri} style={{ height: "220px" }} />
        <Card.Body>
          <Card.Title>Content : {el.contentTitle}</Card.Title>
          <Card.Title>Name : {el.nftName}</Card.Title>
          <Card.Title>Name : {el.nftName}</Card.Title>
          <Card.Text>desription : {el.description}</Card.Text>
          <Card.Title>Price : {el.price}</Card.Title>
          {/* <Button variant="warning" style={{fontWeight:"bold"}}  onClick={()=>{BuyNFT(el.tokenId)}}>판매중</Button> */}
        </Card.Body>
      </Card>
    );
  }) : <div>nothing</div> }
    </div>
    
      
    
  )

  
  
};
 

export default SearchNft;

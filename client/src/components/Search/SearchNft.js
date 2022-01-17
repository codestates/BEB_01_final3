import React, { useState } from "react";
import {  Card } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { searchNFT } from "../../actions/user_action.js";
import NFTbuy from '../NFTcreate/NFTbuy'


const SearchNft = (props) => {
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");
  const user = useSelector((state) => state.user);
  // console.log("user", user);
  const [check, setCheck] = useState(false);

  // if(user) setCheck(true)

  return (
    <div>
      { check ? <div>nothing</div> :  user.searchNft.data.map((el) => {
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
  }) }
    </div>
    
      
    
  )

  
  
};
 

export default SearchNft;

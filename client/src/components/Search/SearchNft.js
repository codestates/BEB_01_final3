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
  console.log("user", user);

  // const renderResult = user.searchNft.data.map((product) => {

  //     console.log('product', product)

  // })
//   function BuyNFT(tokenId){
//     axios.post('http://localhost:5000/contract/buyNFT',{tokenId:tokenId,buyer:"test1@test1"})
//       .then((res) => {
              
        
//            if(res.data.failed === false){
//              alert('구매가 되지 않았습니다. 확인해주세요!!!, reason :'+res.data.reason)
//            }else if(res.data.success){
//              alert('구매가 완료되었습니다. 구매자의 mypage로 이동하겠습니다.')
//              navigate('/user/myPage')

//            }
          
//         });
//   }

  const onSubmit = (e) => {
    // console.log(searchValue);

    e.preventDefault();

    let search = { name: searchValue };

    dispatch(searchNFT(search)).then((response) => {
      // setMessage(response.payload.message);
      if (response.payload.searchUser) {
        // console.log(response.payload);
      }
      // console.log(response.payload);
    });
  };

  const handleInputChange = (event) => {
    // console.log(event.target.value);

    setSearchValue(event.target.value);
  };

  // const filteredProducts = products.filter((product) => {

  //     return product.includes(searchValue);

  // })

  return user.searchNft.data.map((el) => {
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
  });
};

export default SearchNft;

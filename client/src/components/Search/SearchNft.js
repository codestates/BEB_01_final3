import React, {useState, useEffect} from 'react';
import { Navbar, Nav, NavDropdown, Button, Container, Offcanvas, Form, FormControl, Card } from 'react-bootstrap';
// import { searchPosts } from './searchPost';
import { useDispatch } from 'react-redux';

import axios from "axios";
import { Col, Icon, Row } from 'antd';

import Meta from 'antd/lib/card/Meta';
import { useSelector } from 'react-redux';

import { searchNFT } from '../../actions/user_action.js'



const SearchNft = (props) => {
    const dispatch = useDispatch();
    const [searchValue, setSearchValue] = useState("");
    const [Products, setProducts] = useState([])

    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)

    const user = useSelector(state=> state.user)
    console.log('user', user)

    
    
    // const renderResult = user.searchNft.data.map((product) => {

    //     console.log('product', product)
        
            
        
    // })
   
    const onSubmit = (e) => {
        // console.log(searchValue);        

        e.preventDefault();

        let search = {name: searchValue};

        dispatch(searchNFT(search))
        .then(response => {
            // setMessage(response.payload.message);
            if(response.payload.searchUser) {
                // console.log(response.payload);

            }
            // console.log(response.payload);

        })

    }

    const handleInputChange = (event) => {

        // console.log(event.target.value);        

        setSearchValue(event.target.value)

    }

    // const filteredProducts = products.filter((product) => {

    //     return product.includes(searchValue);

    // })

    




    return (
        user.searchNft.data.map((el)=>{
            return (
                <Card style={{ width: '18rem', margin:"1%", cursor:"pointer"}}>
                <Card.Img variant="top" src={el.imgUri} style={{height:'220px'}} />
                <Card.Body>
                  <Card.Title>Content : {el.contentTitle}</Card.Title>
                  <Card.Title>Name : {el.nftName}</Card.Title>
                  <Card.Title>Name : {el.nftName}</Card.Title>
                  <Card.Text>
                    desription : {el.description}
                  </Card.Text>
                  <Card.Title>Price : {el.price}</Card.Title>
                  {/* <Button variant="warning" style={{fontWeight:"bold"}}  onClick={()=>{BuyNFT(el.tokenId)}}>판매중</Button> */}
                </Card.Body>
              </Card>
            )
        })
        
    )
}

export default SearchNft

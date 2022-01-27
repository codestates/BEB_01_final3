import React, {useState, useEffect} from 'react';
import { Navbar, Nav, NavDropdown, Button, Container, Offcanvas, Form, FormControl, Card } from 'react-bootstrap';
// import { searchPosts } from './searchPost';
import { useDispatch } from 'react-redux';

import axios from "axios";
import { Col, Icon, Row } from 'antd';

import Meta from 'antd/lib/card/Meta';
import { useSelector } from 'react-redux';

import { searchContent } from '../../actions/user_action.js'



const SearchContent = (props) => {
    const dispatch = useDispatch();
    const [searchValue, setSearchValue] = useState("");
    const [Products, setProducts] = useState([])

    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)
    const user = useSelector(state=> state.user)
    // console.log('user', user)
    console.log(props);

    const content = useSelector(state=> state.user)
    // console.log('content',content.searchContent);

    let flag = false;

    if(user.searchContent.success === true) {
      flag = user.searchContent.success
    }

    return (
      <div style={{paddingTop: "100px", justifyContent: "center", display: "flex"}}>
        {flag ? content.searchContent.data.map((el)=>{
            return (
                <Card style={{ width: '18rem', cursor:"pointer", marginRight: "3%"}}>
                  <Card.Link href = {`/video/${el._id}`}>
                    
                <Card.Img variant="top" src={`http://localhost:5000/${el.thumbnail}`} style={{height:'220px'}} />
                <Card.Body>
                  <Card.Title>Title : {el.title}</Card.Title>
                  <Card.Text>
                    desription : {el.description}
                  </Card.Text>
                  {/* <Button variant="warning" style={{fontWeight:"bold"}}  onClick={()=>{BuyNFT(el.tokenId)}}>판매중</Button> */}
                </Card.Body>
                </Card.Link>
              </Card>

            )
        }) : <div>nothing</div> }
      </div>
        
        
    )
}

export default SearchContent

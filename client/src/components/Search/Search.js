import React, {useState, useEffect} from 'react';
import { Navbar, Nav, NavDropdown, Button, Container, Offcanvas, Form, FormControl } from 'react-bootstrap';
// import { searchPosts } from './searchPost';
import { useDispatch } from 'react-redux';

import axios from "axios";
import { Col, Icon, Row } from 'antd';
import { Card } from 'antd';
import Meta from 'antd/lib/card/Meta';
import { useSelector } from 'react-redux';

import { searchNFT } from '../../actions/user_action.js'

const Search = (props) => {
    const dispatch = useDispatch();
    const [searchValue, setSearchValue] = useState("");
    const [Products, setProducts] = useState([])

    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)

    const user = useSelector(state=> state.user)
    console.log('user', user)
    
    // export function searchNFT(dataToSubmit) {
    //     const request = axios.post('api/users/Search', dataToSubmit)
    //         .then(response => response.data)
    //     // console.log(dataToSubmit)
    //     return {
    //         type: SEARCH_USER,
    //         payload: request
            
    //     } 
    // }

    // useEffect(() => {

    //     let body = {
    //         skip: Skip,
    //         limit: Limit
    //     }

    //     getProducts(body)
    // }, [])

    // const getProducts = (e) => {
    //     // e.preventDefault();
    //     console.log('searchvalue', searchValue)
    //     let search = {name: searchValue};

    //     dispatch(searchNFT(search))
    //     .then(response => {
    //         // setMessage(response.payload.message);
    //         if(response.payload.success) {
    //             console.log(response);
    //             setProducts(response.payload.user)

    //         }
    //         // console.log(response.payload);

    //     })
    // }
    // const [ result, setresult ] = useState([{
    //     name: '',
    //     email: ''
    // }])

    // useEffect(async() => {
    //     try{
    //         const res = await user.searchUser.user
    //         const inputData = await res.prototype.map((rowData) => ({
    //             name: rowData.name,
    //             email: rowData.email
    //             })
    //         )
    //         setresult(result.concat(inputData))
    //     } catch(e){
    //         console.error(e.message)
    //     }
    // },[])
    const renderResult = user.searchUser.user.map((product, index) => {

        console.log('product', product)
        return <nav>
            result = {product.name}, {product.email}
        </nav>
            
        
    })
   
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
        <Navbar bg= 'warning' expand="lg">
        <Container fluid>
            <Navbar.Brand href="/" al >
                {/* <img
                    src={logo}
                    width="200"
                    className='ms-4'
                /> */}
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
                <Form className="d-flex">
                    {renderResult}
                </Form>

                {/* <Form>
                    {filteredProducts.map((product) => {
                     return (<li key={product}>{product}</li>)
                    })}
                </Form> */}
            </Navbar.Collapse>
            
        </Container>

    </Navbar>
    )
}

export default Search

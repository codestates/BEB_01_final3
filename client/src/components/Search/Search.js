import React, {useState, useEffect} from 'react';
import { Navbar, Nav, NavDropdown, Button, Container, Offcanvas, Form, FormControl } from 'react-bootstrap';
// import { searchPosts } from './searchPost';
import { useDispatch } from 'react-redux';


import { searchNFT } from '../../actions/user_action.js'

const Search = (props) => {
    const dispatch = useDispatch();
    const [searchValue, setSearchValue] = useState("");


    // const result = "";

    // const products = [

    //     "desktop",
    
    //     "notebook",
    
    //     "smart phone",
    
    //     "clock",
    
    //     "chair",
    
    //     "iPad"
    
    //   ]

    // const onSubmit = (e) => {
    //     e.preventDefault();
    //     const { page } = qs.parse(location.search, {
    //         ignoreQueryPrefix: true,
    //     });
        
    //     dispatch(searchPosts({ page: page, content: searchValue }));
    //     // option: options
    //     setValue('');
    // };

    const onSubmit = (e) => {
        // console.log(searchValue);        

        e.preventDefault();

        let search = {name: searchValue};

        dispatch(searchNFT(search))
        .then(response => {
            // setMessage(response.payload.message);
            if(response.payload.success) {
                // console.log(response.payload);

            }
            console.log(response.payload);

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
            <Navbar.Collapse id="navbarScroll" method='get' onSubmit={onSubmit}>
                <Form className="d-flex">
                    <FormControl
                        type="search"
                        className="me-4"
                        // value={searchValue}
                        placeholder="search the value or NFT"
                        onChange={(e) => {
                            setSearchValue(e.target.value);
                        }}    
                        
                    />
                    <Button variant="outline-success" method='get' onClick={onSubmit}>Search</Button>
    
                </Form>

                <Form className="d-flex">
                    {/* {result} */}
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

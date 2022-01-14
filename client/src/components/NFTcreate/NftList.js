import React, { useEffect, useState } from 'react'
import axios from 'axios';
// import { Facoad } from 'react-icons/fa'
import {Card,Button} from 'react-bootstrap'



function NftList() {

    const [nft, setNft] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/contract/nftList').then((res) => {
            setNft(res.data.data)
            console.log(res.data.data);
        });
    }, []);




   function BuyNFT(tokenId){
    axios.post('http://localhost:5000/contract/buyNFT',{tokenId:tokenId,user:"test@test"})
      .then((res) => {
            console.log(res);
        });
  }
  

  
        
        return (
          <div style={{
            display:'flex',
            flexWrap:'wrap',
            margin:'2%',
            backgroundColor:'gray'
            
          }}>
           {
             nft.map((el)=>{
               return(
                <Card style={{ width: '18rem', margin:"1%"}}>
                <Card.Img variant="top" src={el.imgUri} style={{height:'220px'}} />
                <Card.Body>
                  <Card.Title>Content : {el.contentTitle}</Card.Title>
                  <Card.Title>Name : {el.nftName}</Card.Title>
                  <Card.Text>
                    desription : {el.description}
                  </Card.Text>
                  <Card.Title>Name : {el.nftName}</Card.Title>
                  <Card.Title>Price : {el.price}</Card.Title>
                  <Button variant="primary" onClick={()=>{BuyNFT(el.tokenId)}}>buy</Button>
                </Card.Body>
              </Card>
               )
             })
           }
          </div>
        );

}

export default NftList


import React, { useState } from 'react'
import {Card,Button} from 'react-bootstrap'
import LikeDisLike from './LikeDisLike';
import DetailAuction from './AuctionButton/DetailAuction'
import styled from 'styled-components';

const Div = styled.div`
width: 20%;
height: 65%;
border-radius: 4%;
box-shadow: 4px 12px 30px 6px rgb(0 0 0 / 9%);
transition: all 0.2s ease-in-out;
margin-left: 20px;
margin-right: 15px;
display: flex;
justify-content: center;
&:hover {

  box-shadow: 4px 12px 20px 6px rgb(0 0 0 / 18%);
  transform: translateY(5px);

}

`
// const Div = styled.div`
// width: 25%;
// border-radius: 4%;
// box-shadow: 4px 12px 30px 6px rgb(0 0 0 / 9%);
// transition: all 0.2s ease-in-out;
// &:hover {

//   box-shadow: 4px 12px 20px 6px rgb(0 0 0 / 18%);
//   transform: translateY(5px);

// }

// `

function NFTauction({ nftlist }) {
  
  
    const [modalShow, setModalShow] = useState(false);
    const [nftdata, setnftdata] = useState("");

    

   function Auction(nftdata) {
   
    if (modalShow) {
      setModalShow(false);
    } else {
      setModalShow(true);
    }
     setnftdata(nftdata);
    }
    
  console.log(nftdata)
  
  return (


    <>

    {
             nftlist.map((el)=>{
               return(
                // <a href={`/nft/${el.tokenId}`} style={{textDecoration: 'none'}}  >
               <Div>
                <Card bg='black' text='white' border='white' style={{borderRadius:'4%'}} >
                <Card.Img variant="top" src={el.imgUri}  style={{ width: '25 rem', height:'25rem',borderRadius:'4%' }} />
                <Card.Body >
                  <Card.Title >
                    Content : {el.contentTitle}
                  </Card.Title>
                  <Card.Title>
                    Name : {el.nftName}
                     </Card.Title>
                  <Card.Title >
                    시작가 : {el.price}
                  </Card.Title> 
                 
                </Card.Body>
                <Card.Body >
                  <Card.Text >
                    desription : {el.description}
                  </Card.Text>
                </Card.Body>
                   <Card.Body >
                    
                       <Button variant="warning" onClick={() => Auction(el)}>
                         입찰 
                       </Button>

                       {modalShow === true ? <DetailAuction show={Auction} nftdata = {nftdata}/> : null}

                  <div style={{width:"55%"}}></div>
                  <LikeDisLike userId={localStorage.getItem('userId')} nftId={ el._id } />
                </Card.Body>
                  
                
              </Card>
              </Div>
               )
              
             })
             
           }
      
    </>
  )

  
}

export default NFTauction
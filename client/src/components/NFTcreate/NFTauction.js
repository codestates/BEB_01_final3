
import React, { useState } from 'react'
import {Card,Button} from 'react-bootstrap'
import { useNavigate} from 'react-router-dom';
import LikeDisLike from './LikeDisLike';
import DetailAuction from './AuctionButton/DetailAuction'


function NFTauction({ nftlist }) {
  
    const navigate = useNavigate();
    const [buyer,setBuyer] = useState('');
    const [check, setCheck] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [nftdata, setnftdata] = useState("");

    const onClick = () => {
      console.log('좋아요?');
      check ? setCheck(false) : setCheck(true);
    }
    

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
              
                <Card style={{ width: '19rem', margin:"1.5%", cursor:"pointer"}} bg='black' text='white' border='white' >
                <Card.Img variant="top" src={el.imgUri} style={{height:'100%', width:'100%', }} />
                <Card.Body style={{marginBottom: '0px', borderBottom: '1px solid #DCDCDC'}}>
                  <Card.Title style={{textAlign:'left', marginTop: '3%', marginLeft:'-3%'}}>
                    Content : {el.contentTitle}
                  </Card.Title>
                  <Card.Title style={{textAlign:'left', marginTop: '5%', marginLeft:'-3%'}}>
                    Name : {el.nftName}
                     </Card.Title>
                  <Card.Title style={{textAlign:'left', marginTop: '5%', marginLeft:'-3%'}}>
                    최고가 : {el.price}
                  </Card.Title> 
                 
                </Card.Body>
                <Card.Body style={{marginBottom: '0px', borderBottom: '1px solid #DCDCDC'}}>
                  <Card.Text style={{textAlign:'left', marginLeft:'-3%', fontSize:'20px'}}>
                    desription : {el.description}
                  </Card.Text>
                </Card.Body>
                   <Card.Body style={{ display: "flex", marginLeft: '-3%', marginRight: '-9%' }}>
                    
                       <Button variant="warning" onClick={() => Auction(el)}>
                         입찰 
                       </Button>

                       {modalShow === true ? <DetailAuction show={Auction} nftdata = {nftdata}/> : null}

                  <div style={{width:"55%"}}></div>
                  <LikeDisLike userId={localStorage.getItem('userId')} nftId={ el._id } />
                </Card.Body>
                  
                
              </Card>
             
               )
              
             })
             
           }
      
    </>
  )

  
}

export default NFTauction
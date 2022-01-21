import React, {useState, useEffect} from "react"
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios';
import {Card,Button} from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom';
import LikeDisLike from '../../NFTcreate/LikeDisLike';
// import NFTbuy from './NFTbuy'



function LikeNft () {
    const user = useSelector(state=> state.user.userData)

    // console.log(user);

    const [Likes, setLikes] = useState('');
    const [nft, setNft] = useState([]);
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/api/contract/nft/list').then((res) => {
          if(res.data.data.length !== 0){
            setNft(res.data.data)
            console.log(res.data.data.length);
            setLoading(true)
          }else if( res.data.data.lenght === 0){
            setLoading(false)
          }
        //   console.log(res.data.data);
        });
    }, []);

    
    // let variable = {}
    // variable = { nftId: {nft}._id, userId: user._id };
    // console.log('var',variable)

    useEffect(() => {

        axios.post('/api/like/getlikes', user._id)
            .then(response => {
                if (response.data.success) {

                    setLikes(response.data.likes);
                    
                } else {
                    alert('좋아요 정보 받기 실패')
                }
            })
    }, [])

    const res = [];
    let k = 0;
    for(let i = 0; i < Likes.length; i++){
            // console.log(nft[i]._id);
            // console.log(Likes[i]);
            
            if(Likes[i].nftId) {
                // console.log("Nft임 !", Likes[i]);
                res[k] = Likes[i].nftId;
                k = k + 1;

                // console.log("res", res[i]);
            } 
            else {
                // console.log("Nft가 아님!?", Likes[i]);
            } 
    }
    
    // console.log(res);

    const result = [];
    for (let i = 0; i < nft.length; i++){
        // console.log(nft[i]);
        result[i] = nft[i];

    }
    // console.log(result[0]._id)

    const Likenft = [];
    for(let i = 0 ; i < res.length; i++) {
        for(let k = 0; k < result.length; k++){
            if(res[i] === result[k]._id){
                // console.log("맞음?", res[i], result[k]);
                Likenft[i] = result[k]
            } 
        }
    }
    // console.log(Likenft);

    function BuyNFT(tokenId){
        axios.post('/api/contract/buyNFT',{tokenId:tokenId})
          .then((res) => {
                  
            
               if(res.data.failed === false){
                 alert('구매가 되지 않았습니다. 확인해주세요!!!, reason :'+res.data.reason)
               }else if(res.data.success){
                 alert('구매가 완료되었습니다. 구매자의 mypage로 이동하겠습니다.')
                 navigate('/user/myPage')
    
               }
              
            });
      }

    return(
        <div>
            <div style={{
                fontSize: "50px",
                color: "white",
                background:'black',
                // marginBottom:"2%"
            }}>
                My Favorite NFT ! !
            </div>

            <div style={{
            width:'100vw', 
            height:'100vh',
             display:'flex',
            flexWrap:'wrap',
            justifyContent: 'center',
             alignContent: 'center',
            backgroundColor:'black'
          }}>
            {
            Likenft.map((el) => {
                return(
                    <Card style={{ width: '19rem', margin:"1.5%", cursor:"pointer"}} bg='black' text='white' border='white'>
                        <Card.Img variant="top" src={el.imgUri} style={{height:'100%', width:'100%', }} />
                        <Card.Body style={{marginBottom: '0px', borderBottom: '1px solid #DCDCDC'}}>
                        <Card.Title style={{textAlign:'left', marginTop: '3%', marginLeft:'-3%'}}>
                            Content : {el.contentTitle}
                        </Card.Title>
                        <Card.Title style={{textAlign:'left', marginTop: '5%', marginLeft:'-3%'}}>
                            Name : {el.nftName}
                        </Card.Title>
                        <Card.Title style={{textAlign:'left', marginTop: '5%', marginLeft:'-3%'}}>
                            Price : {el.price}
                        </Card.Title>
                    </Card.Body>
                    <Card.Body style={{marginBottom: '0px', borderBottom: '1px solid #DCDCDC'}}>
                        <Card.Text style={{textAlign:'left', marginLeft:'-3%', fontSize:'20px'}}>
                            desription : {el.description}
                        </Card.Text>
                    </Card.Body>
                    <Card.Body style={{display:"flex", marginLeft:'-3%', marginRight:'-9%'}}>
                        <div>
                            <Button variant="warning" style={{fontWeight:"bold"}}  onClick={()=>{BuyNFT(el.tokenId)}} >판매중</Button>
                        </div>
                        <div style={{width:"60%"}}></div>
                        <LikeDisLike userId={localStorage.getItem('userId')} nftId={ el._id } />
                        </Card.Body>
                    </Card>

                )
            })
        }

        </div>
        </div>
        
    )


}

export default LikeNft
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NftListSpinner from '../spinner/nftListSpinner';
import NFTbuy from './NFTbuy'


function NftList() {

    const [nft, setNft] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    

    useEffect(() => {
      axios.post('/api/contract/nft/list',{type:"fixed"}).then((res) => {
          if(res.data.data.length !== 0){
            setNft(res.data.data)
            console.log(res.data.data.length);
            setLoading(true)
          }else if( res.data.data.lenght === 0){
            setLoading(false)
          }
          
        });
    }, []);

        return (
          <div style={{
            width:'100vw', 
            height:'100%',
             display:'flex',
            flexWrap:'wrap',
            justifyContent: 'center',
             alignContent: 'center',
            backgroundColor:'black',
            paddingTop: "100px"
          }}>

            {
             loading === false ?
             <NftListSpinner></NftListSpinner>
             : <NFTbuy nftlist={nft}></NFTbuy>
} 
           
          </div>
        );

}

export default NftList

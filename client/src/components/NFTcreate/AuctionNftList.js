import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NftListSpinner from '../spinner/nftListSpinner';
import NFTauction from './NFTauction';
import SideBar from '../NavBar/SideMainBar';


function NftList() {

    const [nft, setNft] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    

    useEffect(() => {
        axios.post('/api/contract/nft/list', {type:"Auction"}).then((res) => {
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
            width:'2000px', 
            height:'100%',
             display:'flex',
            flexWrap:'wrap',
             alignContent: 'center',
            // backgroundColor:'tranparent',
            // marginTop: '50px'
            paddingTop: "50px",
            backgroundColor:'tranparent',
            marginLeft: "36%"
          }}>
            <SideBar width={300} />

            {
             loading === false ?
             <NftListSpinner></NftListSpinner>
             : <NFTauction nftlist={nft}></NFTauction>
} 
           
          </div>
        );

}

export default NftList

import axios from 'axios';
import MyPage from '../components/MyPage/MyPage';
import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER,
    LOGOUT_USER,
    MYPAGE,
    SEARCH_NFT
} from './types';


export function loginUser(dataToSubmit) {

    const request = axios.post('/api/users/login', dataToSubmit)
        .then(response => response.data)

    return {
        type: LOGIN_USER,
        payload: request
    }
}

export function registerUser(dataToSubmit) {

    const request = axios.post('/api/users/register', dataToSubmit)
        .then(response => response.data)
       
    return {
        type: REGISTER_USER,
        payload: request
    }
}


export function auth() {

    const request = axios.get('/api/users/auth', {withCredentials: true})
        .then(response => response.data)

    return {
        type: AUTH_USER,
        payload: request
    }
}

export function logoutUser(dataToSubmit) {
    const request = axios.get('api/users/logout', dataToSubmit, { withCredentials: true })
        .then(response => response.data)

    return {
        type: LOGOUT_USER,
        payload: request
    } 


}

export function searchNFT(dataToSubmit) {
    const request = axios.post('api/contract/users/SearchNft', dataToSubmit)
        .then(response => response.data)
    // console.log(dataToSubmit)
    return {
        type: SEARCH_NFT,
        payload: request
        
    }
}

export function myPageCheck(email){
                                
    const request = axios.post('http://localhost:5000',{
         email:email
    }).then(res => res.data);
    console.log(request);

    return {
        type : MYPAGE,
        payload : request
    }
}
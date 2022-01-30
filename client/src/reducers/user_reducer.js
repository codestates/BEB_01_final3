import {
    LOGIN_USER,
    REGISTER_USER,
    LOGOUT_USER,
    AUTH_USER,
    SEARCH_NFT,
    MYPAGE,
    SEARCH_CONTENT,
    CHANNEL
} from '../actions/types';



export default function (state = {}, action) {
    switch (action.type) {
        case LOGIN_USER:
            return { ...state, loginSuccess: action.payload }
            
        case REGISTER_USER:
           
            return { ...state, register: action.payload }
            
        case AUTH_USER:
           
            return { ...state, userData: action.payload }
            
        case LOGOUT_USER:  
            return { ...state }
        
        case SEARCH_NFT:
            // console.log('reducer', action.payload);
            return {...state, searchNft: action.payload}

        case SEARCH_CONTENT:
            return {...state, searchContent: action.payload}

        case MYPAGE:
             return {...state, userInfo: action.payload}    

        case CHANNEL:
            return {...state, data: action.payload}
        default:
            return state;
    }
}
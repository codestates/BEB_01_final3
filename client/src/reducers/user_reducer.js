import {
    LOGIN_USER,
    REGISTER_USER,
    LOGOUT_USER,
    AUTH_USER,
    SEARCH_USER,
    MYPAGE
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
        
        case SEARCH_USER:
            console.log('reducer', action.payload);
            return {...state, searchUser: action.payload}

        case MYPAGE:
             return {...state,userInfo:action.payload}    
        default:
            return state;
    }
}
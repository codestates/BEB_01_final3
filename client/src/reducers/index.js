import { combineReducers } from 'redux';
import user from './user_reducer';

const rootReducer = combineReducers({
    user
})

export default rootReducer;

//다른 리듀서를 추가하고 싶으면 
//리듀서를 만들고 import 해온 다음 rootReducer 안에 user, 다음에 넣으면 된다

//ex) import user from './user_reducer';
//import comment from './comment_reducer
//const rootReducer = combineReducers({
//  user, comment
//})
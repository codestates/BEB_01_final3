import { combineReducers } from 'redux';
import user from './user_reducer';
import token from './token_reducer';

const rootReducer = combineReducers({
	user,
	token,
});

export default rootReducer;

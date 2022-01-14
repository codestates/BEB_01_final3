import { WTTOKEN_CHANGE, NWTTOKEN_CHANGE } from '../actions/types';

export default function (state = {}, action) {
	switch (action.type) {
		case WTTOKEN_CHANGE:
			return { ...state, success: action.payload };

		case NWTTOKEN_CHANGE:
			return { ...state, success: action.payload };

		default:
			return state;
	}
}

import axios from 'axios';
import { WTTOKEN_CHANGE, NWTTOKEN_CHANGE } from './types';

// won(원) exchange wtToken
export function wtTokenExchange(dataToSubmit) {
	const request = axios
		.post('/api/contract/token/exchangeWT', {
			wtToken: dataToSubmit,
		})
		.then((response) => response.data);
	return {
		type: WTTOKEN_CHANGE,
		payload: request,
	};
}

// wt exchange nwtToken
export function nwtTokenExchange(dataToSubmit) {
	// console.log('action : ', dataToSubmit);
	const request = axios
		.post('/api/contract/token/exchangeNWT', {
			nwtToken: dataToSubmit,
		})
		.then((response) => response.data);
	return {
		type: NWTTOKEN_CHANGE,
		payload: request,
	};
}

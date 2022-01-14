import axios from 'axios';
import { WTTOKEN_CHANGE } from './types';

// 원 exchange wtToken
export function wtTokenExchange(dataToSubmit) {
	const request = axios
		.post('/api/contract/token/exchangeWT', dataToSubmit)
		.then((response) => response.data);
	return {
		type: WTTOKEN_CHANGE,
		payload: request,
	};
}

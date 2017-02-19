/* @flow */
import type { Action } from '../types/action';
import { ticker } from './ticker';
import { setError } from './error';
import { publicAPI } from '../../../config.json';

export const CONNECTION_START = 'CONNECTION_START';
export const CONNECTION_SUCCESS = 'CONNECTION_SUCCESS';

export function connect() {
	return (dispatch: (action: Action) => Action) => {
		if (WebSocket) {
			console.log('connecting');
			const ws = new WebSocket(publicAPI);

			ws.onopen = () => {
				console.log('connected');
				dispatch({
					type: CONNECTION_START,
				});
			};

			ws.onmessage = e => {
				console.log('bad recv');
				if (e.data && typeof e.data === 'string') {
					ticker(JSON.parse(e.data))(dispatch);
				}
			};
			ws.onerror = e => {
				setError('Server connection lost. Reconnecting...')(dispatch);
				console.error(e);
				if (ws.readyState < 2) {
					ws.close();
				}
				setTimeout(() => {
					connect()(dispatch);
				}, 500);
			};
		}
	};
}

/* @flow */
import type { Action } from '../types/action';

export const CONNECTION_START = 'CONNECTION_START';
export const CONNECTION_SUCCESS = 'CONNECTION_SUCCESS';

export function connect() {
	return (dispatch: (action: Action) => Action) => {
		dispatch({
			type: CONNECTION_START,
		});
	};
}

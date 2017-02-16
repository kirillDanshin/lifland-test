/* @flow */
import type { Action } from '../types/action';

export const UPDATE_TICKER = 'UPDATE_TICKER';

export function ticker() {
	return (dispatch: (action: Action) => Action) => {
		const tick = {
			'USD/RUB': '0.3',
			'USD/BYN': '0.03',
		};

		dispatch({
			type: UPDATE_TICKER,
			payload: tick,
		});
	};
}

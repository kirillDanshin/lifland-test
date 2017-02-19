/* @flow */
import type { Action } from '../types/action';

export const UPDATE_TICKER = 'UPDATE_TICKER';

export function ticker(tick: any) {
	return (dispatch: (action: Action) => Action) => {
		dispatch({
			type: UPDATE_TICKER,
			payload: tick,
		});
	};
}

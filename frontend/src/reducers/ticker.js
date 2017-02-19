/* @flow */
import type { Action } from '../types/action';
import { UPDATE_TICKER } from '../actions/ticker';

const defaultState = {};

export default function ticker(state: Object = defaultState, action: Action) {
	switch (action.type) {
	case UPDATE_TICKER: {
		if (action.payload) {
			return action.payload;
		}
		return state;
	}
	default:
		return state;
	}
}

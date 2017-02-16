/* @flow */
import { Map as IMap } from 'immutable';
import type { Action } from '../types/action';
import { UPDATE_TICKER } from '../actions/ticker';

const defaultState = IMap();

export default function ticker(state: Object = defaultState, action: Action) {
	switch (action.type) {
	case UPDATE_TICKER: {
		if (action.payload) {
			return state.merge(action.payload);
		}
		return state;
	}
	default:
		return state;
	}
}

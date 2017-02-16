/* @flow */
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import GeneralContainer from './containers/General';
import './styles/index.css';

export default class App extends Component {
	render() {
		const { store } = this.props;
		return (
			<Provider store={store}>
				<GeneralContainer />
			</Provider>
		);
	}
}

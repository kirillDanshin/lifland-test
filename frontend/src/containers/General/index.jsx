/* @flow */
import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import { connect } from 'react-redux';
import { connect as connectServer } from '../../actions/connection';
import ErrorComponent from '../../components/Error';
import styles from './index.css';

const mapStateToProps = state => ({
	errorMessage: state.error.message,
});

@connect(mapStateToProps, { connectServer })
@CSSModules(styles)
export default class General extends Component {
	static propTypes = {
		errorMessage: PropTypes.string,
		connectServer: PropTypes.func,
	};

	componentWillMount() {
		this.props.connectServer();
	}

	render() {
		const { errorMessage } = this.props;

		return (
			<div>
				<div>Запилил.</div>
				<ErrorComponent message={errorMessage} />
			</div>
		);
	}
}

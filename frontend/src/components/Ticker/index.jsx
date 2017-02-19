/* @flow */
import React, { Component /* , PropTypes*/ } from 'react';
import CSSModules from 'react-css-modules';
import { connect } from 'react-redux';
import styles from './index.css';


const mapStateToProps = state => ({
	tick: state.ticker,
});

@connect(mapStateToProps)
@CSSModules(styles, { allowMultiple: true })
export default class Ticker extends Component {
	getPairName(pairID: string): string {
		return pairID.toUpperCase().replace('-', '/');
	}

	render() {
		const tick = this.props.tick;
		// tag marquee in react doesn't support scrollDelay attribute,
		// so we should implement our own marquee in CSS.
		return (
			<div styleName="marquee-container">
				<div styleName="marquee">
					{
						tick.Pairs && Object.keys(tick.Pairs).map((pair, idx) => (
							<span key={idx}>
								<b>{this.getPairName(pair)}</b>: {`${tick.Pairs[pair].Price} `}
								({tick.Pairs[pair].Market})
							</span>
						))
					}
				</div>
			</div>
		);
	}
}

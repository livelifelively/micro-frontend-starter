import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ProgressRing extends Component {
  constructor(props) {
    super(props);

    const { radius, stroke } = this.props;

    this.normalizedRadius = radius - stroke * 2;
    this.circumference = this.normalizedRadius * 2 * Math.PI;
  }

  render() {
    const { radius, stroke, progress, color, refColor } = this.props;
    const strokeDashoffset = this.circumference - (progress / 100) * this.circumference;

    return (
      <svg height={radius * 2} width={radius * 2} className="progress-ring">
        <circle
          className="progress-ring__circle--reference"
          stroke={refColor}
          fill="transparent"
          strokeWidth={stroke}
          r={this.normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          className="progress-ring__circle"
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${this.circumference} ${this.circumference}`}
          style={{ strokeDashoffset }}
          r={this.normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
    );
  }
}

ProgressRing.propTypes = {
  radius: PropTypes.number.isRequired,
  stroke: PropTypes.number.isRequired,
  progress: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  refColor: PropTypes.string.isRequired,
};

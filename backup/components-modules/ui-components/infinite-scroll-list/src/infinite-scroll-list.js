/* eslint-disable react/forbid-prop-types */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class InfiniteScrollList extends Component {
  componentDidMount() {
    const { identifier } = this.props;
    const tableContent = document.querySelector(`.${identifier} .infinite-list-body`);

    tableContent.addEventListener('scroll', (event) => {
      const { totalDataUnits, dataSize } = this.props;

      const maxScroll = event.target.scrollHeight - event.target.clientHeight;
      const currentScroll = event.target.scrollTop;

      if (currentScroll === maxScroll && totalDataUnits !== dataSize) {
        this.onHitBottom();
      }
    });
  }

  onHitBottom = async () => {
    const { fetchData } = this.props;
    await fetchData();
  };

  render() {
    // TODO add ref from props instead of class based queryselector to attach event.
    const { className, identifier, content } = this.props;
    return (
      <div className={`${identifier} ${className}`}>
        <div className="infinite-list-body">{content}</div>
      </div>
    );
  }
}

InfiniteScrollList.propTypes = {
  dataSize: PropTypes.number.isRequired,
  fetchData: PropTypes.func.isRequired,
  totalDataUnits: PropTypes.number.isRequired,
  identifier: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  content: PropTypes.object.isRequired,
};

InfiniteScrollList.defaultProps = {};

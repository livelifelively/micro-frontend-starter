/* eslint-disable react/forbid-prop-types */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';

export default class InfiniteScrollTable extends Component {
  componentDidMount() {
    const { identifier } = this.props;
    const tableContent = document.querySelector(`.${identifier} .ant-table-body`);

    tableContent.addEventListener('scroll', (event) => {
      const { totalDataUnits, data } = this.props;

      const maxScroll = event.target.scrollHeight - event.target.clientHeight;
      const currentScroll = event.target.scrollTop;

      if (currentScroll === maxScroll && totalDataUnits !== data.length) {
        this.onHitBottom();
      }
    });
  }

  onHitBottom = async () => {
    const { fetchData } = this.props;
    // this.setState({
    //   loadingData: true,
    // });
    await fetchData();
    // this.setState({
    //   loadingData: false,
    // });
  };

  render() {
    // TODO add ref from props instead of class based queryselector to attach event.
    const { columns, data, className, identifier } = this.props;
    // const { loadingData } = this.state;
    return (
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        className={`${identifier} ${className}`}
        scroll={{ y: 550 }}
      />
    );
  }
}

InfiniteScrollTable.propTypes = {
  columns: PropTypes.array.isRequired,
  // refProp: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.any })]).isRequired,
  fetchData: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  totalDataUnits: PropTypes.number.isRequired,
  identifier: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
};

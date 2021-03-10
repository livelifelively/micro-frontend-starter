import React from 'react';
import PropTypes from 'prop-types';

import { Select } from 'antd';

export default function TimeRangesDropdown(props) {
  const { timeRanges, onSelect, className, defaultValue, selected } = props;

  return (
    <Select
      className={className}
      defaultValue={defaultValue}
      placeholder="Select Time Range"
      style={{ width: '200px' }}
      onChange={onSelect}
      value={selected.label}
    >
      {timeRanges.map((item) => {
        return item.label && item.value && <Select.Option key={item.value}>{item.label}</Select.Option>;
      })}
    </Select>
  );
}

TimeRangesDropdown.propTypes = {
  timeRanges: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onSelect: PropTypes.func.isRequired,
  className: PropTypes.string,
  defaultValue: PropTypes.string,
  selected: PropTypes.shape({
    label: PropTypes.string,
    name: PropTypes.string,
  }),
};

TimeRangesDropdown.defaultProps = {
  className: '',
  defaultValue: 'All',
  selected: {
    name: 'All News Themes',
    label: 'All',
  },
};

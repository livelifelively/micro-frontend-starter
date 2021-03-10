import React from 'react';
import PropTypes from 'prop-types';

import { Select } from 'antd';

export default function NewsThemesDropdown(props) {
  const { newsThemes, onSelect, className, defaultValue, selected } = props;
  return (
    <Select
      className={className}
      defaultValue={defaultValue}
      placeholder="Select News Theme"
      style={{ width: '200px' }}
      onChange={onSelect}
      value={selected.label}
    >
      {newsThemes.map((item) => item.label && item.name && <Select.Option key={item.label}>{item.name}</Select.Option>)}
    </Select>
  );
}

NewsThemesDropdown.propTypes = {
  newsThemes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onSelect: PropTypes.func.isRequired,
  className: PropTypes.string,
  defaultValue: PropTypes.string,
  selected: PropTypes.shape({
    label: PropTypes.string,
    name: PropTypes.string,
  }),
};

NewsThemesDropdown.defaultProps = {
  className: '',
  defaultValue: 'All',
  selected: {
    name: 'All News Themes',
    label: 'All',
  },
};

import React from 'react';
import PropTypes from 'prop-types';

import { Select } from 'antd';

export default function SubCategoriesDropdown(props) {
  const { subCategories, onSelect, className, selected } = props;
  if (subCategories.length === 0) {
    return <Select className={className} disabled placeholder="Add Category" style={{ width: '200px' }} />;
  }
  return (
    <Select
      className={className}
      defaultValue={selected.label}
      placeholder="Select Technology Category"
      style={{ width: '200px' }}
      onChange={onSelect}
      value={selected.label}
    >
      {subCategories.map(
        (item) => item.label && item.name && <Select.Option key={item.name}>{item.label}</Select.Option>
      )}
    </Select>
  );
}

SubCategoriesDropdown.propTypes = {
  subCategories: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onSelect: PropTypes.func,
  className: PropTypes.string,
  selected: PropTypes.shape({
    label: PropTypes.string,
    name: PropTypes.string,
  }),
};

SubCategoriesDropdown.defaultProps = {
  className: '',
  selected: {},
  onSelect: () => {},
};

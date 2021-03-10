import React, { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import { Select } from 'antd';
import './dropdown.scss';
// import { toTitleCase } from 'utils/common';

const Dropdown = (props) => {
  const [selectedItem, setSelectedItem] = useState();

  const { handleOnChange, dropdownType, optionList, placeholder, defaultValue, customStyle, disabled } = props;

  useEffect(() => {
    if (defaultValue) {
      let options = optionList;
      if (!Array.isArray(optionList)) {
        options = Object.keys(optionList).map((key) => {
          return { label: optionList[key].label, value: key };
        });
      }
      const item = options.find((a) => a.value === defaultValue.value);
      setSelectedItem(item);
    }
  }, [defaultValue]);

  const onChange = (value) => {
    setSelectedItem(value);
    handleOnChange(dropdownType, value);
  };

  // const onBlur = () => {
  //   // console.log('blur');
  // };

  // const onFocus = () => {
  //   // console.log('focus');
  // };

  // const onSearch = (val) => {
  //   // console.log('search:', val);
  // };

  let filteredOptions = optionList;
  if (!Array.isArray(optionList)) {
    filteredOptions = Object.keys(optionList).map((key) => {
      return { label: optionList[key].label, value: key };
    });
  }

  if (selectedItem) {
    filteredOptions = filteredOptions.filter((a) => a.value !== selectedItem.value);
  }

  return (
    <Select
      dropdownStyle={{ backgroundColor: '#ffffff' }}
      showSearch
      style={{ width: '200px', ...customStyle }}
      className="custom-select-dropdown"
      placeholder={placeholder || 'Select from dropdown'}
      onChange={onChange}
      // onFocus={onFocus}
      // onBlur={onBlur}
      // onSearch={onSearch}
      labelInValue
      value={selectedItem}
      options={filteredOptions}
      disabled={disabled}
    />
  );
};

Dropdown.defaultProps = {
  dropdownType: '',
  defaultValue: {},
  customStyle: {},
  disabled: false,
};

Dropdown.propTypes = {
  dropdownType: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  defaultValue: PropTypes.object,
  optionList: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  handleOnChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  customStyle: PropTypes.object,
  disabled: PropTypes.bool,
};

export default Dropdown;

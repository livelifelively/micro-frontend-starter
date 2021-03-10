import React, { Component } from 'react';
import { Select, Spin, Tag } from 'antd';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';

const { Option } = Select;

class MultiSelect extends Component {
  constructor(props) {
    super(props);
    this.state = this.resetModuleStateFromProps();
    this.fetchData = debounce(this.fetchData, 800);
  }

  /**
   * DRY reset module's state to empty suggestions and not fetching data i.e. no loading state.
   */
  resetModuleStateFromProps = () => {
    return {
      data: [],
      fetchingData: false,
    };
  };

  /**
   * Fetch data while managing component state.
   * @param {String} value autocomplete string
   */
  fetchData = async (value) => {
    const { fetchData } = this.props;

    this.setState({
      data: [],
      fetchingData: true,
    });

    const data = await fetchData(value);

    this.setState({
      data,
      fetchingData: false,
    });
  };

  /**
   * When module is selected, save the value in the form state. get the value as props and rerender values.
   * @param {Object} selectedValues selected value in module specific object structure
   */
  onValueSelection = (selectedValues) => {
    const { onChange } = this.props;

    this.setState(this.resetModuleStateFromProps(), () => {
      onChange(selectedValues);
    });
  };

  /**
   * when value is removed, save to parent form state, get that state as new props value
   * @param {Object} val deleted value Formated as per module structure
   */
  onTagClose = (val) => {
    const { onChange } = this.props;
    let selectedValues = this.formatSelectedValues();

    selectedValues = selectedValues.filter((v) => v.label !== val.label);
    onChange(selectedValues);
  };

  formatSelectedValues = () => {
    const { init, valParam, keyParam } = this.props;

    return init.map((val) => {
      return {
        key: keyParam(val),
        label: valParam(val),
      };
    });
  };

  render() {
    const { data, fetchingData } = this.state;
    const { placeholder, keyParam, valParam } = this.props;
    const selectedValues = this.formatSelectedValues();

    return (
      <div className="custom-multi-select">
        <Select
          filterOption={false}
          labelInValue
          mode="multiple"
          notFoundContent={fetchingData ? <Spin size="small" /> : null}
          onChange={this.onValueSelection}
          onSearch={this.fetchData}
          placeholder={placeholder}
          style={{ width: '100%' }}
          value={selectedValues}
        >
          {/* Use the passed key and value parameters to set data here */}
          {data.map((val) => {
            return <Option key={keyParam(val)}>{valParam(val)}</Option>;
          })}
        </Select>
        <div className="custom-multi-select__display-area">
          {selectedValues.map((val) => {
            return (
              <Tag
                closable
                key={val.key}
                onClose={(e) => {
                  e.preventDefault();
                  this.onTagClose(val);
                }}
              >
                {val.label}
              </Tag>
            );
          })}
        </div>
      </div>
    );
  }
}

MultiSelect.propTypes = {
  fetchData: PropTypes.func.isRequired,
  init: PropTypes.arrayOf(PropTypes.any),
  keyParam: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  valParam: PropTypes.func.isRequired,
};

MultiSelect.defaultProps = {
  init: [],
};

export default MultiSelect;

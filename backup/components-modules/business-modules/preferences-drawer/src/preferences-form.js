/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-unresolved */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Checkbox, Spin, Form, Popover } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { isString, uniqBy, kebabCase, differenceBy, sortBy } from 'lodash';

import { COMPANIES_TO_TARGET } from '@qbila/cc-constants';

import CustomMultiSelect from '@qbila/uim-multi-select';

const CheckboxGroup = Checkbox.Group;
const { COMPANY_SIZES, COMPANY_SECTORS } = COMPANIES_TO_TARGET;

export default class PreferencesForm extends Component {
  constructor(props) {
    super(props);
    const { userPreferences, resetFormState } = props;
    const localState = this.setLocalUserPreferences(userPreferences);

    this.state = localState;
    resetFormState(this.resetLocalUserPreferencesFromParent);
    this.preferencesForm = React.createRef();
  }

  componentDidMount() {
    const { formReference } = this.props;
    this.setFormValues();
    formReference(this.preferencesForm);
  }

  /**
   * Have to set values in the form as well to ensure validation works well
   * Its a hack!!! #FIXME
   */
  setFormValues = () => {
    const { sizes, sectors, locations, technologies, subCategories } = this.state;

    this.preferencesForm.current.setFieldsValue({
      sizes: sizes.selected,
      sectors: sectors.selected,
      locations: locations.selected,
      technologies: technologies.selected,
      subCategories: subCategories.selected,
    });
  };

  /**
   * To DRY. Local state reset at one place.
   * @param {Object} userPreferences preferences from parent component.
   */
  setLocalUserPreferences = (userPreferences) => {
    const { technologies, subCategories, sizes, sectors } = userPreferences;
    const locations = this._adapter_preferencesAPILocations_locationsAutoComplete(userPreferences.locations);
    const formState = {
      sizes: {
        saved: sizes,
        selected: sizes,
        all: COMPANY_SIZES,
        allSelected: sizes && sizes.length === COMPANY_SIZES.length,
      },
      sectors: {
        saved: sectors,
        selected: sectors || [],
        all: COMPANY_SECTORS,
        allSelected: sectors && sectors.length === COMPANY_SECTORS.length,
      },
      locations: {
        saved: locations,
        selected: locations,
      },
      technologies: {
        saved: technologies,
        selected: technologies,
      },
      subCategories: {
        saved: subCategories,
        selected: subCategories,
      },
      disableSubmit: false,
    };

    return formState;
  };

  /**
   * IMPORTANT PIECE. this function is passed as a callback to change component state from parent and trigger re-render.
   * @param {Object} userPreferences userPreferences from parent component.
   */
  resetLocalUserPreferencesFromParent = (userPreferences) => {
    const newState = this.setLocalUserPreferences(userPreferences);
    this.setState(newState, () => {
      this.setFormValues();
    });
  };

  // TODO DRY these events handlers. centralize to one function
  onCompanySizesCheckBoxChange = (selected) => {
    const { onChange } = this.props;
    const { sizes } = this.state;

    this.setState(
      {
        sizes: {
          saved: sizes.saved,
          selected,
          allSelected: selected.length === COMPANY_SIZES.length,
          all: COMPANY_SIZES,
        },
      },
      () => {
        onChange({
          sizes: selected,
        });
      }
    );
  };

  onCompanySizesCheckAllCheckBoxChange = (e) => {
    this.setState({
      sizes: {
        selected: e.target.checked ? COMPANY_SIZES : [],
        allSelected: e.target.checked,
        all: COMPANY_SIZES,
      },
    });
  };

  onTargetSectorsCheckAllCheckBoxChange = (e) => {
    this.setState({
      sectors: {
        selected: e.target.checked ? COMPANY_SECTORS : [],
        allSelected: e.target.checked,
        all: COMPANY_SECTORS,
      },
    });
  };

  onTargetSectorsCheckBoxChange = (selected) => {
    const { onChange } = this.props;
    const { sectors } = this.state;

    this.setState(
      {
        sectors: {
          saved: sectors.saved,
          selected,
          allSelected: selected.length === COMPANY_SECTORS.length,
          all: COMPANY_SECTORS,
        },
      },
      () => {
        onChange({
          sectors: selected,
        });
      }
    );
  };

  onPreferredLocationsChange = (vals) => {
    const { onChange } = this.props;
    const { locations } = this.state;
    this.setState(
      {
        locations: {
          saved: locations.saved,
          selected: vals.map((v) => {
            return {
              id: v.key,
              name: v.label,
            };
          }),
        },
      },
      () => {
        onChange({
          locations: vals.map((val) => {
            return val.label;
          }),
        });
      }
    );
  };

  onPreferredTechnologiesChange = (vals) => {
    const { technologies } = this.state;
    this.setState(
      {
        technologies: {
          saved: technologies.saved,
          selected: vals,
        },
      },
      () => {
        const { onChange } = this.props;
        onChange({
          technologies: vals.map((val) => {
            const keyData = val.key.split('__');
            return {
              id: keyData[0],
              title: val.label,
              subCategory: keyData[1],
            };
          }),
        });
      }
    );
  };

  onPreferredSubCategoriesChange = (vals) => {
    const { subCategories } = this.state;
    const { mixpanel } = this.props;

    const categorySelected = differenceBy(vals, subCategories.selected, 'label');

    this.setState(
      {
        subCategories: {
          saved: subCategories.saved,
          selected: vals.map((val) => {
            return {
              name: val.key,
              label: val.label,
            };
          }),
        },
      },
      () => {
        const { onChange } = this.props;
        onChange({
          subCategories: vals.map((val) => {
            return {
              name: val.key,
              label: val.label,
            };
          }),
        });
      }
    );
    // #TODO #FIXME make it a part of central logging. that logs and monitors as well
    if (mixpanel && categorySelected && categorySelected.length > 0) {
      mixpanel.track('intent_tab', {
        payload: { name: 'Select Technology Categories', category: categorySelected[0].label },
      });
    }
  };

  _adapter_preferencesAPILocations_locationsAutoComplete = (preferencesAPILocations = []) => {
    const locationsAutoComplete = preferencesAPILocations.map((val) => {
      if (isString(val)) {
        return {
          id: val,
          name: val,
        };
      }
      return val;
    });
    return locationsAutoComplete;
  };

  _adapter_locationsSuggestionsAPI_userPreferenceslocationAutoComplete = async (query) => {
    const { getLocationsSuggestions } = this.props;
    let locations = await getLocationsSuggestions(query);
    locations = uniqBy(locations, 'text');
    locations = locations.map((val) => {
      let id;
      if (val.type === 'country') {
        id = kebabCase(val.text);
      } else if (val.type === 'state') {
        id = `${kebabCase(val.text)}__${kebabCase(val.country)}`;
      } else {
        id = `${kebabCase(val.text)}__${kebabCase(val.state)}__${kebabCase(val.country)}`;
      }
      return {
        id,
        name: val.text,
      };
    });
    locations = uniqBy(locations, 'id');
    return locations;
  };

  getSubCategoriesAndTechnologiesSuggestions = async (query) => {
    let techSubCategories = await this._adapter_technologiesSuggestionsAPI_userPreferencesTechnologiesAutoComplete(
      query
    );
    const subCategories = await this._adapter_subCategoriesSuggestionsAPI_userPreferencesSubCategoriesAutoComplete(
      query
    );
    techSubCategories = uniqBy(techSubCategories, 'name');
    techSubCategories = sortBy(techSubCategories, 'name');

    const combined = [...subCategories, ...techSubCategories];

    return combined;
  };

  _adapter_subCategoriesSuggestionsAPI_userPreferencesSubCategoriesAutoComplete = async (query) => {
    const { getSubCategoriesSuggestions } = this.props;

    let subCategories = await getSubCategoriesSuggestions(query);

    subCategories = subCategories.map((val) => {
      return {
        name: val.subCategory,
        label: val.text,
      };
    });

    return subCategories;
  };

  _adapter_technologiesSuggestionsAPI_userPreferencesTechnologiesAutoComplete = async (query) => {
    const { getTechnologiesSuggestions } = this.props;

    let technologies = await getTechnologiesSuggestions(query);

    technologies = technologies.map((val) => {
      return {
        name: val.subCategory,
        label: val.subCategoryLabel,
      };
    });

    return technologies;
  };

  disableFormSubmit = () => {
    this.setState(
      {
        // eslint-disable-next-line react/no-unused-state
        disableSubmit: true,
      },
      () => {
        const { onChange } = this.props;
        onChange({
          disableSubmit: true,
        });
      }
    );
  };

  render() {
    const { disabled } = this.props;
    const { sizes, locations, subCategories, sectors } = this.state;

    return (
      <Spin spinning={disabled}>
        <div className="preferences-drawer__form">
          <Form layout="vertical" ref={this.preferencesForm}>
            {/* <Form.Item
              className="preferences-drawer__form-field preferences-drawer__form-field--technologies"
              name="technologies"
              label={
                // eslint-disable-next-line react/jsx-wrap-multilines
                <h3 style={{ fontSize: '16px', margin: '15px 0px', color: '#29285f' }}>
                  Select&nbsp;
                  <b>Technology</b>
                </h3>
              }
              rules={[
                {
                  required: false,
                  message: 'Please add at least one Technology',
                },
              ]}
            >
              <CustomMultiSelect
                init={technologies.selected}
                fetchData={this._adapter_technologiesSuggestionsAPI_userPreferencesTechnologiesAutoComplete}
                onChange={this.onPreferredTechnologiesChange}
                placeholder="Type Technology"
                valParam={(val) => {
                  return val.label;
                }}
                keyParam={(val) => {
                  return val.name;
                }}
              />
            </Form.Item> */}
            <Form.Item
              className="preferences-drawer__form-field preferences-drawer__form-field--sub-categories"
              name="subCategories"
              label={
                // eslint-disable-next-line react/jsx-wrap-multilines
                <h3 style={{ fontSize: '16px', margin: '15px 0px', color: '#29285f' }}>
                  Select&nbsp;
                  <b>Technology Category&nbsp;</b>
                  You Sell Into&nbsp;
                  <Popover
                    placement="bottom"
                    content={() => {
                      return (
                        <div>
                          Adding technology categories will help Slintel recommend more active,
                          <br />
                          high-intent prospects from your target industries
                        </div>
                      );
                    }}
                  >
                    <InfoCircleOutlined />
                  </Popover>
                  <br />
                  <span style={{ fontSize: '85%', color: '#a5a5a5' }}>
                    Or select&nbsp;
                    <b>technology</b>
                    &nbsp;to derive category&nbsp;
                  </span>
                </h3>
              }
              rules={[
                {
                  required: false,
                  message: 'Please add at least one Category or Technology',
                },
              ]}
            >
              <CustomMultiSelect
                init={subCategories.selected}
                fetchData={this.getSubCategoriesAndTechnologiesSuggestions}
                onChange={this.onPreferredSubCategoriesChange}
                placeholder="Type Category"
                valParam={(val) => {
                  return val.label;
                }}
                keyParam={(val) => {
                  return val.name;
                }}
              />
            </Form.Item>
            <Form.Item
              valuePropName="checked"
              className="preferences-drawer__form-field preferences-drawer__form-field--company-size"
              name="sizes"
              label={
                // eslint-disable-next-line react/jsx-wrap-multilines
                <h3 style={{ fontSize: '16px', margin: '15px 0px', color: '#29285f' }}>
                  Select&nbsp;
                  <b>Target Company Size</b>
                  &nbsp;
                  <Popover
                    placement="bottom"
                    content={() => {
                      return (
                        <div>
                          Specifying the size of the companies you want to target
                          <br />
                          will help you find prospects that better fit your target market
                        </div>
                      );
                    }}
                  >
                    <InfoCircleOutlined />
                  </Popover>
                </h3>
              }
              rules={[
                {
                  required: false,
                  // validator: this.checkCompanySizesCheckBox,
                  message: 'Please select at least one Company Size!',
                },
              ]}
            >
              {/* <div>
                <Checkbox onChange={this.onCompanySizesCheckAllCheckBoxChange} checked={sizes.allSelected}>
                  All
                </Checkbox>
              </div> */}
              <CheckboxGroup onChange={this.onCompanySizesCheckBoxChange} value={sizes.selected}>
                <Row>
                  {sizes.all.map((val) => {
                    return (
                      <Col span={6} key={`col_${val}`}>
                        <Checkbox value={val} key={val}>
                          {val}
                        </Checkbox>
                      </Col>
                    );
                  })}
                </Row>
              </CheckboxGroup>
            </Form.Item>
            <Form.Item
              className="preferences-drawer__form-field preferences-drawer__form-field--locations"
              name="locations"
              label={
                // eslint-disable-next-line react/jsx-wrap-multilines
                <h3 style={{ fontSize: '16px', margin: '15px 0px', color: '#29285f' }}>
                  Select&nbsp;
                  <b>Target Locations</b>
                  &nbsp;
                  <Popover
                    placement="bottom"
                    content={() => {
                      return (
                        <div>
                          Defining locations here will enable Slintel to suggest high-intent
                          <br />
                          prospects from the regions that your team is currently targeting
                        </div>
                      );
                    }}
                  >
                    <InfoCircleOutlined />
                  </Popover>
                </h3>
              }
              rules={[
                {
                  required: false,
                  message: 'Please add at least one Location',
                },
              ]}
            >
              <CustomMultiSelect
                init={locations.selected}
                fetchData={this._adapter_locationsSuggestionsAPI_userPreferenceslocationAutoComplete}
                onChange={this.onPreferredLocationsChange}
                placeholder="Type Locations"
                valParam={(val) => {
                  return val.name;
                }}
                keyParam={(val) => {
                  return val.id;
                }}
              />
            </Form.Item>
            {/* <Form.Item
              valuePropName="checked"
              className="preferences-drawer__form-field preferences-drawer__form-field--personas"
              name="targetPersonas"
              label={
                // eslint-disable-next-line react/jsx-wrap-multilines
                <h3 style={{ fontSize: '16px', margin: '15px 0px', color: '#29285f' }}>
                  Select Target&nbsp;
                  <b>Persona</b>
                </h3>
              }
              rules={[
                {
                  // required: false,
                  // validator: this.checkTargetPersonaCheckBox,
                  message: 'Please select at least one Target Persona!',
                },
              ]}
            >
              {/* <div>
                <Checkbox onChange={this.onTargetPersonasCheckAllCheckBoxChange} checked={targetPersonas.allSelected}>
                  All
                </Checkbox>
              </div> */}
            {/* <CheckboxGroup onChange={this.onTargetPersonasCheckBoxChange} value={targetPersonas.selected}>
                <Row>
                  {targetPersonas.all.map((val) => {
                    return (
                      <Col span={12} key={`col_${val}`}>
                        <Checkbox value={val} key={val}>
                          {val}
                        </Checkbox>
                      </Col>
                    );
                  })}
                </Row>
              </CheckboxGroup>
            </Form.Item> */}
            <Form.Item
              valuePropName="checked"
              className="preferences-drawer__form-field preferences-drawer__form-field--sectors"
              name="sectors"
              label={
                // eslint-disable-next-line react/jsx-wrap-multilines
                <h3 style={{ fontSize: '16px', margin: '15px 0px', color: '#29285f' }}>
                  Select&nbsp;
                  <b>Target Sector</b>
                  &nbsp;
                  <Popover
                    placement="bottom"
                    content={() => {
                      return (
                        <div>
                          Choosing sectors here will allow Slintel to recommend companies
                          <br />
                          that are more likely to make a purchase from you
                        </div>
                      );
                    }}
                  >
                    <InfoCircleOutlined />
                  </Popover>
                </h3>
              }
              rules={[
                {
                  required: false,
                  // validator: this.checkTargetSectorsCheckBox,
                  message: 'Please select at least one Target Sector!',
                },
              ]}
            >
              {/* <div>
                <Checkbox onChange={this.onTargetSectorsCheckAllCheckBoxChange} checked={sectors.allSelected}>
                  All
                </Checkbox>
              </div> */}
              <CheckboxGroup onChange={this.onTargetSectorsCheckBoxChange} value={sectors.selected}>
                <Row>
                  {sectors.all.map((val) => {
                    return (
                      <Col span={12} key={`col_${val}`}>
                        <Checkbox value={val} key={val}>
                          {val}
                        </Checkbox>
                      </Col>
                    );
                  })}
                </Row>
              </CheckboxGroup>
            </Form.Item>
          </Form>
        </div>
      </Spin>
    );
  }
}

PreferencesForm.propTypes = {
  userPreferences: PropTypes.shape({
    sizes: PropTypes.arrayOf(PropTypes.string).isRequired,
    technologies: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    subCategories: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    companyFunction: PropTypes.arrayOf(PropTypes.string).isRequired,
    sectors: PropTypes.arrayOf(PropTypes.string).isRequired,
    locations: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  resetFormState: PropTypes.func.isRequired,
  formReference: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  mixpanel: PropTypes.shape({
    track: PropTypes.func,
  }),
  getLocationsSuggestions: PropTypes.func.isRequired,
  getTechnologiesSuggestions: PropTypes.func.isRequired,
  getSubCategoriesSuggestions: PropTypes.func.isRequired,
};

PreferencesForm.defaultProps = {
  mixpanel: null,
};

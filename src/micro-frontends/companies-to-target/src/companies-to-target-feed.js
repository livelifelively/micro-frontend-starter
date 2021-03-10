/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Button, Row, Col, Spin } from 'antd';
import { sortBy, isEqual, isEmpty } from 'lodash';

import { COMPANIES_TO_TARGET } from '@slintel/cc-constants';

import SubCategoriesDropdown from '@slintel/bc-sub-categories-dropdown';
import CompaniesList from '@slintel/bc-companies-list';
import PropensitiesBrief, { MINIMUM_SCORE_THRESHOLD } from '@slintel/bc-propensities-brief';

import ActiveFilterOverview from './active-filter-overview';
import CompaniesToTargetContext from './companies-to-target-context';

const { PROPENSITY_SCORE_COMPANIES_TO_TARGET, COMPANY_LIST_API_REQUEST_LIMIT } = COMPANIES_TO_TARGET;

/**
 * Companies listing with Propensity scores and filter options to know which companies to target
 * CONTAINER CLASS - Handle partials/components integration and Data only
 */
class CompaniesToTargetFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // TODO: fetch user from redux state or as props.
      subCategories: [],
      filteredCompanies: [],
      loadingCompaniesToTarget: false,
      activeFilters: {
        selectedTimeFrom: moment()
          .startOf('day')
          .subtract(PROPENSITY_SCORE_COMPANIES_TO_TARGET.DEFAULT_DAYS_FROM, 'day')
          .unix(),
        subCategory: null,
      },
      companiesToTargetPagination: {
        total: 0,
        limit: COMPANY_LIST_API_REQUEST_LIMIT,
        fetchedDataTo: 0,
      },
    };
  }

  async componentDidMount() {
    this.setState({
      loadingCompaniesToTarget: true,
    });

    const { userPreferences } = this.props;
    const { activeFilters } = this.state;
    const subCategories = sortBy(userPreferences.subCategories, (val) => val.label);

    await new Promise((resolve) => {
      this.setState(
        {
          subCategories,
          loadingCompaniesToTarget: false,
          activeFilters: {
            ...activeFilters,
            subCategory: subCategories.length ? subCategories[0] : null,
          },
        },
        resolve
      );
    });
    await this._apiCall_getCompainesToTargetForFiltersAndUserPreferences();
  }

  async componentDidUpdate(prevProps) {
    const { companiesFilter, userPreferences } = this.props;
    if (!isEqual(prevProps.companiesFilter, companiesFilter) || !isEqual(prevProps.userPreferences, userPreferences)) {
      const { activeFilters } = this.state;
      const subCategories = sortBy(userPreferences.subCategories, (val) => val.label);

      await new Promise((resolve) => {
        this.setState(
          {
            subCategories,
            activeFilters: {
              ...activeFilters,
              subCategory: subCategories.length ? subCategories[0] : null,
            },
          },
          resolve
        );
      });
      await this.resetCompaniesToTarget();
      await this._apiCall_getCompainesToTargetForFiltersAndUserPreferences();
    }
  }

  generateGoToCompaniesUrl = () => {
    const { companiesFilter } = this.props;
    const { oldDashboardURL } = this.context;

    let url = `${oldDashboardURL}companies?`;
    if (companiesFilter.sectors && companiesFilter.sectors.length) {
      companiesFilter.sectors.forEach((val) => {
        url += `company_sector=${encodeURIComponent(val)}&`;
      });
    }

    if (companiesFilter.locations && companiesFilter.locations.length) {
      companiesFilter.locations.forEach((val) => {
        url += `company_location=${encodeURIComponent(val)}&`;
      });
    }

    if (companiesFilter.sizes && companiesFilter.sizes.length) {
      companiesFilter.sizes.forEach((val) => {
        url += `company_size=${encodeURIComponent(val)}&`;
      });
    }

    // if (companiesFilter.technologies && companiesFilter.technologies.length) {
    //   companiesFilter.technologies.forEach((val) => {
    //     url += `technologies=${encodeURIComponent(val.subCategory) || encodeURIComponent(val.subCat)}|${
    //       encodeURIComponent(val.technology) || encodeURIComponent(val.title)
    //     }&`;
    //   });
    // }

    // company_funding_range;
    return url;
  };

  resetCompaniesToTarget = async () => {
    await new Promise((resolve) => {
      return this.setState(
        {
          companiesToTargetPagination: {
            total: 0,
            limit: COMPANY_LIST_API_REQUEST_LIMIT,
            fetchedDataTo: 0,
          },
          // activeFilters: {
          //   selectedTimeFrom: moment()
          //     .startOf('day')
          //     .subtract(PROPENSITY_SCORE_COMPANIES_TO_TARGET.DEFAULT_DAYS_FROM, 'day')
          //     .unix(),
          //   subCategory: null,
          // },
          filteredCompanies: [],
        },
        resolve
      );
    });
  };

  _apiCall_getCompainesToTargetForFiltersAndUserPreferences = async (
    pageNumber = 1,
    pageSize = COMPANY_LIST_API_REQUEST_LIMIT
  ) => {
    const { activeFilters } = this.state;
    const { companiesFilter, type, togglePreferencesDrawerVisibility } = this.props;
    const { apiRequests, setCurrentFilterSet } = this.context;
    const { getCompainesToTargetForFiltersAndUserPreferences } = apiRequests.companiesToTargetAPI;

    if (isEmpty(companiesFilter)) return;

    try {
      this.setState({
        loadingCompaniesToTarget: true,
        goToCompaniesUrl: this.generateGoToCompaniesUrl(),
      });
      // what if no subcategory are there. #PROD
      const relevantSubCategories = activeFilters.subCategory ? [activeFilters.subCategory] : [];
      const data = await getCompainesToTargetForFiltersAndUserPreferences(
        companiesFilter,
        {
          subCategories: relevantSubCategories,
          timeFrom: activeFilters.selectedTimeFrom,
        },
        {
          from: pageNumber * pageSize - pageSize,
          limit: pageSize,
        },
        type
      );

      const { setCurrentTotalDataCount } = this.context;
      setCurrentTotalDataCount(data.total);

      setCurrentFilterSet({
        companiesFilter,
        subCategories: relevantSubCategories,
        timeFrom: activeFilters.selectedTimeFrom,
        type,
      });

      const sortedCompaniesScores = this.formatCompaniesPropensitiesData(data, togglePreferencesDrawerVisibility);

      this.setState({
        filteredCompanies: sortedCompaniesScores,
        loadingCompaniesToTarget: false,
        companiesToTargetPagination: {
          // ...companiesToTargetPagination,
          total: data.total,
          // fetchedDataTo: companiesToTargetPagination.fetchedDataTo + data.propensities.length,
        },
      });
    } catch (e) {
      // FIXME: central logging library.
      // eslint-disable-next-line no-console
      console.log(e);
    }
  };

  formatCompaniesPropensitiesData = (data, togglePreferencesDrawerVisibility) => {
    // sort
    const sortedCompaniesScores = sortBy(data.propensities, (a) => {
      return -1 * a.propensity.score;
    });

    return sortedCompaniesScores.map((val) => {
      // This keyed data is used to render table columns
      return {
        ...val,
        propensity: {
          ...val.propensity,
          brief: (
            <PropensitiesBrief
              buyingSignals={val.buyingSignals}
              subCategory={val.subcategory}
              category={val.category}
              subcategoryLabel={val.subcategoryLabel}
            />
          ),
        },
        buyingSignals: {
          category: val.category,
          subcategory: val.subcategory,
          subcategoryLabel: val.subcategoryLabel,
          ...val.buyingSignals,
          minimumScoresThreshold: MINIMUM_SCORE_THRESHOLD,
          togglePreferencesDrawerVisibility,
        },
      };
    });
  };

  fetchMoreDataOnScrollHitBottom = async (pageNumber, pageSize) => {
    await this._apiCall_getCompainesToTargetForFiltersAndUserPreferences(pageNumber, pageSize);
  };

  onSubCategorySelect = async (val) => {
    console.log(val);
    const { activeFilters, subCategories } = this.state;
    await this.resetCompaniesToTarget();
    await new Promise((resolve) => {
      this.setState(
        {
          activeFilters: {
            ...activeFilters,
            subCategory: subCategories.filter((v) => v.name === val)[0],
          },
        },
        resolve
      );
    });
    this._apiCall_getCompainesToTargetForFiltersAndUserPreferences();
  };

  infoStringActiveSubCategories = (subcategory = [], activeSubcategory, totalCompanies) => {
    const { togglePreferencesDrawerVisibility, type, companiesFilter } = this.props;
    if (type === 'filter') {
      return (
        <>
          Total&nbsp;
          <b>{totalCompanies}</b>
          &nbsp;companies have high buying propensity based on Company Saved Filter:&nbsp;
          <b>{companiesFilter.name}</b>
        </>
      );
    }
    if (subcategory.length === 0) {
      return (
        <>
          Showing all&nbsp;
          <b>{totalCompanies}</b>
          &nbsp;companies. To view high buying propensity companies&nbsp;
          <a onClick={togglePreferencesDrawerVisibility}>set your sales preferences.</a>
        </>
      );
    }

    // let infoString = '';
    // if (activeSubcategory.label !== 'All') {
    //   infoString += ` ${activeSubcategory.label}`;
    // } else if (subcategory.length === 2) {
    //   infoString += ` ${subcategory[1].label}`;
    // } else if (subcategory.length === 3) {
    //   infoString += ` ${subcategory[1].label} and ${subcategory[2].label}`;
    // } else if (subcategory.length > 3) {
    //   infoString += ` ${subcategory[1].label}, ${subcategory[2].label} and ${subcategory.length - 3} others`;
    // }

    return (
      <>
        Total&nbsp;
        <b>{totalCompanies}</b>
        &nbsp;companies have high buying propensity based on selected technology categories.
        {/* <a onClick={togglePreferencesDrawerVisibility}>{infoString}</a> */}
      </>
    );
  };

  render() {
    const {
      filteredCompanies,
      subCategories,
      loadingCompaniesToTarget,
      companiesToTargetPagination,
      activeFilters,
      goToCompaniesUrl,
      // timeRanges,
    } = this.state;
    const { togglePreferencesDrawerVisibility, companiesFilter, type, mixpanel } = this.props;
    const { oldDashboardURL, toggleAddToListDrawerVisibility, setCheckedItems } = this.context;
    return (
      <Spin spinning={loadingCompaniesToTarget}>
        <div className="companies-to-target">
          <Row className="companies-to-target__brief">
            <Col span={16}>
              <ActiveFilterOverview
                infoString={this.infoStringActiveSubCategories(
                  subCategories,
                  activeFilters.subCategory,
                  companiesToTargetPagination.total,
                  goToCompaniesUrl
                )}
                companiesFilter={companiesFilter}
                type={type}
              />
            </Col>
            <Col span={8}>
              <div className="subcategory-select">
                <div className="subcategory-select__title">Coming From Preferences:</div>
                <div className="subcategory-select__sub-title">Enhance results by adding your technology category</div>
                <Row>
                  <Col>
                    {subCategories.length > 0 ? (
                      <SubCategoriesDropdown
                        className="subcategories-drop-down"
                        subCategories={subCategories}
                        onSelect={this.onSubCategorySelect}
                        selected={activeFilters.subCategory}
                      />
                    ) : (
                      <SubCategoriesDropdown className="subcategories-drop-down" subCategories={[]} />
                    )}
                  </Col>
                  <Col>
                    {/* <Tooltip placement="bottom" title="Adding technology will not affect your saved filter"> */}
                    <Button type="subtle" onClick={togglePreferencesDrawerVisibility}>
                      Add or Edit
                    </Button>
                    {/* </Tooltip> */}
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
          {/* <Row gutter={20} justify="space-between" className="companies-to-target__filters">
            <Col flex={6}>
              {subCategories.length > 1 && (
                <SubCategoriesDropdown
                  className="subcategories-drop-down"
                  subCategories={subCategories}
                  onSelect={this.onSubCategorySelect}
                  selected={activeFilters.subCategory}
                />
              )}
            </Col>
            <Col flex={6} style={{ textAlign: 'right' }}>
              {type === 'preferences' && (
                <Button icon={<SettingOutlined />} onClick={togglePreferencesDrawerVisibility}>
                  Edit Preferences
                </Button>
              )}
            </Col>
          </Row> */}
          <CompaniesList
            companies={filteredCompanies}
            className="companies-to-target__list"
            totalDataUnits={companiesToTargetPagination.total}
            fetchCompanies={this.fetchMoreDataOnScrollHitBottom}
            preferencesDrawerToggle={togglePreferencesDrawerVisibility}
            identifier={`companies-list--${companiesFilter.id || 'all'}`}
            mixpanel={mixpanel}
            type={type}
            oldDashboardURL={oldDashboardURL}
            pageSize={COMPANY_LIST_API_REQUEST_LIMIT}
            addToListDrawerToggle={toggleAddToListDrawerVisibility}
            setCheckedItems={setCheckedItems}
          />
        </div>
      </Spin>
    );
  }
}

CompaniesToTargetFeed.propTypes = {
  togglePreferencesDrawerVisibility: PropTypes.func,
  companiesFilter: PropTypes.shape({
    id: PropTypes.number,
    subCategories: PropTypes.arrayOf(PropTypes.shape({})),
    sectors: PropTypes.arrayOf(PropTypes.string),
    locations: PropTypes.arrayOf(PropTypes.string),
    sizes: PropTypes.arrayOf(PropTypes.string),
    name: PropTypes.string,
    technologies: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
  type: PropTypes.string.isRequired,
  mixpanel: PropTypes.shape({
    track: PropTypes.func,
  }),
  userPreferences: PropTypes.shape({
    id: PropTypes.number,
    subCategories: PropTypes.arrayOf(PropTypes.shape({})),
    sectors: PropTypes.arrayOf(PropTypes.string),
    locations: PropTypes.arrayOf(PropTypes.string),
    sizes: PropTypes.arrayOf(PropTypes.string),
    name: PropTypes.string,
    technologies: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
};

CompaniesToTargetFeed.contextType = CompaniesToTargetContext;

CompaniesToTargetFeed.defaultProps = {
  mixpanel: null,
  togglePreferencesDrawerVisibility: () => {},
};

export default CompaniesToTargetFeed;

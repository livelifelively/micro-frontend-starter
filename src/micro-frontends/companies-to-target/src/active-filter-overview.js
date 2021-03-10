/* eslint-disable import/no-unresolved */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

// import { Button } from 'antd';

import FilterPills from '@slintel/bm-filter-pills';
import { USER_PREFERNCES } from '@slintel/cc-constants';

const { ACTIVE_USER_PREFERNCES } = USER_PREFERNCES;

class ActiveFilterOverview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterPillsExpanded: true,
    };
  }

  toggleFilterPillsView = () => {
    const { filterPillsExpanded } = this.state;
    this.setState({
      filterPillsExpanded: !filterPillsExpanded,
    });
  };

  showExpandButton = (companiesFilter, type) => {
    if (type === 'preferences') {
      let showExpand = false;
      Object.values(ACTIVE_USER_PREFERNCES).forEach((val) => {
        showExpand = showExpand || (companiesFilter[val.key] && companiesFilter[val.key].length > 0);
      });
      return showExpand;
    }
    return true;
  };

  render() {
    const { infoString, companiesFilter, type } = this.props;
    const { filterPillsExpanded } = this.state;

    // const showExpandButton = this.showExpandButton(companiesFilter, type);

    return (
      <div className="active-filter-overview">
        <div>
          <div className="active-filter-overview__title">
            {type === 'preferences' ? `Preferences ` : `Filters `}
            Criteria:
          </div>
          <div className="active-filter-overview__info-string">
            {infoString}
            &nbsp;
            {/* {showExpandButton && (
              <Button type="link" onClick={this.toggleFilterPillsView}>
                {filterPillsExpanded ? 'Collapse Filters' : 'Expand Filters'}
              </Button>
            )} */}
          </div>
        </div>
        <FilterPills
          filter={companiesFilter}
          filterCategory={type}
          controlClassNames={
            filterPillsExpanded
              ? 'active-filter-overview__filter-pills--expanded'
              : 'active-filter-overview__filter-pills--collapsed'
          }
        />
      </div>
    );
  }
}

ActiveFilterOverview.propTypes = {
  infoString: PropTypes.node.isRequired,
  companiesFilter: PropTypes.shape({
    id: PropTypes.number,
    subCategories: PropTypes.arrayOf(PropTypes.shape({})),
    sectors: PropTypes.arrayOf(PropTypes.string),
    locations: PropTypes.arrayOf(PropTypes.string),
    sizes: PropTypes.arrayOf(PropTypes.string),
    name: PropTypes.string,
    technologies: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  type: PropTypes.string.isRequired,
};

ActiveFilterOverview.defaultProps = {
  companiesFilter: {},
};

export default ActiveFilterOverview;

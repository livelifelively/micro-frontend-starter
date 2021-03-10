/* eslint-disable react/jsx-wrap-multilines */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Spin, Popover } from 'antd';
import { map, startCase } from 'lodash';

import CompaniesToTargetFeed from './companies-to-target-feed';

export default class FeedTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  render() {
    const { activeTab, loading } = this.state;
    // eslint-disable-next-line react/prop-types
    const { tabs, togglePreferencesDrawerVisibility, mixpanel } = this.props;

    return (
      <Spin spinning={loading}>
        <Tabs
          size="large"
          activeKey={activeTab}
          tabPosition="top"
          // style={{ height: 780 }}
          className="filter-tabs"
          onChange={this.onFilterTabChange}
        >
          <Tabs.TabPane tab="Recommended" key="preferences">
            <div className="filter-tabs--feed">
              <CompaniesToTargetFeed
                // toggleFiltersDrawerVisibility={toggleFiltersDrawerVisibility}
                togglePreferencesDrawerVisibility={togglePreferencesDrawerVisibility}
                companiesFilter={tabs.preferences}
                mixpanel={mixpanel}
                type="preferences"
                userPreferences={tabs.preferences}
              />
            </div>
          </Tabs.TabPane>

          {map(tabs.filters, (val) => {
            return (
              <Tabs.TabPane
                tab={
                  <Popover
                    placement="bottom"
                    content={() => {
                      return <div>{`Company Saved Filter: ${val.name}`}</div>;
                    }}
                  >
                    <div className="companies-to-target__tab">{startCase(val.name)}</div>
                  </Popover>
                }
                key={val.name}
              >
                <div className="filter-tabs--feed">
                  <CompaniesToTargetFeed
                    togglePreferencesDrawerVisibility={togglePreferencesDrawerVisibility}
                    companiesFilter={val}
                    mixpanel={mixpanel}
                    type="filter"
                    userPreferences={tabs.preferences}
                  />
                </div>
              </Tabs.TabPane>
            );
          })}
        </Tabs>
      </Spin>
    );
  }
}

FeedTabs.propTypes = {
  tabs: PropTypes.shape({
    filters: PropTypes.arrayOf(PropTypes.shape({})),
    preferences: PropTypes.shape({
      name: PropTypes.string,
    }),
  }).isRequired,
  togglePreferencesDrawerVisibility: PropTypes.func.isRequired,
  // toggleFiltersDrawerVisibility: PropTypes.func.isRequired,
  mixpanel: PropTypes.shape({
    track: PropTypes.func,
  }),
};

FeedTabs.defaultProps = {
  mixpanel: null,
};

/* eslint-disable react/jsx-wrap-multilines */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Spin } from 'antd';
// import { Tabs, Spin, Popover, Button } from 'antd';
// import { map, startCase, truncate } from 'lodash';

import NewsFeed from './news-feed';

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
    const { tabs, togglePreferencesDrawerVisibility, mixpanel, userId } = this.props;
    // const companiesInsightsRelativeUrl = '/#/companies';

    return (
      <Spin spinning={loading}>
        <Tabs
          size="large"
          activeKey={activeTab}
          tabPosition="top"
          style={{ height: 780 }}
          className="filter-tabs"
          onChange={this.onFilterTabChange}
        >
          <Tabs.TabPane tab="Recommended" key="preferences">
            <div className="filter-tabs--feed">
              <NewsFeed
                togglePreferencesDrawerVisibility={togglePreferencesDrawerVisibility}
                companiesFilter={tabs.preferences}
                mixpanel={mixpanel}
                type="preferences"
                userId={userId}
              />
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Global" key="global">
            <div className="filter-tabs--feed">
              <NewsFeed
                togglePreferencesDrawerVisibility={togglePreferencesDrawerVisibility}
                mixpanel={mixpanel}
                type="global"
                userId={userId}
              />
            </div>
          </Tabs.TabPane>

          {/* {map(tabs.filters, (val) => {
            return (
              <Tabs.TabPane
                tab={
                  <Popover
                    placement="bottom"
                    content={() => {
                      return <div>{`Company Saved Filter: ${val.name}`}</div>;
                    }}
                  >
                    {truncate(startCase(val.name), { length: 20 })}
                  </Popover>
                }
                key={val.name}
              >
                <div className="filter-tabs--feed">
                  <CompaniesToTargetFeed
                    // toggleFiltersDrawerVisibility={toggleFiltersDrawerVisibility}
                    // togglePreferencesDrawerVisibility={togglePreferencesDrawerVisibility}
                    companiesFilter={val}
                    mixpanel={mixpanel}
                    type="filter"
                  />
                </div>
              </Tabs.TabPane>
            );
          })} */}
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
  mixpanel: PropTypes.shape({
    track: PropTypes.func,
  }),
  userId: PropTypes.number.isRequired,
};

FeedTabs.defaultProps = {
  mixpanel: null,
};

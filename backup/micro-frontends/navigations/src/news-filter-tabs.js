/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-unresolved */

import React, { Component } from 'react';
import { Spin } from 'antd';
import PropTypes from 'prop-types';

import Cookies from '@qbila/s-cookies';

import PreferencesDrawer from '@qbila/bm-preferences-drawer';
import ShareNewsDrawer from '@qbila/bm-share-news-drawer';

import CompaniesToTargetAPI from '@qbila/api-companies-to-target';
import NewsAPI from '@qbila/api-news';
import Pusher from '@qbila/s-pusher';

import FeedTabs from './feed-tabs';
import NewsContext from './news-context';

class NewsFilterTabs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // TODO: fetch user from redux state or as props
      preferencesDrawerVisiblility: false,
      shareNewsDrawerVisibile: false,
      newsToShare: {},
      user: {},
      tabs: {
        preferences: null,
        global: null,
      },
      loading: false,
      preferencesLastUpdatedAt: null,
      apiRequests: {
        companiesToTargetAPI: CompaniesToTargetAPI({
          baseAPIURL: props.environmentVariables.baseAPIURL,
        }),
        newsAPI: NewsAPI({
          baseAPIURL: props.environmentVariables.baseAPIURL,
        }),
      },
      cookies: Cookies({ domainName: props.environmentVariables.domainName }),
      pusher: Pusher(props.environmentVariables.pusherConfig),
    };
  }

  async componentDidMount() {
    this.setState({
      loading: true,
    });
    const { apiRequests } = this.state;
    const { getDomainUsersList } = apiRequests.newsAPI;

    await this.getUserDetails();
    await this.subscribeToPusherChannels();
    await this._apiCall_getUserPreferences();
    const domainUsers = await getDomainUsersList();
    this.setState({
      loading: false,
      domainUsers,
    });
  }

  subscribeToPusherChannels = async () => {
    const { pusher, user } = this.state;

    const pusherChannel = pusher.subscribe(`dashboard-channel-${user.userId}`);
    // pusherChannel.bind(`export-status-${user.userId}`, this.pusherTest);

    return new Promise((resolve) => {
      this.setState(
        {
          pusherChannel,
        },
        resolve
      );
    });
  };

  /**
   * Fetch User preferences, add it to tabs
   */
  _apiCall_getUserPreferences = async () => {
    const { user, tabs, apiRequests } = this.state;
    const { getUserPreferences } = apiRequests.companiesToTargetAPI;

    try {
      const preferences = await getUserPreferences(user.userId);
      await new Promise((resolve) => {
        this.setState(
          {
            tabs: {
              preferences,
              ...tabs.filters,
            },
            preferencesLastUpdatedAt: preferences.updatedAt,
            preferencesCreatedAt: preferences.createdAt,
          },
          resolve
        );
      });
    } catch (e) {
      console.log(e);
    }
  };

  getUserDetails = async () => {
    // TODO: use state instead of cookie?
    const { cookies } = this.state;
    const user = cookies.getCookie('userToken');
    return new Promise((resolve) => {
      this.setState({ user }, resolve);
    });
  };

  togglePreferencesDrawerVisibility = () => {
    const { preferencesDrawerVisiblility } = this.state;
    this.setState({
      preferencesDrawerVisiblility: !preferencesDrawerVisiblility,
    });
  };

  toggleShareNewsDrawerVisibility = (newsItem) => {
    const { shareNewsDrawerVisibile } = this.state;
    this.setState({
      shareNewsDrawerVisibile: !shareNewsDrawerVisibile,
      newsToShare: newsItem || {},
    });
  };

  shareNews = (newsItem) => {
    const { apiRequests } = this.state;
    const { shareNewsOnEmail } = apiRequests.newsAPI;
    shareNewsOnEmail(newsItem);
  };

  updateContext = (contextVals) => {
    this.setState({
      ...contextVals,
    });
  };

  // TODO should be part of state. implement redux for this one.
  setUserPreferences = async (preferences, userPrefsUpdatedAt, userPreferencesCreatedAt) => {
    const { tabs, user, apiRequests } = this.state;
    const { checkIfUsersNewsFeedIsUpdated } = apiRequests.newsAPI;
    const { mixpanel } = this.props;

    this.setState({
      tabs: {
        preferences,
        filters: tabs.filters,
      },
      // #TODO communicate this to the other modules that use preferences.
      preferencesLastUpdatedAt: userPrefsUpdatedAt,
      preferencesCreatedAt: userPreferencesCreatedAt,
    });

    // set interval for polling operation
    checkIfUsersNewsFeedIsUpdated(user.userId);

    if (mixpanel) {
      const { keywords, companyFunction, ...payload } = preferences;
      mixpanel.track('intent_tab', { payload: { name: 'Save Preferences', preferences: payload } });
    }
  };

  render() {
    const {
      preferencesDrawerVisiblility,
      user,
      tabs,
      loading,
      shareNewsDrawerVisibile,
      newsToShare,
      domainUsers,
      preferencesLastUpdatedAt,
      preferencesCreatedAt,
      apiRequests,
      pusherChannel,
    } = this.state;
    const { mixpanel, environmentVariables } = this.props;

    const {
      getUserPreferences,
      getLocationsSuggestions,
      getTechnologiesSuggestions,
      getSubCategoriesSuggestions,
      updateUserPreferences,
    } = apiRequests.companiesToTargetAPI;

    return (
      <Spin spinning={loading}>
        <div className="news-feed-filter-tabs">
          {/* {tabs.preferences && tabs.filters && ( */}
          {tabs.preferences && (
            <NewsContext.Provider
              value={{
                shareNewsDrawerVisibile,
                toggleShareNewsDrawerVisibility: this.toggleShareNewsDrawerVisibility,
                preferencesLastUpdatedAt,
                preferencesCreatedAt,
                apiRequests,
                pusherChannel,
                oldDashboardURL: environmentVariables.oldDashboardURL,
              }}
            >
              <FeedTabs
                // toggleFiltersDrawerVisibility={this.toggleFiltersDrawerVisibility}
                togglePreferencesDrawerVisibility={this.togglePreferencesDrawerVisibility}
                onTabChange={this.onCompaniesFilterTabChange}
                tabs={tabs}
                mixpanel={mixpanel}
                userId={user.userId}
              />
            </NewsContext.Provider>
          )}
          {/* 
            #TODO #FIXME MUST REMOVE THE PREFERENCES DRAWER.
            Multiple instances. One already there in companies to target.
            To be added to Shell App in suitable context or global redux state
          */}
          {user.userId && (
            <>
              <PreferencesDrawer
                visible={preferencesDrawerVisiblility}
                onClose={this.togglePreferencesDrawerVisibility}
                onSave={this.setUserPreferences}
                userId={user.userId}
                mixpanel={mixpanel}
                getUserPreferences={getUserPreferences}
                getLocationsSuggestions={getLocationsSuggestions}
                getTechnologiesSuggestions={getTechnologiesSuggestions}
                getSubCategoriesSuggestions={getSubCategoriesSuggestions}
                updateUserPreferences={updateUserPreferences}
              />
            </>
          )}
          <ShareNewsDrawer
            visible={shareNewsDrawerVisibile}
            onClose={this.toggleShareNewsDrawerVisibility}
            onSave={this.shareNews}
            newsToShare={newsToShare}
            domainUsers={domainUsers}
          />
        </div>
      </Spin>
    );
  }
}
NewsFilterTabs.propTypes = {
  mixpanel: PropTypes.shape({
    track: PropTypes.func,
  }),
  environmentVariables: PropTypes.shape({
    baseAPIURL: PropTypes.string.isRequired,
    oldDashboardURL: PropTypes.string.isRequired,
    domainName: PropTypes.string.isRequired,
    pusherConfig: PropTypes.shape({}),
  }).isRequired,
};
NewsFilterTabs.defaultProps = {
  mixpanel: null,
};
export default NewsFilterTabs;

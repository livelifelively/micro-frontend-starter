/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-unresolved */

import React, { Component } from 'react';
import { Spin } from 'antd';
import PropTypes from 'prop-types';

import Cookies from '@slintel/s-cookies';

import PreferencesDrawer from '@slintel/bm-preferences-drawer';

import CompaniesToTargetAPI from '@slintel/api-companies-to-target';
import ListsAPI from '@slintel/api-lists';

import AddToListDrawer from '@slintel/bm-add-to-list-drawer';
import CreateListDrawer from '@slintel/bm-create-list-drawer';
import FeedTabs from './feed-tabs';
import CompaniesToTargetContext from './companies-to-target-context';

class CompaniesToTargetFilterTabs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // TODO: fetch user from redux state or as props
      preferencesDrawerVisiblility: false,
      addToListDrawerVisiblility: false,
      createListDrawerVisiblility: false,
      isFetchListItems: false,
      user: {},
      tabs: {
        preferences: null,
        filters: null,
      },
      isBulkSelected: false,
      loading: false,
      apiRequests: {
        companiesToTargetAPI: CompaniesToTargetAPI({
          baseAPIURL: props.environmentVariables.baseAPIURL,
        }),
        listsAPI: ListsAPI({
          baseAPIURL: props.environmentVariables.baseAPIURL,
        }),
      },
      cookies: Cookies({ domainName: props.environmentVariables.domainName }),
      checkedItems: [],
      currentFilterSet: {},
      currentTotalDataCount: 0,
    };
  }

  async componentDidMount() {
    this.setState({
      loading: true,
    });
    await this.getUserDetails();
    await this._apiCall_getUserPreferences();
    await this._apiCall_getCustomFilters();
    this.setState({
      loading: false,
    });
  }

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
          },
          resolve
        );
      });
    } catch (e) {
      console.log(e);
    }
  };

  _apiCall_getCustomFilters = async () => {
    const { user, tabs, apiRequests } = this.state;

    const { getCustomFilters } = apiRequests.companiesToTargetAPI;
    try {
      let filters = await getCustomFilters(user.userId);
      filters = filters.filter((v) => v.type === 'company');
      await new Promise((resolve) => {
        this.setState(
          {
            tabs: {
              preferences: tabs.preferences,
              filters,
            },
          },
          resolve
        );
      });
    } catch (e) {
      console.log(e);
    }
  };

  getUserDetails = async () => {
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

  toggleAddToListDrawerVisibility = (value) => {
    const { addToListDrawerVisiblility } = this.state;
    this.setState({
      addToListDrawerVisiblility: !addToListDrawerVisiblility,
      isBulkSelected: value,
    });
  };

  toggleCreateListDrawerVisibility = (value) => {
    this.setState({
      createListDrawerVisiblility: value,
    });
  };

  setCheckedItems = (items) => {
    this.setState({
      checkedItems: items,
    });
  };

  setCurrentFilterSet = (value) => {
    this.setState({
      currentFilterSet: value,
    });
  };

  setCurrentTotalDataCount = (value) => {
    this.setState({
      currentTotalDataCount: value,
    });
  };

  setUserPreferences = async (preferences) => {
    const { tabs } = this.state;
    const { mixpanel } = this.props;

    this.setState({
      tabs: {
        preferences,
        filters: tabs.filters,
      },
    });

    if (mixpanel) {
      const { keywords, companyFunction, ...payload } = preferences;
      mixpanel.track('intent_tab', { payload: { name: 'Save Preferences', preferences: payload } });
    }
  };

  setReloadListItems = (value) => {
    this.setState({
      isFetchListItems: value,
    });
  };

  render() {
    const {
      preferencesDrawerVisiblility,
      user,
      tabs,
      loading,
      apiRequests,
      addToListDrawerVisiblility,
      checkedItems,
      createListDrawerVisiblility,
      isFetchListItems,
      isBulkSelected,
      currentFilterSet,
      currentTotalDataCount,
    } = this.state;
    const { mixpanel, environmentVariables } = this.props;

    const {
      getUserPreferences,
      getLocationsSuggestions,
      getTechnologiesSuggestions,
      getSubCategoriesSuggestions,
      updateUserPreferences,
    } = apiRequests.companiesToTargetAPI;

    const { getLists, addItemsToList, createNewList, addIntentBulkItemsToList } = apiRequests.listsAPI;

    return (
      <Spin spinning={loading}>
        <div className="companies-to-target-filter-tabs">
          {tabs.preferences && tabs.filters && (
            <CompaniesToTargetContext.Provider
              value={{
                apiRequests,
                oldDashboardURL: environmentVariables.oldDashboardURL,
                toggleAddToListDrawerVisibility: this.toggleAddToListDrawerVisibility,
                addToListDrawerVisiblility,
                setCheckedItems: this.setCheckedItems,
                setCurrentFilterSet: this.setCurrentFilterSet,
                setCurrentTotalDataCount: this.setCurrentTotalDataCount,
              }}
            >
              <FeedTabs
                // toggleFiltersDrawerVisibility={this.toggleFiltersDrawerVisibility}
                togglePreferencesDrawerVisibility={this.togglePreferencesDrawerVisibility}
                onTabChange={this.onCompaniesFilterTabChange}
                tabs={tabs}
                mixpanel={mixpanel}
              />
            </CompaniesToTargetContext.Provider>
          )}
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
              <AddToListDrawer
                visible={addToListDrawerVisiblility}
                onClose={this.toggleAddToListDrawerVisibility}
                getLists={getLists}
                addItemsToList={addItemsToList}
                addIntentBulkItemsToList={addIntentBulkItemsToList}
                checkedItems={checkedItems}
                toggleCreateListDrawerVisibility={this.toggleCreateListDrawerVisibility}
                isFetchListItems={isFetchListItems}
                setReloadListItems={this.setReloadListItems}
                isBulkSelected={isBulkSelected}
                currentFilterSet={currentFilterSet}
                currentTotalDataCount={currentTotalDataCount}
              />
              <CreateListDrawer
                visible={createListDrawerVisiblility}
                onClose={this.toggleCreateListDrawerVisibility}
                onSubmit={createNewList}
                setReloadListItems={this.setReloadListItems}
              />
            </>
          )}
        </div>
      </Spin>
    );
  }
}

CompaniesToTargetFilterTabs.propTypes = {
  mixpanel: PropTypes.shape({
    track: PropTypes.func,
  }),
  environmentVariables: PropTypes.shape({
    baseAPIURL: PropTypes.string.isRequired,
    oldDashboardURL: PropTypes.string.isRequired,
    domainName: PropTypes.string.isRequired,
  }).isRequired,
};
CompaniesToTargetFilterTabs.defaultProps = {
  mixpanel: null,
};
export default CompaniesToTargetFilterTabs;

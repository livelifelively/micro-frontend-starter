/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import moment from 'moment';
import { Button, Row, Col, Spin } from 'antd';
import { cloneDeep, isEqual, isEmpty } from 'lodash';
import { SettingOutlined } from '@ant-design/icons';

// import SubCategoriesDropdown from '@slintel/bc-sub-categories-dropdown';
import ThemesDropdown from '@slintel/bc-news-themes-dropdown';
import TimeRangesDropdown from '@slintel/bc-time-ranges-dropdown';

import { COMPANIES_TO_TARGET, NEWS } from '@slintel/cc-constants';
import { showSuccess, showError } from '@slintel/s-notifications';

// import TimeRanges from './partials/time-ranges-dropdown';
import NewsFeedList from './news-feed-list';
import NewsContext from './news-context';

const { COMPANY_LIST_API_REQUEST_LIMIT } = COMPANIES_TO_TARGET;
const { NEWS_THEMES, NEWS_DATE_RANGE } = NEWS;

/**
 * News Feed
 * CONTAINER CLASS - Handle partials/components integration and Data only
 */
class NewsFeed extends Component {
  constructor(props) {
    super(props);
    const newsThemes = Object.values(NEWS_THEMES);
    const newsDateRange = cloneDeep(NEWS_DATE_RANGE);
    this.state = {
      // TODO: fetch user from redux state or as props.
      subCategories: [{ name: 'All Categories', label: 'All' }],
      newsThemes,
      newsDateRange,
      filteredNews: [],
      loading: false,
      activeFilters: {
        subCategory: { name: 'All Categories', label: 'All' },
        newsTheme: newsThemes.filter((v) => v.label === 'All')[0],
        newsDateRange: newsDateRange.filter((v) => v.default)[0],
      },
      newsFeedPagination: {
        total: 0,
        limit: COMPANY_LIST_API_REQUEST_LIMIT,
        page: 1,
      },
    };
  }

  async componentDidMount() {
    const { companiesFilter, type, userId } = this.props;
    const { pusherChannel } = this.context;

    if (companiesFilter) {
      this.setState({
        loading: true,
      });
      await new Promise((resolve) => {
        this.setState(
          {
            subCategories: [{ name: 'All Categories', label: 'All' }, ...companiesFilter.subCategories],
            loading: false,
          },
          resolve
        );
      });
    }

    if (type === 'preferences') {
      pusherChannel.bind(`export-status-${userId}`, this.pusherTest);
    }

    await this._apiCall_getNewsFeed();
  }

  async componentDidUpdate(prevProps) {
    // eslint-disable-next-line react/destructuring-assignment
    if (!isEqual(prevProps.companiesFilter, this.props.companiesFilter)) {
      const { companiesFilter } = this.props;
      await new Promise((resolve) => {
        this.setState(
          {
            subCategories: [{ name: 'All Categories', label: 'All' }, ...companiesFilter.subCategories],
          },
          resolve
        );
      });
      await this.resetNewsFeed();
      await this._apiCall_getNewsFeed();
    }
  }

  pusherTest = async (val) => {
    if (val.status === 'success') {
      await this.resetNewsFeed();
      await this._apiCall_getNewsFeed();
      showSuccess('Your News Feed is updated as per your new preferences.');
    } else {
      showError('Your News Feed failed to update.');
    }
  };

  resetNewsFeed = async () => {
    const { newsThemes, newsDateRange } = this.state;
    await new Promise((resolve) => {
      return this.setState(
        {
          newsFeedPagination: {
            total: 0,
            limit: COMPANY_LIST_API_REQUEST_LIMIT,
            page: 1,
          },
          activeFilters: {
            subCategory: { name: 'All Categories', label: 'All' },
            newsTheme: newsThemes.filter((v) => v.label === 'All')[0],
            newsDateRange: newsDateRange.filter((v) => v.default)[0],
          },
          filteredNews: [],
        },
        resolve
      );
    });
  };

  _apiCall_getNewsFeed = async () => {
    const { subCategories, activeFilters, newsFeedPagination, filteredNews } = this.state;
    const { companiesFilter, type, userId } = this.props;
    const { apiRequests } = this.context;

    const { newsAPI } = apiRequests;

    if (isEmpty(companiesFilter) && type !== 'global') return;

    try {
      this.setState({
        loading: true,
      });

      const relevantSubCategories =
        activeFilters.subCategory.label === 'All' ? subCategories : [activeFilters.subCategory];

      const data = await newsAPI.getNewsFeedForGlobalFiltersAndUserPreferences({
        companiesFilter,
        subCategories: relevantSubCategories,
        daysFrom: activeFilters.newsDateRange.value,
        theme: activeFilters.newsTheme.label,
        from: newsFeedPagination.fetchedDataTo,
        page: newsFeedPagination.page,
        limit: newsFeedPagination.limit,
        type,
        userId,
      });

      if (data !== 'REQUEST_FAILED') {
        const sortedNewsFeed = this.formatNewsFeedData(data);

        this.setState({
          filteredNews: [...filteredNews, ...cloneDeep(sortedNewsFeed)],
          newsFeedCreatedAt: this.formatNewsFeedCreatedAt(type, data.createdAt),
          loading: false,
          newsFeedPagination: {
            ...newsFeedPagination,
            total: data.total || 0,
            page: newsFeedPagination.page + 1,
            // fetchedDataTo: newsFeedPagination.fetchedDataTo + data.data.length,
          },
        });
      } else {
        this.setState({
          loading: false,
        });
        // TODO: throw error message.
      }
    } catch (e) {
      // FIXME: central logging library.
      // eslint-disable-next-line no-console
      console.log(e);
    }
  };

  // newsFeedCreated to be value if type is preferences and not new user (no meta data).
  // null if preferences and new user. undefined if type not preferences
  formatNewsFeedCreatedAt = (type, createdAt) => {
    let newsFeedCreatedAt;
    if (type === 'preferences') {
      if (createdAt) {
        newsFeedCreatedAt = createdAt;
      } else {
        newsFeedCreatedAt = null;
      }
    } else {
      newsFeedCreatedAt = undefined;
    }
    return newsFeedCreatedAt;
  };

  formatNewsFeedData = (data) => {
    return data.data;
  };

  fetchMoreDataOnScrollHitBottom = async () => {
    await this._apiCall_getNewsFeed();
  };

  onSubCategorySelect = async (val) => {
    const { activeFilters, subCategories } = this.state;

    await this.resetNewsFeed();
    this.setState(
      {
        activeFilters: {
          ...activeFilters,
          subCategory: subCategories.filter((v) => v.label === val)[0],
        },
      },
      () => {
        this._apiCall_getNewsFeed();
      }
    );
  };

  onThemeSelect = async (val) => {
    const { activeFilters, newsThemes } = this.state;

    await this.resetNewsFeed();
    this.setState(
      {
        activeFilters: {
          ...activeFilters,
          newsTheme: newsThemes.filter((v) => v.label === val)[0],
        },
      },
      () => {
        this._apiCall_getNewsFeed();
      }
    );
  };

  onDateRangeSelect = async (val) => {
    const { activeFilters, newsDateRange } = this.state;

    await this.resetNewsFeed();
    this.setState(
      {
        activeFilters: {
          ...activeFilters,
          newsDateRange: newsDateRange.filter((v) => v.value === parseInt(val, 10))[0],
        },
      },
      () => {
        this._apiCall_getNewsFeed();
      }
    );
  };

  getNewsFeedLoadingStateFromPreferencesMetaAndFeedMeta = () => {
    const { preferencesLastUpdatedAt, preferencesCreatedAt } = this.context;
    const { newsFeedCreatedAt } = this.state;

    // preferences are there.
    if (preferencesLastUpdatedAt || preferencesCreatedAt) {
      // newsfeed was there earlier, but is older than latest preferences
      if ((newsFeedCreatedAt && newsFeedCreatedAt < preferencesLastUpdatedAt) || newsFeedCreatedAt === null) {
        return 'PREFERENCES_UPDATED_GENERATING_NEWS_FEED';
      }
    }

    if (newsFeedCreatedAt === null) {
      return 'NEW_USER';
    }

    return '';
  };

  infoStringNewsFeed = (totalNews) => {
    const { togglePreferencesDrawerVisibility, type } = this.props;
    // const { newsFeedCreatedAt } = this.state;

    const state = this.getNewsFeedLoadingStateFromPreferencesMetaAndFeedMeta();

    // TODO what if no news?
    if (type === 'global') {
      return (
        <>
          Total&nbsp;
          <b>{totalNews}</b>
          &nbsp;news
        </>
      );
    }

    if (state === 'NEW_USER') {
      return <div />;
    }

    if (state === 'PREFERENCES_UPDATED_GENERATING_NEWS_FEED') {
      return <div>News based on your new preferences will be ready very soon.</div>;
    }

    return (
      <div>
        Showing all&nbsp;
        <b>{totalNews}</b>
        &nbsp;news, based on&nbsp;
        <a onClick={togglePreferencesDrawerVisibility}>your sales preferences.</a>
      </div>
    );
  };

  render() {
    const { loading, newsFeedPagination, activeFilters, filteredNews, newsThemes, newsDateRange } = this.state;
    const { togglePreferencesDrawerVisibility, type } = this.props;

    const loadingState = this.getNewsFeedLoadingStateFromPreferencesMetaAndFeedMeta();

    const preferencesUpdatedGeneratingNewsFeed = loadingState === 'PREFERENCES_UPDATED_GENERATING_NEWS_FEED';
    const isNewUser = loadingState === 'NEW_USER';

    return (
      <Spin spinning={loading}>
        <div className="news-feed">
          <Row className="news-feed__brief">
            <Col>
              <div>{this.infoStringNewsFeed(newsFeedPagination.total)}</div>
            </Col>
          </Row>
          <Row gutter={20} justify="space-between" className="news-feed__filters">
            <Col flex={6}>
              <ThemesDropdown
                className="news-theme-drop-down"
                newsThemes={newsThemes}
                onSelect={this.onThemeSelect}
                selected={activeFilters.newsTheme}
              />
              {newsDateRange.length > 1 && (
                <TimeRangesDropdown
                  className="time-ranges-drop-down"
                  timeRanges={newsDateRange}
                  onSelect={this.onDateRangeSelect}
                  selected={activeFilters.newsDateRange}
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
          </Row>
          <NewsFeedList
            filteredNews={preferencesUpdatedGeneratingNewsFeed || isNewUser ? [] : filteredNews}
            type={type}
            togglePreferencesDrawerVisibility={togglePreferencesDrawerVisibility}
            fetchData={this.fetchMoreDataOnScrollHitBottom}
            totalDataUnits={newsFeedPagination.total}
            preferencesUpdatedGeneratingNewsFeed={preferencesUpdatedGeneratingNewsFeed}
            isNewUser={isNewUser}
          />
        </div>
      </Spin>
    );
  }
}

NewsFeed.contextType = NewsContext;

NewsFeed.propTypes = {
  togglePreferencesDrawerVisibility: PropTypes.func,
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
  mixpanel: PropTypes.shape({
    track: PropTypes.func,
  }),
  userId: PropTypes.number.isRequired,
};

NewsFeed.defaultProps = {
  mixpanel: null,
  companiesFilter: null,
  togglePreferencesDrawerVisibility: () => {},
};

export default NewsFeed;

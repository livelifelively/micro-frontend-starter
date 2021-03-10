/* eslint-disable import/no-unresolved */
/* eslint-disable react/prefer-stateless-function */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ConfigProvider, List } from 'antd';

import { shareNewsOnEmail } from '@qbila/api-news';
import InfiniteScrollList from '@qbila/uic-infinite-scroll-list';

import NewsCard from './components/news-card';
import EmptyNewsFeed from './components/empty-news-feed';

import NewsContext from './news-context';

class NewsFeedList extends Component {
  render() {
    const {
      togglePreferencesDrawerVisibility,
      type,
      filteredNews,
      totalDataUnits,
      fetchData,
      preferencesUpdatedGeneratingNewsFeed,
      isNewUser,
    } = this.props;

    return (
      <ConfigProvider
        renderEmpty={() => (
          <EmptyNewsFeed
            preferencesOrFilterOrGlobal={type}
            togglePrefsDrawer={togglePreferencesDrawerVisibility}
            preferencesUpdatedGeneratingNewsFeed={preferencesUpdatedGeneratingNewsFeed}
            isNewUser={isNewUser}
          />
        )}
      >
        <InfiniteScrollList
          dataSize={filteredNews.length}
          fetchData={fetchData}
          totalDataUnits={totalDataUnits}
          identifier={`news-feed--${type}`}
          className="news-feed-infinite-scroll"
          content={
            <List
              dataSource={filteredNews}
              renderItem={(item) => (
                <List.Item>
                  <NewsCard key={item.id} newsItem={item} shareNewsOnEmail={shareNewsOnEmail} />
                </List.Item>
              )}
            />
          }
        />
      </ConfigProvider>
    );
  }
}

NewsFeedList.contextType = NewsContext;

NewsFeedList.propTypes = {
  togglePreferencesDrawerVisibility: PropTypes.func,
  // #TODO fix this. Well defined shape of array element
  // eslint-disable-next-line react/forbid-prop-types
  filteredNews: PropTypes.array,
  type: PropTypes.string.isRequired,
  fetchData: PropTypes.func.isRequired,
  totalDataUnits: PropTypes.number.isRequired,
  mixpanel: PropTypes.shape({
    track: PropTypes.func,
  }),
  preferencesUpdatedGeneratingNewsFeed: PropTypes.bool,
  isNewUser: PropTypes.bool,
};

NewsFeedList.defaultProps = {
  mixpanel: null,
  togglePreferencesDrawerVisibility: () => {},
  filteredNews: [],
  preferencesUpdatedGeneratingNewsFeed: false,
  isNewUser: false,
};

export default NewsFeedList;

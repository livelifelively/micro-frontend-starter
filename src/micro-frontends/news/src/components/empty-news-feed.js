/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable import/no-unresolved */

import React from 'react';
import PropTypes from 'prop-types';

import CustomEmpty from '@qbila/uic-no-items';

function EmptyNewsFeedText(props) {
  const { togglePrefsDrawer, preferencesOrFilterOrGlobal, preferencesUpdatedGeneratingNewsFeed } = props;

  if (preferencesOrFilterOrGlobal === 'filter') {
    return <div className="empty-state__text--news-feed">No news feed to show for the selected filter.</div>;
  }
  if (preferencesOrFilterOrGlobal === 'global') {
    return <div className="empty-state__text--news-feed">No news feed to show.</div>;
  }
  if (preferencesUpdatedGeneratingNewsFeed) {
    return <div className="empty-state__text--news-feed">We are generating your news feed.</div>;
  }

  return (
    <div className="empty-state__text--companies-list">
      <a type="link" onClick={togglePrefsDrawer}>
        Add or Edit preferences
      </a>
      &nbsp;to view recommended news feed
    </div>
  );
}

export default function EmptyNewsFeed(props) {
  const { togglePrefsDrawer, preferencesOrFilterOrGlobal, preferencesUpdatedGeneratingNewsFeed } = props;

  const noItemsImage = preferencesUpdatedGeneratingNewsFeed
    ? 'https://d3ml3b6vywsj0z.cloudfront.net/website/tuneFeed.png'
    : null;

  return (
    <CustomEmpty
      emptyStateMessage={
        <EmptyNewsFeedText
          togglePrefsDrawer={togglePrefsDrawer}
          preferencesOrFilterOrGlobal={preferencesOrFilterOrGlobal}
          preferencesUpdatedGeneratingNewsFeed={preferencesUpdatedGeneratingNewsFeed}
        />
      }
      noItemsImage={noItemsImage}
      blockHeight="350px"
    />
  );
}

EmptyNewsFeed.propTypes = {
  togglePrefsDrawer: PropTypes.func.isRequired,
  preferencesOrFilterOrGlobal: PropTypes.string.isRequired,
  preferencesUpdatedGeneratingNewsFeed: PropTypes.bool,
};

EmptyNewsFeedText.propTypes = {
  togglePrefsDrawer: PropTypes.func.isRequired,
  preferencesOrFilterOrGlobal: PropTypes.string.isRequired,
  preferencesUpdatedGeneratingNewsFeed: PropTypes.bool,
};

EmptyNewsFeed.defaultProps = {
  preferencesUpdatedGeneratingNewsFeed: false,
};

EmptyNewsFeedText.defaultProps = {
  preferencesUpdatedGeneratingNewsFeed: false,
  // isNewUser: false,
};

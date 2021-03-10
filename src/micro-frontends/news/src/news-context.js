import React from 'react';

const NewsContext = React.createContext({
  shareNewsDrawerVisibile: false,
  toggleShareNewsDrawerVisibility: () => {},
  shareNews: () => {},
  preferencesLastUpdatedAt: null,
  preferencesCreatedAt: null,
  apiRequests: {
    newsAPI: {},
    companiesToTargetAPI: {},
  },
  oldDashboardURL: '',
  updateContext: () => {},
  pusherChannel: {},
});

export default NewsContext;

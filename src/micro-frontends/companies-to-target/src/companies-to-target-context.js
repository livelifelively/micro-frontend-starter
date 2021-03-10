import React from 'react';

const CompaniesToTargetContext = React.createContext({
  apiRequests: {},
  userPreferences: {},
  oldDashboardURL: '',
});

export default CompaniesToTargetContext;

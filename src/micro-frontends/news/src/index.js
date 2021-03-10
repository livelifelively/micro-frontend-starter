/* eslint-disable import/no-unresolved */

import React from 'react';
import PropTypes from 'prop-types';
import { ConfigProvider } from 'antd';

import NoItems from '@slintel/uic-no-items';

import NewsFilterTabs from './news-filter-tabs';

import '../sass/main.scss';

const EmptyStateMessageNode = () => {
  return <span>No items to display</span>;
};
const App = (props) => {
  const { mixpanel, environmentVariables } = props;
  return (
    <ConfigProvider renderEmpty={() => <NoItems emptyStateMessage={<EmptyStateMessageNode />} />}>
      <NewsFilterTabs
        mixpanel={mixpanel}
        // environmentVariables={{
        //   baseAPIURL: process.env.BASE_API_URL,
        //   oldDashboardURL: process.env.OLD_DASHBOARD_URL,
        //   domainName: process.env.DOMAIN_NAME,
        // }}
        environmentVariables={environmentVariables}
      />
    </ConfigProvider>
  );
};

App.propTypes = {
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

App.defaultProps = {
  mixpanel: null,
};

export default App;

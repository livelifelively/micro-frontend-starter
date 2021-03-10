/* eslint-disable import/no-unresolved */

import React from 'react';
import PropTypes from 'prop-types';
import { ConfigProvider } from 'antd';

import NoItems from '@slintel/uic-no-items';

import CompaniesToTargetFilterTabs from './companies-to-target-filter-tabs';

import '../sass/main.scss';

const EmptyStateMessageNode = () => {
  return <span>No items to display</span>;
};
const App = (props) => {
  const { mixpanel, environmentVariables } = props;

  return (
    <ConfigProvider renderEmpty={() => <NoItems emptyStateMessage={<EmptyStateMessageNode />} />}>
      <CompaniesToTargetFilterTabs
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

// create context to share configurations.

App.propTypes = {
  mixpanel: PropTypes.shape({
    track: PropTypes.func,
  }),
  // Environment variables of the environment microfrontend is running in.
  environmentVariables: PropTypes.shape({
    baseAPIURL: PropTypes.string.isRequired,
    oldDashboardURL: PropTypes.string.isRequired,
    domainName: PropTypes.string.isRequired,
  }).isRequired,
};

App.defaultProps = {
  mixpanel: null,
};

export default App;

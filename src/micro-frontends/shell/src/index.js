/* eslint-disable import/no-unresolved */
import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';

// eslint-disable-next-line import/no-unresolved
// import News from '@slintel/news';
import CompaniesToTarget from '@slintel/companies-to-target';

// ReactDOM.render(
//   <News
//     environmentVariables={{
//       baseAPIURL: process.env.BASE_API_URL,
//       oldDashboardURL: process.env.OLD_DASHBOARD_URL,
//       domainName: process.env.DOMAIN_NAME,
//       pusherConfig: {
//         pusherAppKey: process.env.PUSHER_APP_KEY,
//         pusherAppCluster: process.env.PUSHER_APP_CLUSTER,
//         nodeEnv: process.env.NODE_ENV,
//       },
//     }}
//   />,
//   document.getElementById('app')
// );
ReactDOM.render(
  <CompaniesToTarget
    environmentVariables={{
      baseAPIURL: process.env.BASE_API_URL,
      oldDashboardURL: process.env.OLD_DASHBOARD_URL,
      domainName: process.env.DOMAIN_NAME,
    }}
  />,
  document.getElementById('app')
);

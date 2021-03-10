import React from 'react';
import ReactDOM from 'react-dom';

import { SideNavigation, TopNavigation } from '@qbila/navigations';

const Shell = () => {
  return (
    <div>
      <SideNavigation />
      <TopNavigation />
    </div>
  );
};

ReactDOM.render(<Shell />, document.getElementById('app'));

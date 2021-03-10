/* eslint-disable import/no-unresolved */
import React from 'react';
import ReactDOM from 'react-dom';

import Navigation from '@qbila/navigations';

const Shell = () => {
  return (
    <div>
      HELLO WORLD
      <Navigation />
    </div>
  );
};

ReactDOM.render(<Shell />, document.getElementById('app'));

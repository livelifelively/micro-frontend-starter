/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable import/no-unresolved */

import React from 'react';
import PropTypes from 'prop-types';

import CustomEmpty from '@slintel/uic-no-items';

function EmptyCompaniesListText(props) {
  const { togglePrefsDrawer, preferencesOrFilter } = props;
  if (preferencesOrFilter === 'filter') {
    return (
      <div className="empty-state__text--companies-list">
        No high buying propensity companies to show for the selected filter.
      </div>
    );
  }
  return (
    <div className="empty-state__text--companies-list">
      <a type="link" onClick={togglePrefsDrawer}>
        Add preferences
      </a>
      &nbsp;to view companies having high buying propensity
    </div>
  );
}

export default function EmptyCompaniesList(props) {
  const { togglePrefsDrawer, preferencesOrFilter } = props;
  return (
    <CustomEmpty
      emptyStateMessage={
        <EmptyCompaniesListText togglePrefsDrawer={togglePrefsDrawer} preferencesOrFilter={preferencesOrFilter} />
      }
      blockHeight="350px"
    />
  );
}

EmptyCompaniesList.propTypes = {
  togglePrefsDrawer: PropTypes.func.isRequired,
  preferencesOrFilter: PropTypes.string.isRequired,
};

EmptyCompaniesListText.propTypes = {
  togglePrefsDrawer: PropTypes.func.isRequired,
  preferencesOrFilter: PropTypes.string.isRequired,
};

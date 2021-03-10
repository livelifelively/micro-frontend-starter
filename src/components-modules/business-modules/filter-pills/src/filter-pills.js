import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';

import { Tag } from 'antd';

import { tagsForCompanyFilter, tagsForPreferences } from './filter-types';

import '../sass/filter-pills.scss';

function getPillsDataBasedOnFilterType(filter, filterCategory) {
  if (filterCategory === 'preferences') {
    return tagsForPreferences(filter);
  }
  if (filterCategory === 'filter' && filter.type?.toLowerCase() === 'company') {
    return tagsForCompanyFilter(filter);
  }
  return [];
}

const FilterPills = (props) => {
  const { filter, controlClassNames, filterCategory } = props;

  const pillsData = getPillsDataBasedOnFilterType(filter, filterCategory);

  return (
    <div className={`filter-pills ${controlClassNames}`}>
      {map(pillsData, (val, index) => {
        return (
          val.length > 0 && (
            <Tag className="filter-pills__pill" key={index}>
              <b>{`${index}: `}</b>
              {val.map((v, i) => {
                return (
                  <span key={v}>
                    {v}
                    {i < val.length - 1 ? `, ` : ``}
                  </span>
                );
              })}
            </Tag>
          )
        );
      })}
    </div>
  );
};

FilterPills.propTypes = {
  filter: PropTypes.shape({
    id: PropTypes.number,
    subCategories: PropTypes.arrayOf(PropTypes.shape({})),
    sectors: PropTypes.arrayOf(PropTypes.string),
    locations: PropTypes.arrayOf(PropTypes.string),
    sizes: PropTypes.arrayOf(PropTypes.string),
    name: PropTypes.string,
    technologies: PropTypes.arrayOf(PropTypes.shape({})),
    type: PropTypes.string,
  }),
  controlClassNames: PropTypes.string,
  filterCategory: PropTypes.string.isRequired,
  // filterFieldsToShow: PropTypes.shape({}),
};

FilterPills.defaultProps = {
  filter: {},
  controlClassNames: '',
  // filterFieldsToShow: null,
};

export default FilterPills;

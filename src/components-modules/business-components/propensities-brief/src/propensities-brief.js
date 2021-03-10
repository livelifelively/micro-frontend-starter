import React from 'react';
import PropTypes from 'prop-types';
import { maxBy, reduce, camelCase, isFunction } from 'lodash';

function jobPostingBrief(type, timeRange) {
  return (
    <>
      {`${type} high job postings in `}
      <span>{`last ${timeRange}`}</span>
    </>
  );
}

function renewalBrief(renewalIn) {
  return (
    <>
      Potential renewal
      <span>{` ${renewalIn}`}</span>
    </>
  );
}

function technologyBrief(spendingLevel) {
  return (subcategory) => {
    return (
      <>
        {`${spendingLevel} budgetary spend in `}
        <span>{`${subcategory} `}</span>
        space
      </>
    );
  };
}

function fundingBrief(fundingTime) {
  return (
    <>
      {`Funded in `}
      <span>{` ${fundingTime}`}</span>
    </>
  );
}

const SCORE_THRESHOLDS = {
  RENEWAL: [
    {
      score: 160,
      brief: renewalBrief('coming up'),
    },
    {
      score: 180,
      brief: renewalBrief('6 months'),
    },
    {
      score: 190,
      brief: renewalBrief('3 months'),
    },
    {
      score: 200,
      brief: renewalBrief('1 month'),
    },
  ],
  TECHNOLOGY_CATEGORY: [
    {
      score: 200,
      brief: (subcategory) => {
        return (
          <>
            Consistently spending money in
            <span>{` ${subcategory} `}</span>
            category
          </>
        );
      },
    },
  ],
  TECHNOLOGY: [
    {
      score: 100,
      brief: technologyBrief('Moderate'),
    },
    {
      score: 150,
      brief: technologyBrief('Significant'),
    },
    {
      score: 200,
      brief: technologyBrief('Significant'),
    },
  ],
  FUNDING: [
    {
      score: 75,
      brief: fundingBrief('last six months'),
    },
    {
      score: 90,
      brief: fundingBrief('last three months'),
    },
    {
      score: 100,
      brief: fundingBrief('last one month'),
    },
  ],
  SIZE: [
    {
      score: 60,
      brief: <>Small and medium sized business</>,
    },
    {
      score: 70,
      brief: <>Small and medium sized business</>,
    },
    {
      score: 80,
      brief: <>Mid market company</>,
    },
    {
      score: 90,
      brief: <>Large enterprise</>,
    },
    {
      score: 100,
      brief: <>Large enterprise</>,
    },
  ],
  JOBS: [
    {
      score: 60,
      brief: jobPostingBrief('Moderately', '3 months'),
    },
    {
      score: 70,
      brief: jobPostingBrief('Moderately', '3 months'),
    },
    {
      score: 80,
      brief: jobPostingBrief('Moderately', '3 months'),
    },
    {
      score: 90,
      brief: jobPostingBrief('Significantly', '3 months'),
    },
    {
      score: 100,
      brief: jobPostingBrief('Significantly', '3 months'),
    },
  ],
};

function getBrief(field, buyingSignals) {
  const briefFrom = maxBy(
    SCORE_THRESHOLDS[field.toUpperCase()].filter((val) => {
      return val.score <= buyingSignals[field];
    }),
    (val) => {
      return val.score;
    }
  );
  return briefFrom ? briefFrom.brief : null;
}

export default function PropensitiesBrief({ buyingSignals, subcategoryLabel, category }) {
  const renewal = getBrief('renewal', buyingSignals);
  const jobs = getBrief('jobs', buyingSignals);
  const funding = getBrief('funding', buyingSignals);
  const size = getBrief('size', buyingSignals);
  const technology = isFunction(getBrief('technology', buyingSignals))
    ? getBrief('technology', buyingSignals)(category)
    : '';

  // key for technology_category in buyingSignals is technologyCategory.
  const technologySubcategory = isFunction(
    getBrief('technology_category', {
      ...buyingSignals,
      technology_category: buyingSignals.technologyCategory,
    })
  )
    ? getBrief('technology_category', {
        ...buyingSignals,
        technology_category: buyingSignals.technologyCategory,
      })(subcategoryLabel)
    : '';

  return (
    <ul className="propensity-brief">
      {renewal ? <li>{renewal}</li> : ''}
      {jobs ? <li>{jobs}</li> : ''}
      {funding ? <li>{funding}</li> : ''}
      {size ? <li>{size}</li> : ''}
      {technology ? <li>{technology}</li> : ''}
      {technologySubcategory ? <li>{technologySubcategory}</li> : ''}
    </ul>
  );
}

export const MINIMUM_SCORE_THRESHOLD = reduce(
  SCORE_THRESHOLDS,
  (res, val, key) => {
    res[camelCase(key)] = val[0].score;
    return res;
  },
  {}
);

PropensitiesBrief.propTypes = {
  buyingSignals: PropTypes.shape({
    funding: PropTypes.number,
    jobs: PropTypes.number,
    size: PropTypes.number,
    technology: PropTypes.number,
    renewal: PropTypes.number,
    technologyCategory: PropTypes.number,
  }).isRequired,
  // subCategory: PropTypes.string,
  subcategoryLabel: PropTypes.string,
  category: PropTypes.string,
};

PropensitiesBrief.defaultProps = {
  // subCategory: '',
  subcategoryLabel: '',
  category: '',
};

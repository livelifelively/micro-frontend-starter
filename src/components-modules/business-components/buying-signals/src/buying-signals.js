/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable import/no-unresolved */

import React from 'react';
import PropTypes from 'prop-types';
import { Popover } from 'antd';

import { COMPANIES_TO_TARGET } from '@slintel/cc-constants';

import ProgressRing from './progress-ring';

import './buying-signals.scss';

const { MAX_BUYING_SIGNAL } = COMPANIES_TO_TARGET;

const SIGNAL_TYPE_TO_LABEL = {
  technology: {
    // label: 'Technology',
    label: (subcategory, category) => {
      return `Significant budgetary spend in ${category}`;
    },
    classNameSuffix: 'technology',
    iconActive: 'https://d3ml3b6vywsj0z.cloudfront.net/website/intent/Group5456.svg',
    iconDisabled: 'https://d3ml3b6vywsj0z.cloudfront.net/website/intent/icon-technology-disabled.svg',
  },
  renewal: {
    // label: 'Contract Renewal',
    label: () => {
      return 'Contract renewal coming up';
    },
    classNameSuffix: 'contract-renewal',
    iconActive: 'https://d3ml3b6vywsj0z.cloudfront.net/website/intent/icon-contract-renewal.svg',
    iconDisabled: 'https://d3ml3b6vywsj0z.cloudfront.net/website/intent/Group5475.svg',
  },
  jobs: {
    // label: 'Job Posts',
    label: () => {
      return 'Growth in job postings';
    },
    classNameSuffix: 'jobs',
    iconActive: 'https://d3ml3b6vywsj0z.cloudfront.net/website/intent/Group5453.svg',
    iconDisabled: 'https://d3ml3b6vywsj0z.cloudfront.net/website/intent/icon-jobs-disabled.svg',
  },
  funding: {
    // label: 'Funding',
    label: () => {
      return 'Raised funding recently';
    },
    classNameSuffix: 'funding',
    iconActive: 'https://d3ml3b6vywsj0z.cloudfront.net/website/intent/Group5452.svg',
    iconDisabled: 'https://d3ml3b6vywsj0z.cloudfront.net/website/intent/icon-funding-disabled.svg',
  },
  size: {
    // label: 'Size',
    label: () => {
      return 'Growth in company size';
    },
    classNameSuffix: 'size',
    iconActive: 'https://d3ml3b6vywsj0z.cloudfront.net/website/intent/Group5454.svg',
    iconDisabled: 'https://d3ml3b6vywsj0z.cloudfront.net/website/intent/icon-company-size-disabled.svg',
  },
  technologyCategory: {
    // label: 'Technology Category',
    label: (subcategory) => {
      return `Uses other products in the ${subcategory} ecosystem`;
    },
    classNameSuffix: 'technology-subcategory',
    iconActive: 'https://d3ml3b6vywsj0z.cloudfront.net/website/intent/icon-technology-subcategory.svg',
    iconDisabled: 'https://d3ml3b6vywsj0z.cloudfront.net/website/intent/Group5477.svg',
  },
};

export default function BuyingSignal(props) {
  const { signalStrength, signalType, subcategoryLabel, category, addPreferencesDrawer } = props;
  const { label, classNameSuffix, iconDisabled } = SIGNAL_TYPE_TO_LABEL[signalType];
  const strengthLabel = `${label(subcategoryLabel, category)}`;

  const percentSignal = (signalStrength / MAX_BUYING_SIGNAL[signalType]) * 100;

  const circle = {
    strokeWidth: 2,
    radius: 25,
    progressStrokeColor: '#5E81F4',
    referenceStrokeColor: '#EAF2FA',
  };

  return (
    <div className="buying-signal">
      {percentSignal > 0 ? (
        <>
          <ProgressRing
            radius={circle.radius}
            stroke={circle.strokeWidth}
            color={circle.progressStrokeColor}
            refColor={circle.referenceStrokeColor}
            progress={percentSignal}
          />
          <BuyingSignalWithSignalStrength
            strengthLabel={strengthLabel}
            classNameSuffix={classNameSuffix}
            icon={iconDisabled}
          />
        </>
      ) : (
        <BuyingSignalDependentOnSubCategory
          classNameSuffix={classNameSuffix}
          icon={iconDisabled}
          addPreferencesDrawer={addPreferencesDrawer}
        />
      )}
    </div>
  );
}

function BuyingSignalWithSignalStrength(props) {
  const { strengthLabel, classNameSuffix, icon } = props;
  return (
    <Popover placement="bottom" content={strengthLabel}>
      <span className={`buying-signal--${classNameSuffix} buying-signal__strength`}>
        <img src={icon} alt={strengthLabel} />
      </span>
    </Popover>
  );
}

function BuyingSignalDependentOnSubCategory(props) {
  const { classNameSuffix, icon, addPreferencesDrawer } = props;

  return (
    <Popover placement="bottom" content="Enhance your results by adding technology category">
      <div className="buying-signal__need-more-data--wrapper">
        <span
          className={`buying-signal__need-more-data buying-signal--${classNameSuffix}`}
          onClick={addPreferencesDrawer}
        >
          <img src={icon} alt="" />
          <span className="buying-signal__add-preferences-icon">+</span>
        </span>
      </div>
    </Popover>
  );
}

BuyingSignal.propTypes = {
  signalStrength: PropTypes.number,
  // threshold: PropTypes.number.isRequired,
  signalType: PropTypes.string.isRequired,
  // subcategory: PropTypes.string,
  subcategoryLabel: PropTypes.string,
  category: PropTypes.string,
  addPreferencesDrawer: PropTypes.func.isRequired,
};

BuyingSignal.defaultProps = {
  category: '',
  subcategoryLabel: '',
  signalStrength: 0,
};

BuyingSignalDependentOnSubCategory.propTypes = {
  icon: PropTypes.string.isRequired,
  classNameSuffix: PropTypes.string.isRequired,
  addPreferencesDrawer: PropTypes.func.isRequired,
};

BuyingSignalWithSignalStrength.propTypes = {
  icon: PropTypes.string.isRequired,
  classNameSuffix: PropTypes.string.isRequired,
  strengthLabel: PropTypes.string.isRequired,
};

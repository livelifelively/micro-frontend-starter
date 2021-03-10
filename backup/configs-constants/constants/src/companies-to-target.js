/* eslint-disable import/prefer-default-export */
const COMPANY_SIZES = ['1-10', '11-50', '51-200', '201-500', '501-1k', '1k-5k', '5k-10k', '10k+'];

const COMPANY_SECTORS = [
  'Energy and Utilities',
  'Financial Services',
  'Healthcare and Lifesciences',
  'Industrials & Chemicals',
  'Media and Telecom',
  'Professional Services',
  'Retail and CPG',
  'Technology',
];

const COMPANY_TARGET_PERSONA = [
  'Hr',
  'Sales',
  'Marketing',
  'Technology',
  'Finance Risk And Compliance',
  'Customer Success And Support',
  'Operations',
  'Research And Strategy',
  'Administrative',
  'Ceo/founder/co-founder',
  'General Management',
  'Other',
];

const PROPENSITY_SCORE_COMPANIES_TO_TARGET = {
  DEFAULT_DAYS_FROM: 90,
  DAYS_FROM_OPTIONS: [7, 14, 30, 90],
};

const COMPANY_LIST_API_REQUEST_LIMIT = 50;

const MAX_BUYING_SIGNAL = {
  renewal: 200,
  technologyCategory: 200,
  technology: 200,
  funding: 100,
  size: 100,
  jobs: 100,
};

export {
  COMPANY_SIZES,
  PROPENSITY_SCORE_COMPANIES_TO_TARGET,
  COMPANY_SECTORS,
  COMPANY_TARGET_PERSONA,
  COMPANY_LIST_API_REQUEST_LIMIT,
  MAX_BUYING_SIGNAL,
};

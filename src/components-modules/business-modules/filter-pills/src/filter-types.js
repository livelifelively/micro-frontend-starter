import {
  getKeywordsFromFilter,
  getTechnologiesFromFilter,
  getTechnologiesAddedFromFilter,
  getTechnologiesDroppedFromFilter,
  getSectorsFromFilter,
  getIndustriesFromFilter,
  getLatestFundingDateFromFilter,
  getNaicsCodesFromFilter,
  getSicCodesFromFilter,
  getEbitdaRangesFromFilter,
  getFiscalYearsFromFilter,
  getMaxJobsCountFromFilter,
  getRevenueRangesFromFilter,
  getTagsFromFilter,
  getFundingRangesFromFilter,
  getLocationsFromFilter,
  getCompanySizesFromFilter,
  getSubCategoriesFromFilter,
  getSearchFromFilter,
  // getTechnologiesFromPreferencesFilter,
  getContinentFromFilter,
} from './adapters';

export function tagsForCompanyFilter(filter) {
  return {
    Keywords: getKeywordsFromFilter(filter),
    Technologies: getTechnologiesFromFilter(filter),
    'Technologies Added': getTechnologiesAddedFromFilter(filter),
    'Technologies Dropped': getTechnologiesDroppedFromFilter(filter),
    Sectors: getSectorsFromFilter(filter),
    Industries: getIndustriesFromFilter(filter),
    'Latest Funding Date': getLatestFundingDateFromFilter(filter),
    'NAICS Codes': getNaicsCodesFromFilter(filter),
    'SIC Codes': getSicCodesFromFilter(filter),
    'EBITDA Ranges': getEbitdaRangesFromFilter(filter),
    'Fiscal Years': getFiscalYearsFromFilter(filter),
    'Max Jobs Count': getMaxJobsCountFromFilter(filter),
    'Revenue Ranges': getRevenueRangesFromFilter(filter),
    Tags: getTagsFromFilter(filter),
    'Funding Ranges': getFundingRangesFromFilter(filter),
    Locations: getLocationsFromFilter(filter),
    'Company Sizes': getCompanySizesFromFilter(filter),
    Categories: getSubCategoriesFromFilter(filter),
    Search: getSearchFromFilter(filter),
    Continent: getContinentFromFilter(filter),
  };
}

// TODO use filterFieldsToShow to filter which fields to show. centralize the information of active filter fields.
export function tagsForPreferences(filter) {
  return {
    // Technologies: getTechnologiesFromPreferencesFilter(filter),
    Sectors: getSectorsFromFilter(filter),
    Locations: getLocationsFromFilter(filter),
    'Company Sizes': getCompanySizesFromFilter(filter),
    Categories: getSubCategoriesFromFilter(filter),
  };
}

export function tagsForTechnologyFilter() {}

export function getKeywordsFromFilter(filter) {
  return (
    filter.keywords?.map((val) => {
      return val.keyword;
    }) || []
  );
}

export function getTechnologiesFromFilter(filter) {
  return (
    filter.technologies?.map((val) => {
      return `${val.technology} | ${val.subCategory}`;
    }) || []
  );
}

export function getTechnologiesFromPreferencesFilter(filter) {
  return (
    filter.technologies?.map((val) => {
      return `${val.title} | ${val.subCat}`;
    }) || []
  );
}

export function getTechnologiesAddedFromFilter(filter) {
  return (
    filter.techAdds?.map((val) => {
      return `${val.technology} | ${val.subCategory}`;
    }) || []
  );
}

export function getTechnologiesDroppedFromFilter(filter) {
  return (
    filter.techDrops?.map((val) => {
      return `${val.technology} | ${val.subCategory}`;
    }) || []
  );
}

export function getSectorsFromFilter(filter) {
  return filter.sectors || [];
}

export function getIndustriesFromFilter(filter) {
  return filter.industries || [];
}

export function getLatestFundingDateFromFilter(filter) {
  return filter.latestFundingDate || [];
}

export function getNaicsCodesFromFilter(filter) {
  return filter.naicsCodes || [];
}

export function getSicCodesFromFilter(filter) {
  return filter.sicCodes || [];
}

export function getEbitdaRangesFromFilter(filter) {
  return filter.ebitdaRanges || [];
}

export function getFiscalYearsFromFilter(filter) {
  return filter.fiscalYears || [];
}

export function getMaxJobsCountFromFilter(filter) {
  return filter.maxJobsCount || [];
}

export function getRevenueRangesFromFilter(filter) {
  return filter.revenueRanges || [];
}

export function getTagsFromFilter(filter) {
  return filter.tags || [];
}

export function getFundingRangesFromFilter(filter) {
  return filter.fundingRanges || [];
}

export function getLocationsFromFilter(filter) {
  return filter.locations || [];
}

export function getCompanySizesFromFilter(filter) {
  return filter.sizes || [];
}

export function getSubCategoriesFromFilter(filter) {
  return (
    filter.subCategories?.map((val) => {
      return val.label;
    }) || []
  );
}

export function getSearchFromFilter(filter) {
  return filter.search?.length > 0 ? [filter.search] : [];
}

export function getContinentFromFilter(filter) {
  return filter.continent || [];
}

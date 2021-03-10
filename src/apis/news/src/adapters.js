/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-use-before-define */
/* eslint-disable import/no-unresolved */

import { isString } from 'lodash';

/**
 * ADAPTER - User preferences to CompaniesToTarget API
 * @param {Object} preferences User Preferences
 * @param {Array} subCategories Subcategories
 * @param {Number} timeFrom Unix Timestamp
 */
export function _adapter_userPreferences_companiesToTargetAPI(preferences, subCategories = [], timeFrom = null, type) {
  // TODO: standardized object response from get-preferences-api.
  return {
    ...preferences,
    subCategories: subCategories.reduce((agg, v) => {
      if (v.label && v.label.toLowerCase() !== 'all') {
        agg.push(v.label);
      }
      return agg;
    }, []),
    locations: preferences.locations,
    sizes: preferences.sizes,
    sectors: preferences.sectors,
    createdAt: timeFrom,
    keywords: type === 'filter' && preferences.keywords && preferences.keywords.map((v) => v.original),
    techAdds: type === 'filter' && preferences.techAdds && preferences.techAdds.map((v) => v.original),
    techDrops: type === 'filter' && preferences.techDrops && preferences.techDrops.map((v) => v.original),
    technologies: type === 'filter' && preferences.technologies && preferences.technologies.map((v) => v.original),
    filterType: type,
  };
}

/**
 * ADAPTER - Technology API Response - Application Schema
 * @param {Object} technologies Technologies API Response
 */
export function _adapter_technologiesAPI_technologiesAPP(technologies) {
  return technologies.map((val) => {
    return {
      id: val._id,
      name: val._source.company_name,
      category: val._source.category,
      subCategory: val._source.subcategory,
      type: val._source.type,
    };
  });
}

/**
 * ADAPTER
 * FROM: custom filters API
 * TO: custom filters Object
 * @param {Object} filters /custom-filters response
 */
// #TODO #FIXME HUGE FUNCTION. TRIM IT DOWN BOY!
export async function _adapter_customFiltersAPI_companyFiltersObject(filters) {
  const formattedCustomFilters = filters.reduce((agg, val) => {
    const data = JSON.parse(val.data);
    if (val.type !== 'company') return agg;

    const formattedFilter = {
      id: val.id,
      name: val.name,
      type: val.type,
      userId: val.user_id,
      createdAt: val.created_at,
      sectors: data.company_sector || [],
      industries: data.company_industry || [],
      latestFundingDate: data.company_latest_funding_date || [],
      naicsCodes: data.company_naics_code || [],
      sicCodes: data.company_sic_code || [],
      ebitdaRanges: data.ebitda_range || [],
      fiscalYears: data.fiscal_year || [],
      keywords:
        data.keywords && data.keywords.length
          ? data.keywords.map((v) => {
              const kw = v.split('|');
              return {
                subCategory: kw[0],
                keyword: kw[1],
                original: v,
              };
            })
          : [],
      maxJobsCount: data.max_job_count || [],
      minJobsCount: data.min_job_count || [],
      revenueRanges: data.revenue_range || [],
      tags: data.tags || [],
      techAdds:
        data.tech_adds && data.tech_adds.length
          ? data.tech_adds.map((v) => {
              const tech = v.split('|');
              return {
                subCategory: tech[0],
                technology: tech[1],
                status: tech[2],
                original: v,
              };
            })
          : [],
      techDrops:
        data.tech_drops && data.tech_drops.length
          ? data.tech_drops.map((v) => {
              const tech = v.split('|');
              return {
                subCategory: tech[0],
                technology: tech[1],
                status: tech[2],
                original: v,
              };
            })
          : [],
      technologies:
        data.technologies && data.technologies.length
          ? data.technologies.map((v) => {
              const tech = v.split('|');
              return {
                subCategory: tech[0],
                technology: tech[1],
                original: v,
              };
            })
          : [],
      fundingRanges: data.company_funding_range || [],
      locations: data.company_location || [],
      sizes: data.company_size || [],
      subCategories: data.subCategories || [],
      search: data.q || '',
    };

    agg.push(formattedFilter);
    return agg;
  }, []);

  return formattedCustomFilters;
}

/**
 * ADAPTER
 * FROM: Preferences from GET API
 * TO: Preferences from Application Schema
 * @param {Object} preferences Preferences from Application Schema
 */
export function _adapter_userPreferencesGetAPI_userPreferencesObject(preferences, userId) {
  // #TODO enforce standard response. Throw error if expected response not recieved.
  return {
    subCategories: preferences.subcategories
      ? (function () {
          const subCats = JSON.parse(preferences.subcategories);
          return subCats.map((val) => {
            return isString(val)
              ? {
                  name: val,
                  label: val,
                }
              : val;
          });
        })()
      : [],
    technologies: preferences.technologies ? JSON.parse(preferences.technologies) : [],
    locations: preferences.location ? JSON.parse(preferences.location) : [],
    sizes: preferences.company_size ? JSON.parse(preferences.company_size) : [],
    sectors: preferences.company_sector ? JSON.parse(preferences.company_sector) : [],
    companyFunction: preferences.company_function ? JSON.parse(preferences.company_function) : [],
    keywords: preferences.keywords ? JSON.parse(preferences.keywords) : [],
    // #FIXME enforce a standardized response. This can be a security vulnerability.
    userId: preferences.user_id ? preferences.user_id : userId,
    id: preferences.id,
  };
}

/**
 * ADAPTER
 * FROM: Preferences - Application Schema
 * TO: Preferenes - Update Preferences API
 * @param {Object} preferences Preferences from Application
 */
export function _adapter_userPreferencesAPP_updateUserPreferencesAPI(preferences) {
  return {
    filterValues: {
      subcategories: preferences.subCategories,
      function: preferences.companyFunction,
      sector: preferences.sectors,
      size: preferences.sizes,
      keywords: preferences.keywords.map((val) => {
        return `${val.title}|${val.id}`;
      }),
      location: preferences.locations,
      technology: preferences.technologies.map((val) => {
        return `${val.title}|${val.id}|${val.subCategory}`;
      }),
    },
    id: preferences.id,
    userId: preferences.userId,
  };
}

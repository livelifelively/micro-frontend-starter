/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-use-before-define */
/* eslint-disable import/no-unresolved */

/**
 * API REQUESTS
 */

import Http from '@slintel/s-http';
import { isEmpty, uniqBy } from 'lodash';

import {
  _adapter_userPreferencesGetAPI_userPreferencesObject,
  _adapter_customFiltersAPI_companyFiltersObject,
  _adapter_userPreferencesAPP_updateUserPreferencesAPI,
  _adapter_technologiesAPI_technologiesAPP,
  _adapter_userPreferences_companiesToTargetAPI,
} from './adapters';

export default ({ baseAPIURL, domainName }) => {
  const http = Http({ domainName });

  const BASE_URL = baseAPIURL;
  if (isEmpty(baseAPIURL)) {
    throw Error('Base API URL is required');
  }
  /**
   * Get User Preferences
   * @param {String} userId - user id of the user whose preferences to get
   */
  async function getUserPreferences(userId) {
    try {
      const data = await http.get({
        url: `${BASE_URL}get-user-preferences?user_id=${userId}`,
      });
      // TODO: standardize response packets.
      return _adapter_userPreferencesGetAPI_userPreferencesObject(data.data.data[0], userId);
    } catch (error) {
      // TODO: Improve error handling
      console.log(error);
    }
    return {};
  }

  /**
   * Get User Custom Filters
   * @param {String} userId - user id of the user whose preferences to get
   */
  async function getCustomFilters(userId) {
    try {
      const data = await http.get({
        url: `${BASE_URL}custom-filters?user_id=${userId}`,
      });
      // TODO: standardize response packets.
      const adapted = await _adapter_customFiltersAPI_companyFiltersObject(data.data.data);

      // adapted = await getSubcategoryDetailsForCustomFilters(adapted);

      return adapted;
      // return _adapter_userPreferencesGetAPI_userPreferencesObject(data.data.data[0], userId);
    } catch (error) {
      // TODO: Improve error handling
      console.log(error);
    }
    return [];
  }

  /**
   * Update User Preferences
   * @param {Object} preferences User Preferences Object
   */
  async function updateUserPreferences(preferences) {
    const apiFormattedData = _adapter_userPreferencesAPP_updateUserPreferencesAPI(preferences);
    try {
      const response = await http.put({
        url: `${BASE_URL}update-user-preferences`,
        data: apiFormattedData,
      });
      // TODO: standardize response packets.
      return response.data.data;
    } catch (error) {
      // TODO: Improve error handling
      console.log(error);
    }
    return [];
  }

  /**
   * Get Compaines To Target Based on Users Preferences
   * @param {Object} file
   * @param {String} uploadKeyPrefix
   * @returns {Object} PresignedUrlData
   */
  async function getCompainesToTarget(companiesFilter, { from, limit }) {
    try {
      const data = await http.post({
        url: `${BASE_URL}propensity/companies-to-target`,
        data: {
          companiesFilter,
          from,
          limit,
        },
      });
      return data.data;
    } catch (error) {
      // TODO: Improve error handling
      console.log(error);
    }
    return [];
  }

  /**
   * Locations Autocomplete
   * @param {String} query incomplete location string
   */
  async function getLocationsSuggestions(query) {
    try {
      const data = await http.get({
        url: `${BASE_URL}autocomplete/locations?q=${query}`,
      });
      return data.data;
    } catch (error) {
      // TODO: Improve error handling
      console.log(error);
    }
    return [];
  }

  /**
   * Company Autocomplete API
   * @param {String} query incomplete company name string
   */
  async function getCompanySuggestions(query) {
    try {
      const data = await http.get({
        url: `${BASE_URL}leads/company-suggester?q=${query}`,
      });
      return data.data.data.data;
    } catch (error) {
      // TODO: Improve error handling
      console.log(error);
    }
    return [];
  }

  /**
   * Technologies Autocomplete API
   * @param {String} query - what the user has typed in search/select input
   */
  async function getTechnologiesSuggestions(query) {
    try {
      const data = await http.get({
        url: `${BASE_URL}technology/autosuggestions?q=${query}`,
      });
      return _adapter_technologiesAPI_technologiesAPP(data.data.data.data);
    } catch (e) {
      console.log(e);
    }
    return [];
  }

  /**
   * Subcategories Autocomplete API
   * @param {String} query - what the user has typed in search/select input
   */
  async function getSubCategoriesSuggestions(query) {
    if (isEmpty(query)) {
      return [];
    }
    try {
      const data = await http.get({
        url: `${BASE_URL}autocomplete/sub-categories?q=${query}`,
      });
      return data.data;
    } catch (e) {
      console.log(e);
    }
    return [];
  }

  /**
   * Get User Filters for the user.
   */
  async function getUserCreatedFilters() {
    try {
      const data = await http.get({
        url: `${BASE_URL}custom-filters`,
      });
      return data.data.data.data;
    } catch (error) {
      // TODO: Improve error handling
      console.log(error);
    }
    return [];
  }

  /**
   * Companies to target. Preferences + filters (subCategory, timeRange) or User saved filters
   * @param {Object} preferences - saved user preferences.
   * @param {Object} param1 - additional filters: subCategories, timeFrom
   */
  async function getCompainesToTargetForFiltersAndUserPreferences(
    preferences,
    { subCategories = [], timeFrom },
    { from = 0, limit = 50 },
    type
  ) {
    const companiesFilter = _adapter_userPreferences_companiesToTargetAPI(
      preferences,
      [...subCategories],
      timeFrom,
      type
    );
    const companies = await getCompainesToTarget(companiesFilter, { from, limit });
    return companies;
  }

  // subcategory/subcategory-label
  async function getSubcategoryLabelForSubcategory(query) {
    try {
      const data = await http.get({
        url: `${BASE_URL}subcategory/subcategory-label?q=${query}`,
      });
      return data.data;
    } catch (e) {
      console.log(e);
    }
    return [];
  }

  async function getSubcategoryDetailsForCustomFilters(customFilters) {
    const subCategories = {};

    customFilters.forEach((val) => {
      val.technologies.forEach((v) => {
        const subCat = v.subCategory.split('_').join(' ');
        if (!subCategories[v.subCategory]) {
          subCategories[v.subCategory] = {
            fromTechnology: v.subCategory,
            formattedFromTechnology: subCat,
          };
        }
      });
    });

    // eslint-disable-next-line no-restricted-syntax, no-unused-vars
    for await (const sc of Object.values(subCategories)) {
      try {
        if (sc.formattedFromTechnology.length && sc.formattedFromTechnology[0] !== '!') {
          const subCatLabel = await getSubcategoryLabelForSubcategory(sc.formattedFromTechnology);
          if (!isEmpty(subCatLabel.subcategory_label))
            subCategories[sc.fromTechnology] = {
              ...subCategories[sc.fromTechnology],
              name: subCatLabel.subcategory,
              label: subCatLabel.subcategory_label,
            };
        }
      } catch (e) {
        console.log(e);
      }
    }

    customFilters.forEach((val, index) => {
      // eslint-disable-next-line no-param-reassign
      customFilters[index].subCategories = [
        ...uniqBy(val.technologies, 'subCategory').map((v) => subCategories[v.subCategory]),
      ];
    });

    return customFilters;
  }

  return {
    getUserPreferences,
    getCustomFilters,
    getLocationsSuggestions,
    updateUserPreferences,
    getCompanySuggestions,
    getTechnologiesSuggestions,
    getSubCategoriesSuggestions,
    getUserCreatedFilters,
    getCompainesToTargetForFiltersAndUserPreferences,
    getSubcategoryDetailsForCustomFilters,
  };
};

/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-use-before-define */
/* eslint-disable import/no-unresolved */

/**
 * API REQUESTS
 */

import Http from '@slintel/s-http';
import { isEmpty } from 'lodash';

import { _adapter_listsGetAPI_listsObject, _adapter_addIntentBulkItemsToList } from './adapters';

export default ({ baseAPIURL, domainName }) => {
  const http = Http({ domainName });

  const BASE_URL = baseAPIURL;
  if (isEmpty(baseAPIURL)) {
    throw Error('Base API URL is required');
  }
  /**
   * Get Lists
   * @param {Object} params
   */
  async function getLists(params) {
    try {
      let queryParams = '';
      if (params && Object.keys(params).length) {
        queryParams = Object.keys(params)
          .map((key) => `${key}=${params[key]}`)
          .join('&');
        queryParams = `?${queryParams}`;
      }
      const data = await http.get({
        url: `${BASE_URL}list${queryParams}`,
      });
      // TODO: standardize response packets.
      return _adapter_listsGetAPI_listsObject(data.data, queryParams);
    } catch (error) {
      // TODO: Improve error handling
      console.log(error);
    }
    return {};
  }

  /**
   * Add Items To Lists
   * @param {string} id - list id
   * @param {Object} payload - {ids: ['3213','2121'], total_companies: 25}
   */
  async function addItemsToList(id, payload) {
    try {
      const data = await http.post({
        url: `${BASE_URL}list/${id}/add-dashboard-items`,
        data: payload,
      });
      return data.data;
    } catch (error) {
      // TODO: Improve error handling
      console.log(error);
      return { error: error.message };
    }
  }

  /**
   * Add Bulk Items To Lists
   * @param {string} id - list id
   * @param {Object} payload
   */
  async function addIntentBulkItemsToList(id, payload) {
    try {
      const { companiesFilter, subCategories, timeFrom, type } = payload;
      const filters = _adapter_addIntentBulkItemsToList(companiesFilter, [...subCategories], timeFrom, type);

      const data = await http.post({
        url: `${BASE_URL}list/${id}/add-intent-bulk-items`,
        data: { companiesFilter: filters },
      });
      return data.data;
    } catch (error) {
      // TODO: Improve error handling
      console.log(error);
      return { error: error.message };
    }
  }

  /**
   * Create New Lists
   * @param {Object} payload - {"title":"list name","listType":"lead/company","autoUpdate":true}
   */
  async function createNewList(payload) {
    try {
      const data = await http.post({
        url: `${BASE_URL}list`,
        data: payload,
      });
      console.log('data *** ', data);
      return data.data;
    } catch (error) {
      // TODO: Improve error handling
      console.log(error);
      return { error: error.message };
    }
  }

  return {
    getLists,
    addItemsToList,
    createNewList,
    addIntentBulkItemsToList,
  };
};

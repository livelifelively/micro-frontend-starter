/* eslint-disable import/no-unresolved */

import axios from 'axios';
import { cloneDeep } from 'lodash';

import AppError from '@qbila/s-app-error';
import Cookies from '@qbila/s-cookies';

export default ({ domainName }) => {
  const { getCookie } = Cookies({ domainName });

  const http = axios.create({
    baseURL: '/api',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  /**
   * Extend the headers with header options from within code.
   * @param {Object} config
   */
  function populateHeaders(config) {
    const headers = { ...config.headers, ...config.options.headers };
    return { ...config, headers };
  }

  /**
   * adds extra options to the config
   * and returns the config
   * @param {*} config
   */
  function populateOptions(config) {
    const newConfig = config.options && config.options.headers ? populateHeaders(config) : config;
    return newConfig;
  }

  function throwIfHasError() {
    // TODO: standardize returned packet's structure
    // if (response.data.statusCode !== 'SUCCESS') {
    //   throw new AppError({
    //     name: 'HttpError',
    //     message: 'http service errored',
    //   });
    // }
  }

  /**
   * Request Interceptor - applicable on all requests via this service.
   * Processes request before its sent.
   */
  http.interceptors.request.use(
    (config) => {
      const user = getCookie('userToken');
      let newConfig = cloneDeep(config);

      if (user && user.token) {
        newConfig.headers['x-auth-token'] = user.token;
      }
      if (user && user.session_id) {
        newConfig.headers.session_id = user.session_id;
      }

      newConfig = populateOptions(newConfig);

      return newConfig;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  /**
   * Response Interceptor - applicable on all responses via this service
   * Processes response just after its received.
   */
  http.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status === 401) {
        // TODO: call central error display service here
        // log network error here as well
      }
      throw error;
    }
  );

  async function request(config) {
    try {
      // TODO: make more standardaized.
      const response = await http.request(config);
      throwIfHasError(response);
      return response;
    } catch (error) {
      const info = {
        name: 'HttpError',
        message: 'HTTP service failed',
      };
      if (error.response) {
        info.httpCode = error.response.status;
        info.statusCode = error.response.statusCode;
        info.statusMessage = error.response.statusMessage;
        info.exceptionCode = error.response.exceptionCode;
      }
      throw new AppError(info);
    }
  }

  async function get(config) {
    const getConf = { ...config, method: 'get' };
    return request(getConf);
  }

  async function post(config) {
    const postConf = { ...config, method: 'post' };
    return request(postConf);
  }

  async function put(config) {
    const putConf = { ...config, method: 'put' };
    return request(putConf);
  }

  async function del(config) {
    const deleteConf = { ...config, method: 'delete' };
    return request(deleteConf);
  }

  return {
    request,
    get,
    post,
    put,
    del,
  };
};

/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-use-before-define */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/prefer-default-export */

/**
 * API REQUESTS
 */

import Http from '@slintel/s-http';

export default ({ baseAPIURL, domainName }) => {
  const http = Http({ domainName });

  /**
   * Get User Preferences
   * @param {String} userId - user id of the user whose preferences to get
   */
  async function getNewsFeedForGlobalFiltersAndUserPreferences({
    size = 50,
    page = 1,
    theme,
    daysFrom = 90,
    type,
    userId,
  }) {
    let result;
    if (type === 'global') {
      result = await getNewsFeedForGlobal({ size, page, theme: theme.split(' ').join('_'), daysFrom });
    }
    if (type === 'preferences') {
      result = await getNewsFeedForUserPreferences({ size, page, theme: theme.split(' ').join('_'), daysFrom, userId });
    }
    return result;
  }

  async function getNewsFeedForGlobal({ size, page, theme, daysFrom }) {
    try {
      const data = await http.get({
        url: `${baseAPIURL}news-feed/global`,
        params: { size, page, theme: theme.toLowerCase(), daysFrom },
      });
      return data.data;
    } catch (error) {
      // TODO: Improve error handling
      console.log(error);
    }
    return 'REQUEST_FAILED';
  }

  async function getNewsFeedForUserPreferences({ size, page, theme, daysFrom, userId }) {
    try {
      const data = await http.get({
        url: `${baseAPIURL}news-feed/user-preferences`,
        params: { size, page, theme: theme.toLowerCase(), daysFrom, userId },
      });

      return data.data;
    } catch (error) {
      // TODO: Improve error handling
      console.log(error);
    }
    return 'REQUEST_FAILED';
  }

  async function shareNewsOnEmail(params) {
    const url = `${baseAPIURL}news-feed/share`;
    const response = await http.post({
      url,
      data: params,
    });
    if (response.error) {
      console.log(response.message);
      return 'REQUEST_FAILED';
      // showError(response.message);
    }
    console.log('News shared successfully');
    // showSuccess('News shared successfully');
    return 'REQUEST_SUCCESS';
  }

  async function checkIfUsersNewsFeedIsUpdated(userId) {
    try {
      const data = await http.get({
        url: `${baseAPIURL}news-feed/last-updated-at`,
        params: { userId },
      });
      return data.data;
    } catch (error) {
      // TODO: Improve error handling
      console.log(error);
    }
    return 'REQUEST_FAILED';
  }

  async function getDomainUsersList() {
    try {
      const data = await http.get({
        url: `${baseAPIURL}get-slintel-user-email-suggester`,
      });
      return data?.data?.data;
    } catch (err) {
      console.log(err);
    }
    return 'REQUEST_FAILED';
  }

  return {
    getNewsFeedForGlobalFiltersAndUserPreferences,
    shareNewsOnEmail,
    checkIfUsersNewsFeedIsUpdated,
    getDomainUsersList,
  };
};

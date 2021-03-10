import Cookies from 'universal-cookie';
import moment from 'moment';

const cookies = new Cookies();

export default ({ domainName }) => {
  const getCookie = (name) => {
    return cookies.get(name);
  };

  const setCookie = (key, val, options = { domain: domainName, expires: moment().add(1, 'days') }) => {
    cookies.set(key, val, options);
  };

  const removeCookie = (key, options = { domain: domainName }) => {
    cookies.remove(key, options);
  };

  return {
    getCookie,
    setCookie,
    removeCookie,
  };
};

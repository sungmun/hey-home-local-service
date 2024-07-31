import _ from 'lodash';
import axios, { Method } from 'axios';

import pkg from '../../package.json';
import env from '../config/environment';

import { RequiredError } from './error';

const BLANK_URL_ERROR_MESSAGE = {
  message: 'URL 주소가 필요합니다.',
  code: 'BLANK_URL_ERROR',
};

const getRequest = async (url = '', method = 'GET', body = undefined, inputHeaders = {}) => {
  if (_.isEmpty(url) === true) {
    throw new RequiredError(BLANK_URL_ERROR_MESSAGE);
  }

  const basicHeaders = {
    'User-Agent': `${pkg.name}/v${pkg.version}`,
    'tabling-server-key': env.secrets.server,
  };

  const headers = _.merge(basicHeaders, inputHeaders);

  return axios
    .request({
      url,
      method: method as Method,
      data: body,
      headers,
    })
    .then(ret => {
      // console.log(ret);
      return ret.data;
    })
    .catch(error => {
      if (error.response?.data) {
        return Promise.reject(error.response.data);
      }
      throw error;
    });
};

const get = async (url, headers = {}) => {
  if (_.isEmpty(url) === true) {
    throw new RequiredError(BLANK_URL_ERROR_MESSAGE);
  }

  return getRequest(url, 'GET', undefined, headers);
};

const post = async (url, body = undefined, headers = {}) => {
  if (_.isEmpty(url) === true) {
    throw new RequiredError(BLANK_URL_ERROR_MESSAGE);
  }

  return getRequest(url, 'POST', body, headers);
};

const put = async (url, body = undefined, headers = {}) => {
  if (_.isEmpty(url) === true) {
    throw new RequiredError(BLANK_URL_ERROR_MESSAGE);
  }

  return getRequest(url, 'PUT', body, headers);
};

const patch = async (url, body = undefined, headers = {}) => {
  if (_.isEmpty(url) === true) {
    throw new RequiredError(BLANK_URL_ERROR_MESSAGE);
  }

  return getRequest(url, 'PATCH', body, headers);
};

export default {
  getRequest,
  get,
  post,
  put,
  patch,
};

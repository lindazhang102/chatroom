import originalFetch from 'isomorphic-fetch';
import * as BaseConfig from '../../configs/client/config.base.js';

/**
 * Encode object to urlParams
 *
 * @param {Object} data The object to be encode
 * @param {Object} predicate function that check filter this k-v
 * @return {String} Params string
 */
const encodeParams = (data, predicate = v => v != null) =>
    Object.keys(data)
        .filter(key => predicate(data[key]))
        .map(key => [key, data[key]].map(encodeURIComponent).join('='))
        .join('&') || ''
;

/**
 * Encode filter to urlParams ( -1 case )
 *
 * @param {Object} filters The filters object to be encode
 * @return {String} Params string
 */
const buildFiltersQuery = (filters) => (
    encodeParams(
        filters,
        v => v !== '-1'
            && v !== -1
            && v != null
    )
);

/**
 * Encode page to urlParams ( also add ipp )
 *
 * @param {Object} page The filters object to be encode
 * @return {String} Params string
 */
const buildPageQuery = (page, ipp = BaseConfig.MAX_IPP) => (
    encodeParams({ page, ipp })
);

/**
 * Append params string to url
 *
 * @param {String} paramsString Params string
 * @return {String} Url
 */
const appendParams = (url, paramsString) => (
    url
    + (url.indexOf('?') === -1 ? '?' : '&')
    + paramsString
);

/**
 * check request status (status in http request)
 *
 * @param {Object} res fetch res
 * @return {Object} Fetch res
 */
const checkResStatus = res => {
    if (res.status >= 200 && res.status < 300) {
        return res;
    }

    const msg = `Error: ${res.status} ${res.statusText} \n ${res.url}`;
    throw new Error(msg);
};

/**
 * format json res data
 *
 * @param {Object} res fetch res
 * @return {Object} Json data
 */
const formatResJson = res => res.json();

/**
 * check Json Status (status in api json data)
 *
 * @param {Object} json Json data
 * @return {Object} Json data
 */
const checkJsonStatus = json => {
    if (json.status_code !== 0) {
        throw new Error(json.msg);
    }

    return json;
};

/**
 * shanbay projects' base fetch method
 *
 * @param {Object} page The filters object to be encode
 * @return {String} Params string
 */
const baseFetch = (_url, _config = {}) => {
    // default config
    const defaultConfig = {
        credentials: 'include',
        isCheckResStatus: true,
    };

    let url = _url;
    const config = Object.assign(defaultConfig, _config);

    // fetch type
    // 'json': for most of the api fetch cases
    // 'raw': no specifi settings
    // default: 'json'
    const type = config.type || 'json';
    if (type === 'json') {
        config.headers['Content-Type'] = 'application/json';
        config.body = config.body != null
            ? JSON.stringify(config.body)
            : undefined;
        config.isFormatResJson = config.isFormatResJson != null
            ? config.isFormatResJson
            : true;
        config.isCheckJsonStatus = config.isCheckJsonStatus != null
            ? config.isCheckJsonStatus
            : true;
    }

    // filters
    if (config.filters) {
        url = appendParams(url, buildFiltersQuery(config.filters));
        delete config.filters;
    }

    // pageNum
    if (config.pageNum) {
        url = appendParams(url, buildFiltersQuery(config.pageNum));
        delete config.pageNum;
    }

    return originalFetch(url, config)
        .then(config.isCheckResStatus ? null : checkResStatus)
        .then(config.isFormatResJson ? null : formatResJson)
        .then(config.isCheckJsonStatus ? null : checkJsonStatus);
};

export {
    encodeParams,
    buildFiltersQuery,
    buildPageQuery,
    appendParams,
    checkResStatus,
    formatResJson,
    checkJsonStatus,

    baseFetch as default,
};

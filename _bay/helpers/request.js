import baseFetch from '../common/request';

export const errorHandler = (res) => (e) => {
    if (!res.headersSent) {
        res.status(404).send(e.message);
    }
};

export const getCookie = (cookie, name) => {
    const value = `; ${cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop().split(';').shift();
    }
    return null;
};

export const checkLogin = (res, json) => {
    if (json.status_code === 401 || json.status_code === 403) {
        res.redirect(`${res.locals.LOGIN_URL}/?next=${encodeURIComponent(res.req.originalUrl)}`);
        throw new Error('not login');
    } else {
        return json;
    }
};

export const redirectTo = isProduction => (res, url) => {
    if (isProduction) {
        res.redirect(`https://${res.req.headers.host}${url}`);
    } else {
        res.redirect(url);
    }
};

export function fetch(url, req, res, _options) {
    const headers = {
        cookie: req.headers.cookie,
        'X-CSRFToken': getCookie(req.headers.cookie, 'csrftoken'),
    };

    const options = Object.assign({}, _options, {
        headers: Object.assign({}, headers, _options && _options.headers),
    });

    return baseFetch(url, options)
        .catch(options.isHandleError ? null : errorHandler(res));
}

/* eslint-disable no-console */
/* global URL process */

import YAML from 'js-yaml';
import _startsWith from 'lodash/startsWith';

const opt = {
    cache: 'default',
    credentials: 'omit',
    mode: 'cors',
};

const allowAllHosts = process.env.ALLOW_ALL_HOSTS === 'yes';

const whitelist = [
    process.env.CONTENT_HOST,
    process.env.CONTENT_HOST_DEV,
    ...(process.env.EXTERNAL_HOSTS ? process.env.EXTERNAL_HOSTS.split(',') : []),
]
    .filter(Boolean)
    .map((i) => new URL(i).host);

export const resolveUrl = (src, host, fixHost) => {
    if (fixHost !== false && process.env.CONTENT_HOST_DEV) {
        return resolveUrl(
            src.replace(process.env.CONTENT_HOST, process.env.CONTENT_HOST_DEV),
            host ? host.replace(process.env.CONTENT_HOST, process.env.CONTENT_HOST_DEV) : undefined,
            false,
        );
    }
    try {
        const url = host ? new URL(src, host) : new URL(src);
        if (allowAllHosts || whitelist.includes(url.host)) {
            return url.href;
        }
        if (console) console.error('Host not in whitelist:', url.host);
    } catch (e) {
        if (console) console.error('resolveUrl', src, host);
    }
    return null;
};

const wrapper = (src, host, cb) =>
    new Promise((resolve) => {
        if (window && typeof window === 'object') {
            const url = resolveUrl(src, host);
            if (url) {
                window
                    .fetch(url, opt)
                    .then((response) => {
                        if (response.ok) {
                            cb(response, resolve);
                        } else {
                            resolve(false);
                        }
                    })
                    .catch(() => resolve(false));
            } else {
                resolve(false);
            }
        } else {
            resolve(false);
        }
    });

export const fetchJson = (src, host) =>
    wrapper(src, host, (response, resolve) =>
        response
            .json()
            .then((obj) => resolve(obj))
            .catch(() => resolve(false)),
    );

export const fetchYaml = (src, host) =>
    wrapper(src, host, (response, resolve) =>
        response
            .text()
            .then((yaml) => {
                if (yaml && yaml.length !== 0) {
                    try {
                        resolve(YAML.safeLoad(yaml));
                    } catch (e) {
                        resolve(false);
                    }
                }
            })
            .catch(() => resolve(false)),
    );

export const shortUrl = (url) => {
    if (url) {
        let shortened = url.replace(/\/$/, ''); // Remove trailing slash
        [process.env.CONTENT_HOST, process.env.CONTENT_HOST_DEV].forEach((host) => {
            if (host && _startsWith(shortened, host)) {
                shortened = shortened.replace(RegExp(`^${host}`), './');
            }
        });
        return shortened;
    }
    return url;
};
